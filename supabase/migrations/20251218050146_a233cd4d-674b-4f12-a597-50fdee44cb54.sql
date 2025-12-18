-- 1. 重命名 profiles.store_name 為 user_name
ALTER TABLE public.profiles RENAME COLUMN store_name TO user_name;

-- 2. 更新 app_role enum (新增 manager 和 store_manager)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'store_manager';

-- 3. 更新 store_role enum (將 owner 改為 store_manager)
ALTER TYPE public.store_role RENAME VALUE 'owner' TO 'store_manager';

-- 4. 更新 handle_new_user 觸發器函數，使用 user_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'user_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'store');
  
  RETURN NEW;
END;
$$;