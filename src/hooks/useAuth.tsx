import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

type UserRole = 'admin' | 'store' | null;

/**
 * 擴充後的 User 型別
 */
export type EnrichedUser = User & {
  profile: Tables<'profiles'> | null;
  accessibleStores: Array<{
    role: Tables<'store_users'>['role'];
    store: Pick<Tables<'stores'>, 'id' | 'name' | 'status'>;
  }>;
  isSuperAdmin: boolean;
};

/**
 * Auth Context 型別
 */
interface AuthContextType {
  session: Session | null;
  user: EnrichedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    storeName: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<EnrichedUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 取得完整用戶資料
   */
  const fetchUserDetails = async (baseUser: User): Promise<EnrichedUser> => {
    const [profileRes, storeUsersRes, adminRoleRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', baseUser.id)
        .maybeSingle(),

      supabase
        .from('store_users')
        .select('role, stores(id, name, status)')
        .eq('user_id', baseUser.id)
        .eq('status', '啟用'),

      supabase.rpc('has_role', {
        _role: 'admin',
        _user_id: baseUser.id,
      }),
    ]);

    if (profileRes.error) console.error(profileRes.error);
    if (storeUsersRes.error) console.error(storeUsersRes.error);
    if (adminRoleRes.error) console.error(adminRoleRes.error);

    const accessibleStores =
      storeUsersRes.data
        ?.map((su) => {
          // 增加一個型別檢查，確保 su.stores 是一個物件而不是 null
          if (su.stores && typeof su.stores === 'object' && !Array.isArray(su.stores)) {
            return {
              store: su.stores as Pick<Tables<'stores'>, 'id' | 'name' | 'status'>,
              role: su.role,
            };
          }
          return null;
        })
        .filter((s): s is NonNullable<typeof s> => s !== null) ?? [];

    return {
      ...baseUser,
      profile: profileRes.data,
      accessibleStores,
      isSuperAdmin: adminRoleRes.data === true,
    };
  };

  /**
   * Auth state listener
   */
  useEffect(() => {
    // 處理 session 變化的函式
    const handleSessionChange = async (session: Session | null) => {
      setLoading(true);
      setSession(session);
      if (session?.user) {
        const enrichedUser = await fetchUserDetails(session.user);
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // 首次載入時取得 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
    });

    // 監聽後續的 auth 狀態變化
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Auth actions
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    storeName: string
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          user_name: storeName,
        },
      },
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
