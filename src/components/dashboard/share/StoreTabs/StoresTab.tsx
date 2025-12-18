import { useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

import StoresList from './StoreForm/StoresList';
import StoreForm from './StoreForm/StoreForm';
import StoreUsersList from './StoreUserForm/StoreUsersList';
import StoreUserForm from './StoreUserForm/StoreUserForm';
import { Store, StoreUser, StoreFormData, StoreUserFormData } from './types';
import { useUserRole } from '@/hooks/useUserRole';
import type { StoreWithRole } from './types';
type ViewMode = 'list' | 'add-store' | 'edit-store' | 'users' | 'add-user' | 'edit-user';

export default function StoresTab() {
    const { user } = useAuth();
    const { isAdmin, isManager } = useUserRole();

    const [stores, setStores] = useState<StoreWithRole[]>([]);
    const [storeUsers, setStoreUsers] = useState<StoreUser[]>([]);
    const [selectedStore, setSelectedStore] = useState<StoreWithRole | null>(null);
    const [selectedUser, setSelectedUser] = useState<StoreUser | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setIsLoading(true);
        if (!user) return;

        try {
            // Use RPC to get stores and user's role in each store
            const { data, error } = await supabase.rpc('get_user_stores_with_roles', {
                p_user_id: user.id,
            }) as { data: StoreWithRole[] | null; error: any };

            if (error) throw error;

            if (Array.isArray(data)) {
                // Sort by created_at descending, as the RPC doesn't guarantee order
                data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setStores(data);
            } else {
                setStores([]);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('無法載入店家資料');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStoreUsers = async (storeId: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('store_users')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch profiles for users
            const userIds = data?.map(u => u.user_id) || [];
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, email, user_name')
                    .in('id', userIds);

                const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
                const usersWithProfiles = data?.map(u => ({
                    ...u,
                    profile: profilesMap.get(u.user_id),
                })) || [];

                setStoreUsers(usersWithProfiles);
            } else {
                setStoreUsers([]);
            }
        } catch (error) {
            console.error('Error fetching store users:', error);
            toast.error('無法載入用戶資料');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStore = () => {
        setSelectedStore(null);
        setViewMode('add-store');
    };

    const handleEditStore = (store: StoreWithRole) => {
        setSelectedStore(store);
        setViewMode('edit-store');
    };

    const handleManageUsers = (store: StoreWithRole) => {
        setSelectedStore(store);
        fetchStoreUsers(store.id);
        setViewMode('users');
    };

    const handleSubmitStore = async (data: StoreFormData) => {
        setIsSubmitting(true);
        try {
            const storeData = {
                name: data.name,
                parent_store_id: data.parent_store_id || null,
                address: data.address || null,
                phone: data.phone || null,
                status: data.status,
            };
            console.log('提交資料 store data:', storeData);
            if (selectedStore) {
                const { error } = await supabase
                    .from('stores')
                    .update(storeData)
                    .eq('id', selectedStore.id);

                if (error) throw error;
                toast.success('店家已更新');
            } else {
                const { error } = await supabase
                    .from('stores')
                    .insert(storeData);

                if (error) throw error;
                toast.success('店家已新增');
            }

            fetchStores();
            setViewMode('list');
        } catch (error: any) {
            console.error('Error saving store:', error);
            toast.error(error.message || '儲存店家失敗');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setViewMode('add-user');
    };

    const handleEditUser = (user: StoreUser) => {
        setSelectedUser(user);
        setViewMode('edit-user');
    };

    const handleSubmitUser = async (data: StoreUserFormData) => {
        if (!selectedStore) return;
        setIsSubmitting(true);

        try {
            if (selectedUser) {
                // --- 1. 更新現有用戶 ---

                // A. 更新 store_users 表 (角色與狀態)
                const { error: userError } = await supabase
                    .from('store_users')
                    .update({
                        role: data.role,
                        status: data.status,
                    })
                    .eq('id', selectedUser.id);

                if (userError) throw userError;

                // B. 更新 profiles 表 (員工名稱)
                // 注意：這取決於你的 RLS 政策是否允許管理者修改他人的 profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        user_name: data.user_name, // 這裡同步更新 user_name
                    })
                    .eq('id', selectedUser.user_id);

                if (profileError) {
                    console.warn('Profile 名稱更新失敗，可能是權限不足:', profileError);
                    // 這裡可以選擇報錯或僅給予警告
                }

                toast.success('用戶資料已更新');
            } else {
                // --- 2. 新增用戶 ---

                // A. 先透過 Email 尋找用戶 Profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('email', data.email.trim())
                    .maybeSingle();

                if (profileError) throw profileError;
                if (!profile) {
                    toast.error('找不到此 Email 的用戶，請確認用戶已註冊');
                    setIsSubmitting(false);
                    return;
                }

                // B. 檢查用戶是否已在該店
                const { data: existing } = await supabase
                    .from('store_users')
                    .select('id')
                    .eq('store_id', selectedStore.id)
                    .eq('user_id', profile.id)
                    .maybeSingle();

                if (existing) {
                    toast.error('此用戶已在店家中');
                    setIsSubmitting(false);
                    return;
                }

                // C. 加入 store_users 關聯
                const { error: insertError } = await supabase
                    .from('store_users')
                    .insert({
                        store_id: selectedStore.id,
                        user_id: profile.id,
                        role: data.role,
                        status: data.status,
                    });

                if (insertError) throw insertError;

                // D. (選填) 新增時是否也要同步更新他的 user_name?
                if (data.user_name) {
                    await supabase
                        .from('profiles')
                        .update({ user_name: data.user_name })
                        .eq('id', profile.id);
                }

                toast.success('用戶已新增至店家');
            }

            fetchStoreUsers(selectedStore.id);
            setViewMode('users');
        } catch (error: any) {
            console.error('Error saving user:', error);
            toast.error(error.message || '儲存用戶失敗');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToList = () => {
        setSelectedStore(null);
        setSelectedUser(null);
        setViewMode('list');
    };

    const handleBackToUsers = () => {
        setSelectedUser(null);
        setViewMode('users');
    };

    return (
        <div className="space-y-4">
            {viewMode === 'list' && (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">店家管理</h2>
                        {(isAdmin || isManager) && (
                            <Button onClick={handleAddStore}>
                                <Plus className="w-4 h-4 mr-2" />
                                新增店家
                            </Button>
                        )}
                    </div>
                    <StoresList
                        isAdmin={isAdmin}
                        stores={stores}
                        onEdit={handleEditStore}
                        onManageUsers={handleManageUsers}
                        isLoading={isLoading}
                    />
                </>
            )}

            {(viewMode === 'add-store' || viewMode === 'edit-store') && (
                <StoreForm store={selectedStore} stores={stores} onSubmit={handleSubmitStore} onCancel={handleBackToList} isLoading={isSubmitting} />
            )}

            {viewMode === 'users' && selectedStore && (
                <StoreUsersList store={selectedStore} users={storeUsers} onBack={handleBackToList} onAddUser={handleAddUser} onEditUser={handleEditUser} isLoading={isLoading} />
            )}

            {(viewMode === 'add-user' || viewMode === 'edit-user') && selectedStore && (
                <StoreUserForm
                    storeUser={selectedUser}
                    storeName={selectedStore.name}
                    onSubmit={handleSubmitUser}
                    onCancel={handleBackToUsers}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}
