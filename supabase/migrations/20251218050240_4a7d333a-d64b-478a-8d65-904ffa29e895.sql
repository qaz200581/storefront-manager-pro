-- 1. 建立 get_user_stores_with_roles 函數
CREATE OR REPLACE FUNCTION public.get_user_stores_with_roles(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  parent_store_id uuid,
  address text,
  phone text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  user_role store_role
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- 如果是 admin，返回所有店家
  SELECT 
    s.id, s.name, s.parent_store_id, s.address, s.phone, s.status, s.created_at, s.updated_at,
    su.role as user_role
  FROM public.stores s
  LEFT JOIN public.store_users su ON s.id = su.store_id AND su.user_id = p_user_id AND su.status = '啟用'
  WHERE has_role(p_user_id, 'admin')
  
  UNION
  
  -- 如果是 manager，返回所有店家（可新增）以及有關聯的店家（可編輯）
  SELECT 
    s.id, s.name, s.parent_store_id, s.address, s.phone, s.status, s.created_at, s.updated_at,
    su.role as user_role
  FROM public.stores s
  LEFT JOIN public.store_users su ON s.id = su.store_id AND su.user_id = p_user_id AND su.status = '啟用'
  WHERE has_role(p_user_id, 'manager') AND s.status = '啟用'
  
  UNION
  
  -- 如果是一般用戶，只返回有關聯的店家
  SELECT 
    s.id, s.name, s.parent_store_id, s.address, s.phone, s.status, s.created_at, s.updated_at,
    su.role as user_role
  FROM public.stores s
  INNER JOIN public.store_users su ON s.id = su.store_id
  WHERE su.user_id = p_user_id 
    AND su.status = '啟用' 
    AND s.status = '啟用'
    AND NOT has_role(p_user_id, 'admin')
    AND NOT has_role(p_user_id, 'manager')
$$;

-- 2. 建立 get_user_app_role 函數 (取得用戶最高權限)
CREATE OR REPLACE FUNCTION public.get_user_app_role(p_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = p_user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'manager' THEN 2
      WHEN 'store_manager' THEN 3
      WHEN 'store' THEN 4
    END
  LIMIT 1
$$;

-- 3. 更新 stores 表的 RLS 政策
DROP POLICY IF EXISTS "Admin 可管理所有店家" ON public.stores;
DROP POLICY IF EXISTS "用戶可查看有權限的店家" ON public.stores;
DROP POLICY IF EXISTS "店長可編輯自己的店家" ON public.stores;

-- Admin 和 Manager 可查看所有店家
CREATE POLICY "Admin 和 Manager 可查看所有店家" ON public.stores
FOR SELECT USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')
);

-- Admin 可管理所有店家
CREATE POLICY "Admin 可完全管理店家" ON public.stores
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Manager 可新增店家
CREATE POLICY "Manager 可新增店家" ON public.stores
FOR INSERT WITH CHECK (has_role(auth.uid(), 'manager'));

-- Manager 可編輯自己關聯的店家
CREATE POLICY "Manager 可編輯關聯店家" ON public.stores
FOR UPDATE USING (
  has_role(auth.uid(), 'manager') AND
  user_has_store_access(auth.uid(), id)
);

-- Store Manager 可編輯自己的店家
CREATE POLICY "Store Manager 可編輯自己的店家" ON public.stores
FOR UPDATE USING (
  user_store_role(auth.uid(), id) = 'store_manager'
);

-- 一般用戶可查看有權限的店家
CREATE POLICY "用戶可查看關聯店家" ON public.stores
FOR SELECT USING (
  id IN (SELECT get_user_accessible_stores(auth.uid()))
);

-- 4. 更新 store_users 表的 RLS 政策
DROP POLICY IF EXISTS "Admin 可管理所有店家用戶" ON public.store_users;
DROP POLICY IF EXISTS "店長可查看店家內所有用戶" ON public.store_users;
DROP POLICY IF EXISTS "店長可管理店家內員工" ON public.store_users;
DROP POLICY IF EXISTS "用戶可查看自己的店家關聯" ON public.store_users;

-- Admin 可管理所有店家用戶
CREATE POLICY "Admin 可管理所有店家用戶" ON public.store_users
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Manager 可查看和管理關聯店家的用戶
CREATE POLICY "Manager 可管理關聯店家用戶" ON public.store_users
FOR ALL USING (
  has_role(auth.uid(), 'manager') AND
  user_has_store_access(auth.uid(), store_id)
);

-- Store Manager 只能查看和管理 employee
CREATE POLICY "Store Manager 可查看店家用戶" ON public.store_users
FOR SELECT USING (
  user_store_role(auth.uid(), store_id) = 'store_manager'
);

CREATE POLICY "Store Manager 可管理員工" ON public.store_users
FOR ALL USING (
  user_store_role(auth.uid(), store_id) = 'store_manager' AND
  role = 'employee'
);

-- 用戶可查看自己的關聯
CREATE POLICY "用戶可查看自己的店家關聯" ON public.store_users
FOR SELECT USING (user_id = auth.uid());

-- 5. 更新 orders 表的 RLS 政策
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Admin 可管理所有訂單
CREATE POLICY "Admin 可完全管理訂單" ON public.orders
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Manager 可查看和管理關聯店家的訂單
CREATE POLICY "Manager 可管理關聯店家訂單" ON public.orders
FOR ALL USING (
  has_role(auth.uid(), 'manager') AND
  store_id IN (SELECT get_user_accessible_stores(auth.uid()))
);

-- Store Manager 可查看和新增訂單，僅能修改未完成訂單
CREATE POLICY "Store Manager 可查看店家訂單" ON public.orders
FOR SELECT USING (
  store_id IN (SELECT get_user_accessible_stores(auth.uid()))
);

CREATE POLICY "Store Manager 可新增訂單" ON public.orders
FOR INSERT WITH CHECK (
  store_id IN (SELECT get_user_accessible_stores(auth.uid()))
);

CREATE POLICY "Store Manager 可修改未完成訂單" ON public.orders
FOR UPDATE USING (
  store_id IN (SELECT get_user_accessible_stores(auth.uid())) AND
  status NOT IN ('completed', 'cancelled')
);

-- Employee 只能查看和新增訂單
CREATE POLICY "Employee 可查看訂單" ON public.orders
FOR SELECT USING (
  store_id IN (SELECT get_user_accessible_stores(auth.uid()))
);

CREATE POLICY "Employee 可新增訂單" ON public.orders
FOR INSERT WITH CHECK (
  store_id IN (SELECT get_user_accessible_stores(auth.uid()))
);