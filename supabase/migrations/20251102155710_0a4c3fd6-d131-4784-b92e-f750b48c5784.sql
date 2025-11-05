-- ============================================================================
-- PHASE 1: MARKET360 CORE DATABASE SCHEMA
-- Complete marketplace backend with authentication, roles, and security
-- ============================================================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'admin');

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected', 'requested_info');

-- Create store status enum
CREATE TYPE public.store_status AS ENUM ('active', 'suspended', 'closed');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Create escrow status enum
CREATE TYPE public.escrow_status AS ENUM ('held', 'released', 'refunded');

-- Create payout status enum
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================================================
-- 1. USERS & PROFILES TABLE
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  display_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- 2. USER ROLES TABLE (CRITICAL: Separate table for security)
-- ============================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Only admins can insert/update/delete roles
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- ============================================================================
-- 3. SECURITY DEFINER FUNCTION (prevent recursive RLS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================================
-- 4. SELLER APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE public.seller_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_data JSONB NOT NULL,
  id_documents TEXT[],
  business_documents TEXT[],
  status application_status DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "seller_applications_select_own" ON public.seller_applications
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Users can insert their own applications
CREATE POLICY "seller_applications_insert_own" ON public.seller_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending applications
CREATE POLICY "seller_applications_update_own" ON public.seller_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can update any application
CREATE POLICY "seller_applications_admin_update" ON public.seller_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_seller_applications_user ON public.seller_applications(user_id);
CREATE INDEX idx_seller_applications_status ON public.seller_applications(status);

-- ============================================================================
-- 5. STORES TABLE
-- ============================================================================
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  location JSONB,
  verified BOOLEAN DEFAULT false,
  status store_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Stores are viewable by everyone
CREATE POLICY "stores_select_all" ON public.stores
  FOR SELECT USING (true);

-- Store owners and admins can update stores
CREATE POLICY "stores_update_own" ON public.stores
  FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Only admins can create stores (after approval)
CREATE POLICY "stores_admin_insert" ON public.stores
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE INDEX idx_stores_user ON public.stores(user_id);
CREATE INDEX idx_stores_slug ON public.stores(slug);
CREATE INDEX idx_stores_status ON public.stores(status);

-- ============================================================================
-- 6. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID,
  tags TEXT[],
  price NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  moq INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Published products viewable by all
CREATE POLICY "products_select_published" ON public.products
  FOR SELECT USING (published = true OR EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = products.store_id AND stores.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

-- Store owners can manage their products
CREATE POLICY "products_owner_all" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id AND stores.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_products_store ON public.products(store_id);
CREATE INDEX idx_products_published ON public.products(published);
CREATE INDEX idx_products_title ON public.products USING gin(to_tsvector('simple', title));

-- ============================================================================
-- 7. PRODUCT IMAGES TABLE
-- ============================================================================
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Images viewable when product is viewable
CREATE POLICY "product_images_select_published" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_images.product_id AND products.published = true
    ) OR EXISTS (
      SELECT 1 FROM public.products 
      JOIN public.stores ON stores.id = products.store_id
      WHERE products.id = product_images.product_id AND stores.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

-- Store owners can manage their product images
CREATE POLICY "product_images_owner_all" ON public.product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products 
      JOIN public.stores ON stores.id = products.store_id
      WHERE products.id = product_images.product_id AND stores.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- ============================================================================
-- 8. PRODUCT VARIANTS TABLE
-- ============================================================================
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT,
  attributes JSONB,
  price NUMERIC(12,2),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Variants inherit product visibility
CREATE POLICY "product_variants_select" ON public.product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_variants.product_id AND products.published = true
    ) OR EXISTS (
      SELECT 1 FROM public.products 
      JOIN public.stores ON stores.id = products.store_id
      WHERE products.id = product_variants.product_id AND stores.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

-- Store owners manage variants
CREATE POLICY "product_variants_owner_all" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products 
      JOIN public.stores ON stores.id = products.store_id
      WHERE products.id = product_variants.product_id AND stores.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

-- ============================================================================
-- 9. CART ITEMS TABLE
-- ============================================================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only access their own cart
CREATE POLICY "cart_items_own" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);

-- ============================================================================
-- 10. ORDERS TABLE
-- ============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  store_id UUID REFERENCES public.stores(id) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status order_status DEFAULT 'pending',
  payment_provider TEXT,
  payment_reference TEXT,
  escrow_release BOOLEAN DEFAULT false,
  shipping_info JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Buyers, sellers, and admins can view orders
CREATE POLICY "orders_select" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()
    ) OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Buyers can create orders
CREATE POLICY "orders_insert_buyer" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Buyers, sellers, and admins can update orders
CREATE POLICY "orders_update" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()
    ) OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_store ON public.orders(store_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================================================
-- 11. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order items inherit order visibility
CREATE POLICY "order_items_select" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND (
        orders.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.stores 
          WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()
        ) OR 
        public.has_role(auth.uid(), 'admin')
      )
    )
  );

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- ============================================================================
-- 12. AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "audit_logs_admin_select" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================================
-- 13. SETTINGS TABLE (key-value for app configuration)
-- ============================================================================
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Settings viewable by all
CREATE POLICY "settings_select_all" ON public.settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "settings_admin_modify" ON public.settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_applications_updated_at BEFORE UPDATE ON public.seller_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  -- Give all new users the 'buyer' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();