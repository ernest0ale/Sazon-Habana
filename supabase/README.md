# 🗄️ Supabase — Sazón Habana

Scripts SQL para configurar base de datos, RLS, triggers, funciones RPC y tareas programadas.

## 📋 Orden de ejecución

Ejecutar en el **SQL Editor** de Supabase, **en este orden**:

| # | Archivo | Propósito |
|---|---------|-----------|
| 1 | `01_schema.sql` | Tablas, tipos, constraints, índices |
| 2 | `02_rls.sql` | Políticas de Row Level Security |
| 3 | `03_triggers.sql` | updated_at, ratings, audit log |
| 4 | `04_rpc.sql` | Funciones seguras (security definer) |
| 5 | `05_storage.sql` | Buckets y políticas de Storage |
| 6 | `06_seed.sql` | Datos iniciales (opcional) |
| 7 | `07_cron.sql` | Tareas programadas (pg_cron) |

## 🔑 Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## 🔐 Modelo de seguridad

- **RLS activo** en todas las tablas.
- **Auth propio** con bcrypt (password_hash en tabla `usuarios`).
- **JWT propio** firmado con HMAC-SHA256 (cookie httpOnly).
- **Service Role** solo en API routes del servidor.
- **Rate limiting** doble: en memoria + tabla `intentos_login`.
- **Verificación por email** con códigos hasheados (`verificaciones`).
- **Bloqueos escalonados** (2h tras exceso de solicitudes).
- **Blacklist** de emails eliminados.
- **Audit log** en tablas críticas.

## 🧹 Limpieza automática (pg_cron)

- `limpiar-cuentas-expiradas`: diario 4 AM UTC
- `limpiar-verificaciones`: cada hora
- `limpiar-intentos-login`: diario 3 AM UTC

## ⚠️ Advertencias

- Ejecuta `02_rls.sql` **inmediatamente** después de `01_schema.sql`.
- Los hashes de `06_seed.sql` son placeholder: reemplázalos con `node scripts/hash-passwords.js`.
- El `SERVICE_ROLE_KEY` **nunca** debe exponerse al cliente.