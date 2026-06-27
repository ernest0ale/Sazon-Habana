# Sazón Habana - Sabor y Tradición de Cuba

> Una plataforma web completa para descubrir, explorar y gestionar espacios gastronómicos en La Habana, Cuba.

## ¿Qué es Sazón Habana?

**Sazón Habana** es un directorio digital diseñado para conectar a los amantes de la buena comida con la vibrante escena culinaria de la capital cubana. Desde los paladares más elegantes de Miramar y El Vedado hasta las joyas escondidas en la Habana Vieja, nuestra plataforma te permite:

- 🍽️ **Descubrir espacios:** Explora una amplia variedad de restaurantes, cafeterías, heladerías y dulcerías.
- 🔍 **Buscar y filtrar:** Encuentra el lugar perfecto según el tipo de cocina, municipio, precio o comodidades (terraza, climatizado, parqueo).
- 🗺️ **Localizar en el mapa:** Visualiza la ubicación de todos los establecimientos para planificar tu ruta gastronómica.
- 📋 **Consultar cartas:** Accede a los menús y especialidades de cada restaurante para decidir qué comer.
- ⭐ **Calificar y opinar:** Deja reseñas y valoraciones de los espacios que visitas.
- 📱 **Diseño adaptable:** Navega sin problemas desde tu computadora, tablet o teléfono móvil.
- 🏪 **Solicitar espacio:** Los dueños de restaurantes pueden solicitar la inclusión de su negocio.
- 👑 **Panel de administración:** Gestión centralizada de solicitudes y contenido.

## 👥 Tipos de usuario

| Tipo | Acceso | Funcionalidades |
|------|--------|-----------------|
| 🚶 **Visitante** | Sin registro | Ver todos los restaurantes, buscar, filtrar, ver detalles y cartas, ver mapa, compartir información, obtener indicaciones. |
| 🎫 **Usuario** | Con cuenta | Todo lo anterior + dejar reseñas y calificaciones, ver historial de reseñas, personalizar perfil y colores, cambiar contraseña, solicitar la inclusión de un espacio gastronómico. |
| 👑 **Gestor** | Con cuenta verificada | Todo lo anterior + gestionar su propio espacio gastronómico (editar nombre, horario, descripción, teléfono y dirección). |
| 🛡️ **Administrador** | Con cuenta privilegiada | Todo lo anterior + panel de administración para aprobar o rechazar solicitudes de nuevos espacios. |

## Tecnologías utilizadas

- HTML5, CSS3, JavaScript (Vanilla)
- Leaflet para mapas interactivos
- TailwindCSS para estilos
- localStorage para persistencia de datos
- Diseño 100% responsive
- Arquitectura modular (backend/frontend separados)

## 📱 Adaptabilidad

| Modo | Escritorio | Móvil |
|------|------------|-------|
| **Header** | Barra de navegación horizontal | Menú hamburguesa |
| **Búsqueda** | Botón en header | Overlay flotante |
| **Filtros** | Sidebar fijo (listado) | Panel deslizante lateral |
| **Acciones** | Botones horizontales (detalle) | Botones circulares flotantes |
| **Perfil** | Sección completa | Sección completa |

## Funcionalidades destacadas

### 🔐 Autenticación y perfiles
- **Registro de usuarios** con validación de campos y selección de preferencias culinarias
- **Inicio de sesión** por correo electrónico o número de teléfono
- **Perfil personalizado** con datos del usuario y reseñas publicadas
- **Cambio de contraseña** y eliminación de cuenta (con período de gracia de 14 días)
- **Personalización de color** de identidad de la aplicación

### ⭐ Reseñas y calificaciones
- Los usuarios autenticados pueden dejar reseñas con puntuación de 1 a 5 estrellas
- Vista de todas las reseñas de un restaurante
- Eliminación de reseñas desde el perfil de usuario
- Promedio de calificación visible en tarjetas y detalle

### 🏪 Solicitud de espacios
- Formulario en tres pasos para solicitar la inclusión de un espacio gastronómico
- Paso 1: Información del negocio (nombre, tipo, precio, horario, descripción)
- Paso 2: Ubicación con mapa interactivo para posicionar el establecimiento
- Paso 3: Verificación legal (subida de licencia comercial o identidad)

### 👑 Panel de administración
- Listado de todas las solicitudes pendientes
- Aprobación: crea automáticamente el restaurante y el usuario gestor
- Rechazo: elimina la solicitud del sistema

### 🗺️ Mapa interactivo
- Visualiza todos los restaurantes con marcadores codificados por color según el tipo de cocina
- Filtra los marcadores en tiempo real
- Haz clic en un marcador para ver información y acceder al detalle

### 📱 Diseño responsive
- Experiencia optimizada en todos los dispositivos
- Navegación intuitiva con menú hamburguesa en móviles
- Filtros laterales en escritorio y paneles deslizantes en móvil

### 🌓 Tema oscuro
- Alterna entre modo claro y oscuro
- La preferencia se guarda en el navegador

### 📋 Cartas completas
- Visualiza el menú completo de cada restaurante
- Organizado por secciones (entrantes, platos fuertes, etc.)
- Precios actualizados en moneda nacional (CUP)

### 📤 Compartir y cómo llegar
- Comparte restaurantes en redes sociales o copia el enlace
- Obtén indicaciones desde tu ubicación hasta el restaurante en Google Maps

## Credenciales de prueba

| Rol | Correo electrónico | Contraseña |
|-----|-------------------|------------|
| Administrador | `admin@sazonhabana.com` | `admin123` |
| Gestor | `gestor@elbiky.com` | `biky123` |

> *Puedes registrarte como usuario normal para probar todas las funcionalidades.*

## 📞 Contacto

¿Interesado en llevar esta plataforma a producción o adaptarla para otra ciudad?

📧 [ernest0ale428@gmail.com]  
📷 [@ernest0ale]

---

⭐ *Proyecto desarrollado de forma independiente como propuesta para potenciar la difusión de la cultura gastronómica cubana.*