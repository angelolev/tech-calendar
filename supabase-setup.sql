-- Supabase Authentication Setup SQL
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- ===================================================================
-- 1. CREAR TABLA PROFILES
-- ===================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas rápidas por rol
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ===================================================================
-- 2. TRIGGER PARA AUTO-CREAR PERFIL AL REGISTRARSE
-- ===================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================================================
-- 3. RLS PARA TABLA PROFILES
-- ===================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Los perfiles son visibles por todos
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===================================================================
-- 4. ACTUALIZAR TABLA EVENTS
-- ===================================================================

-- Agregar columnas si no existen
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'events' AND column_name = 'created_by') THEN
    ALTER TABLE events ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'events' AND column_name = 'updated_at') THEN
    ALTER TABLE events ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'events' AND column_name = 'whatsapp') THEN
    ALTER TABLE events ADD COLUMN whatsapp TEXT;
  END IF;
END $$;

-- Crear índice para created_by
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Eliminar políticas públicas existentes
DROP POLICY IF EXISTS "Allow public read access" ON events;
DROP POLICY IF EXISTS "Allow public insert access" ON events;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Only admins can create events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;

-- Habilitar RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Nuevas políticas RLS

-- 1. Todos pueden ver eventos (calendario público)
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- 2. Solo admins pueden crear eventos
CREATE POLICY "Only admins can create events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 3. Solo admins pueden actualizar eventos
CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 4. Solo admins pueden eliminar eventos
CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_updated_at ON events;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- 5. CREAR TABLA EVENT_INTERESTS
-- ===================================================================

CREATE TABLE IF NOT EXISTS event_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_interests_user ON event_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_interests_event ON event_interests(event_id);

-- Habilitar RLS
ALTER TABLE event_interests ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Interests are viewable by everyone" ON event_interests;
DROP POLICY IF EXISTS "Authenticated users can show interest" ON event_interests;
DROP POLICY IF EXISTS "Users can remove own interest" ON event_interests;

-- 1. Los intereses son visibles por todos
CREATE POLICY "Interests are viewable by everyone"
  ON event_interests FOR SELECT
  USING (true);

-- 2. Usuarios autenticados pueden mostrar interés
CREATE POLICY "Authenticated users can show interest"
  ON event_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Usuarios pueden quitar su propio interés
CREATE POLICY "Users can remove own interest"
  ON event_interests FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================================================
-- 6. FUNCIÓN PARA ASIGNAR ADMIN
-- ===================================================================

CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE NOTICE 'No se encontró usuario con email: %', user_email;
  ELSE
    RAISE NOTICE 'Usuario % ahora es admin', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- FINALIZADO
-- ===================================================================

-- Para asignar tu primer admin, ejecuta después de iniciar sesión:
-- SELECT make_user_admin('tu-email@gmail.com');
