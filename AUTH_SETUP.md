# Configuración de Autenticación con Google OAuth

Esta guía te ayudará a configurar la autenticación con Google OAuth y el sistema de permisos basado en roles.

## 📋 Requisitos Previos

- Cuenta de Supabase activa
- Proyecto de Supabase configurado
- Cuenta de Google Cloud Platform

## 🔧 Paso 1: Configurar Base de Datos

### 1.1 Ejecutar Script SQL

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Abre el archivo `supabase-setup.sql`
4. Copia todo el contenido y pégalo en el editor SQL
5. Click en **Run** para ejecutar el script

Este script creará:
- ✅ Tabla `profiles` para información de usuarios
- ✅ Tabla `event_interests` para sistema de interés
- ✅ Triggers automáticos para crear perfiles
- ✅ Políticas RLS (Row Level Security) para permisos
- ✅ Función `make_user_admin()` para asignar admins

## 🔑 Paso 2: Configurar Google OAuth

### 2.1 Crear Credenciales en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services** > **Credentials**
4. Click en **Create Credentials** > **OAuth client ID**
5. Selecciona **Web application**
6. Configura:
   - **Name**: "Tech Calendar Auth"
   - **Authorized redirect URIs**: Agrega tu URL de callback de Supabase:
     ```
     https://[TU-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Reemplaza `[TU-PROJECT-ID]` con tu ID real de proyecto

7. Click en **Create**
8. **Guarda** el Client ID y Client Secret

### 2.2 Configurar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Authentication** > **Providers**
3. Encuentra **Google** en la lista
4. Activa el toggle para habilitar Google
5. Ingresa:
   - **Client ID**: El que copiaste de Google Cloud
   - **Client Secret**: El que copiaste de Google Cloud
6. Click en **Save**

## 👤 Paso 3: Asignar Primer Admin

### 3.1 Iniciar Sesión en la App

1. Ejecuta tu app localmente: `npm run dev`
2. Abre el navegador en `http://localhost:5173`
3. Click en **"Iniciar sesión"**
4. Completa el flujo de OAuth con tu cuenta de Google
5. Copia tu email exacto que usaste para iniciar sesión

### 3.2 Asignar Rol de Admin

1. Ve a Supabase Dashboard > **SQL Editor**
2. Ejecuta el siguiente comando (reemplaza con tu email):
   ```sql
   SELECT make_user_admin('tu-email@gmail.com');
   ```
3. Verás un mensaje confirmando el cambio
4. Recarga la app en el navegador
5. Deberías ver un badge "Admin" junto a tu nombre

## ✅ Paso 4: Verificar Configuración

### Prueba de Autenticación

- [ ] Puedes iniciar sesión con Google
- [ ] Aparece tu avatar y nombre en el header
- [ ] La sesión persiste al recargar la página
- [ ] Puedes cerrar sesión correctamente

### Prueba de Permisos Admin

- [ ] Aparece badge "Admin" junto a tu nombre
- [ ] Puedes crear eventos al hacer click en un día
- [ ] Al abrir un evento, aparecen botones "Editar" y "Eliminar"
- [ ] Puedes editar eventos existentes
- [ ] Puedes eliminar eventos con confirmación

### Prueba de Usuario Regular

1. Cierra sesión de tu cuenta admin
2. Inicia sesión con una cuenta diferente de Google
3. Verifica que:
   - [ ] NO aparece badge "Admin"
   - [ ] NO se puede crear eventos (muestra alerta)
   - [ ] Al abrir evento NO aparecen botones editar/eliminar
   - [ ] Aparece botón "Me interesa" en modal de evento

### Prueba de Sistema de Interés

- [ ] Click en evento abre modal con botón "Me interesa"
- [ ] Click en "Me interesa" muestra el corazón lleno
- [ ] Tu avatar aparece en la lista de interesados
- [ ] Al cerrar modal, tu avatar aparece en el calendario
- [ ] Puedes quitar tu interés y tu avatar desaparece

## 🔍 Troubleshooting

### Error: "OAuth redirect URI mismatch"

**Solución**: Verifica que la URL de redirect en Google Cloud coincida exactamente con:
```
https://[TU-PROJECT-ID].supabase.co/auth/v1/callback
```

### Error: "Solo administradores pueden crear eventos"

**Solución**:
1. Verifica que ejecutaste `make_user_admin()` con el email correcto
2. Recarga la página después de asignar el rol
3. Verifica en Supabase Dashboard > **Authentication** > **Users** que tu usuario existe
4. Ejecuta en SQL Editor para verificar:
   ```sql
   SELECT * FROM profiles WHERE email = 'tu-email@gmail.com';
   ```

### Los avatares no aparecen

**Solución**:
1. Verifica que la tabla `event_interests` fue creada correctamente
2. Ejecuta en SQL Editor:
   ```sql
   SELECT * FROM event_interests;
   ```
3. Verifica que las políticas RLS estén activas:
   ```sql
   SELECT tablename, policyname FROM pg_policies
   WHERE tablename IN ('profiles', 'events', 'event_interests');
   ```

### Error al iniciar sesión

**Solución**:
1. Verifica que Google OAuth esté habilitado en Supabase
2. Verifica que el Client ID y Secret sean correctos
3. Verifica que la URL de redirect sea correcta
4. Revisa los logs en Supabase Dashboard > **Logs** > **Auth**

## 📊 Base de Datos

### Estructura de Tablas

#### `profiles`
```
id          UUID (PK, FK -> auth.users)
email       TEXT
full_name   TEXT
avatar_url  TEXT
role        TEXT ('user' | 'admin')
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

#### `events` (actualizada)
```
id          UUID (PK)
name        TEXT
link        TEXT
whatsapp    TEXT
date        DATE
created_by  UUID (FK -> auth.users)
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

#### `event_interests`
```
id          UUID (PK)
user_id     UUID (FK -> auth.users)
event_id    UUID (FK -> events)
created_at  TIMESTAMPTZ
UNIQUE(user_id, event_id)
```

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- **profiles**: Todos pueden leer, solo el usuario puede actualizar su perfil
- **events**:
  - Todos pueden leer eventos
  - Solo admins pueden crear/editar/eliminar
- **event_interests**:
  - Todos pueden leer intereses
  - Usuarios autenticados pueden mostrar interés
  - Solo el usuario puede quitar su propio interés

### Políticas de Seguridad

✅ Validación en frontend Y backend
✅ Permisos verificados en base de datos (RLS)
✅ Tokens OAuth manejados por Supabase
✅ Anon Key es seguro para frontend
✅ Admin role verificado vía join con tabla profiles

## 🚀 Siguientes Pasos

1. **Personalización**: Modifica los estilos y textos según tu marca
2. **Testing**: Prueba con múltiples usuarios para verificar permisos
3. **Producción**: Configura variables de entorno de producción
4. **Monitoreo**: Revisa logs regularmente en Supabase Dashboard

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Supabase Dashboard
2. Verifica que todas las tablas y políticas fueron creadas
3. Confirma que Google OAuth está configurado correctamente
4. Revisa la consola del navegador para errores de JavaScript

¡Listo! Tu calendario ahora tiene autenticación completa con Google OAuth y sistema de permisos basado en roles. 🎉
