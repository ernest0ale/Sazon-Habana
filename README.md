# 🍽️ Sazón Habana

Directorio gastronómico de La Habana. Descubre restaurantes, paladares, cafeterías y dulcerías con cartas completas, ubicaciones en mapa y reseñas de la comunidad.

Migración de la versión vanilla a **Next.js 14 (App Router) + React 18 + Supabase**, con foco en **seguridad en profundidad** (validación propia, sanitización, RLS, CSRF, rate limiting).

---

## 🚀 Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 18 + CSS3 vanilla (styled-jsx para componentes) |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage) |
| Mapas | Leaflet + react-leaflet |
| Passwords | bcryptjs (cost 12) |
| Validación | Propia (sin dependencias externas) |
| Seguridad | RLS + CSP + CSRF + Rate Limiting + Sanitización |

---

## 📁 Estructura

```
sazon-habana/
│
├── public/
│   ├── images/
│   │   ├── sazonHabana_lightLogo.png
│   │   └── sazonHabana_darkLogo.png
│   └── favicon.ico
│
├── scripts/
│   └── hash-passwords.js
│
├── supabase/
│   ├── README.md
│   ├── 01_schema.sql
│   ├── 02_rls.sql
│   ├── 03_triggers.sql
│   ├── 04_rpc.sql
│   ├── 05_storage.sql
│   └── 06_seed.sql
│
├── src/
│   │
│   ├── middleware.js
│   │
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── loading.js
│   │   ├── not-found.js
│   │   ├── error.js
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.js
│   │   │   ├── login/
│   │   │   │   └── page.js
│   │   │   └── registro/
│   │   │       └── page.js
│   │   │
│   │   ├── espacios/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       ├── page.js
│   │   │       └── resenas/
│   │   │           └── page.js
│   │   │
│   │   ├── mapa/
│   │   │   └── page.js
│   │   │
│   │   ├── perfil/
│   │   │   └── page.js
│   │   │
│   │   ├── admin/
│   │   │   └── page.js
│   │   │
│   │   ├── mi-espacio/
│   │   │   └── page.js
│   │   │
│   │   ├── solicitar-espacio/
│   │   │   └── page.js
│   │   │
│   │   ├── (legal)/
│   │   │   ├── layout.js
│   │   │   ├── privacidad/
│   │   │   │   └── page.js
│   │   │   ├── terminos/
│   │   │   │   └── page.js
│   │   │   └── cookies/
│   │   │       └── page.js
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.js
│   │       │   ├── register/
│   │       │   │   └── route.js
│   │       │   ├── logout/
│   │       │   │   └── route.js
│   │       │   └── session/
│   │       │       └── route.js
│   │       │
│   │       ├── perfil/
│   │       │   ├── route.js
│   │       │   └── password/
│   │       │       └── route.js
│   │       │
│   │       ├── restaurantes/
│   │       │   ├── route.js
│   │       │   └── [id]/
│   │       │       └── route.js
│   │       │
│   │       ├── resenas/
│   │       │   └── route.js
│   │       │
│   │       └── solicitudes/
│   │           ├── route.js
│   │           └── [id]/
│   │               ├── route.js
│   │               └── aprobar/
│   │                   └── route.js
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageTitle.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── HorarioPopover.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── RestaurantGrid.jsx
│   │   │   └── SearchOverlay.jsx
│   │   │
│   │   ├── modals/
│   │   │   ├── RestaurantMenu.jsx
│   │   │   ├── ShareModal.jsx
│   │   │   ├── ChangePasswordModal.jsx
│   │   │   └── DeleteAccountModal.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   └── CarouselSection.jsx
│   │   │
│   │   ├── listado/
│   │   │   ├── SortSelect.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── MobileFilterOverlay.jsx
│   │   │   └── ListingToolbar.jsx
│   │   │
│   │   ├── detalle/
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── SpecialtiesSection.jsx
│   │   │   ├── DetailMap.jsx
│   │   │   └── DetailPanel.jsx
│   │   │
│   │   ├── mapa/
│   │   │   ├── MapPopup.jsx
│   │   │   ├── MapFilters.jsx
│   │   │   └── MapView.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── SolicitudRow.jsx
│   │   │   └── SolicitudesTable.jsx
│   │   │
│   │   ├── perfil/
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── ThemeColors.jsx
│   │   │   └── UserReviews.jsx
│   │   │
│   │   └── solicitar/
│   │       ├── WizardProgress.jsx
│   │       ├── HorarioRango.jsx
│   │       ├── WizardStep1.jsx
│   │       ├── WizardStep2.jsx
│   │       └── WizardStep3.jsx
│   │
│   ├── contexts/
│   │   ├── ThemeContext.jsx
│   │   ├── AuthContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── SearchContext.jsx
│   │
│   ├── data/
│   │   ├── restaurantes.seed.js
│   │   └── usuarios.seed.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useToast.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useSearch.js
│   │
│   ├── lib/
│   │   ├── security/
│   │   │   ├── sanitize.js
│   │   │   ├── validators.js
│   │   │   ├── rate-limit.js
│   │   │   ├── csrf.js
│   │   │   ├── headers.js
│   │   │   ├── password.js
│   │   │   └── session.js
│   │   │
│   │   ├── supabase/
│   │   │   ├── supabase-client.js
│   │   │   └── supabase-server.js
│   │   │
│   │   ├── data/
│   │   │   ├── restaurantes.js
│   │   │   ├── resenas.js
│   │   │   ├── usuarios.js
│   │   │   └── solicitudes.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── restaurante.validator.js
│   │   │   ├── resena.validator.js
│   │   │   └── solicitud.validator.js
│   │   │
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       ├── helpers.js
│   │       └── horario-parser.js
│   │
│   └── styles/
│       └── globals.css
│
├── .env.example
├── .env.local
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## 🛡️ Seguridad implementada

| Medida | Ubicación |
|--------|-----------|
| Validación de inputs | `lib/security/validators.js` |
| Sanitización (XSS) | `lib/security/sanitize.js` |
| Rate limiting | `lib/security/rate-limit.js` |
| CSRF tokens | `lib/security/csrf.js` |
| Headers HTTP | `next.config.js` + `lib/security/headers.js` |
| Hash de passwords | `lib/security/password.js` (bcrypt, cost 12) |
| RLS en Supabase | `supabase/rls.sql` |
| Middleware de rutas | `lib/middleware.js` |
| Constraints en DB | `supabase/schema.sql` |

---

## ⚙️ Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Copiar `.env.example` → `.env.local` y rellenar:
   ```bash
   cp .env.example .env.local
   ```

3. Generar secretos:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Configurar Supabase (ver `supabase/README.md`).

5. Arrancar en desarrollo:
   ```bash
   npm run dev
   ```

Abrir [http://localhost:3000](http://localhost:3000).

---

## 📦 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter |

---

## 🔐 Notas de seguridad

- **Nunca** commitear `.env.local`.
- El `SUPABASE_SERVICE_ROLE_KEY` **solo** se usa en el servidor (API routes), nunca en el cliente.
- Toda validación se aplica **en cliente y servidor** (doble barrera).
- RLS está activo en **todas** las tablas.
- Los passwords se hashean con bcrypt (cost 12) antes de guardar.

---

## 📄 Licencia

© 2026 Sazón Habana. Todos los derechos reservados.