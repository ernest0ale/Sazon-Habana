# Sazón Habana - Sabor y Tradición de Cuba

> Una plataforma web para descubrir, explorar y conocer los mejores espacios gastronómicos de La Habana, Cuba.

## ¿Qué es Sazón Habana?

**Sazón Habana** es un directorio digital diseñado para conectar a los amantes de la buena comida con la vibrante escena culinaria de la capital cubana. Desde los paladares más elegantes de Miramar y El Vedado hasta las joyas escondidas en la Habana Vieja, nuestra plataforma te permite:

- 🍽️ **Descubrir espacios:** Explora una amplia variedad de restaurantes, cafeterías, heladerías y dulcerías.
- 🔍 **Buscar y filtrar:** Encuentra el lugar perfecto según el tipo de cocina, municipio, precio o comodidades (terraza, climatizado, parqueo).
- 🗺️ **Localizar en el mapa:** Visualiza la ubicación de todos los establecimientos para planificar tu ruta gastronómica.
- 📋 **Consultar cartas:** Accede a los menús y especialidades de cada restaurante para decidir qué comer.
- 📱 **Diseño adaptable:** Navega sin problemas desde tu computadora, tablet o teléfono móvil.

## 👥 Usuarios

Esta versión de Sazón Habana está diseñada para ser un **directorio público**. No se requiere registro para explorar todos los contenidos.

| Tipo | Acceso | Funcionalidades |
|------|--------|-----------------|
| 🚶 **Visitante** | Sin registro | Ver todos los restaurantes, buscar, filtrar, ver detalles y cartas, ver mapa, compartir información, obtener indicaciones. |

## 🖥️ Vista previa

| Página de Inicio (Landing) | Listado de Espacios |
|--------------|-------------------|
| ![Landing](screenshots/home.png) | ![Listado](screenshots/espacios.png) |

| Vista de Detalle | Mapa Interactivo |
|-----------------|------------------|
| ![Detalle](screenshots/detalle.png) | ![Mapa](screenshots/mapa.png) |

## Tecnologías utilizadas

- HTML5, CSS3, JavaScript (Vanilla)
- Leaflet para mapas interactivos
- TailwindCSS para estilos
- localStorage para persistencia de datos
- Diseño 100% responsive

## 📱 Adaptabilidad

| Modo | Escritorio | Móvil |
|------|------------|-------|
| **Header** | Barra de navegación horizontal | Menú hamburguesa |
| **Búsqueda** | Botón en header | Overlay flotante |
| **Filtros** | Sidebar fijo (listado) | Panel deslizante lateral |
| **Acciones** | Botones horizontales (detalle) | Botones circulares flotantes |

## Funcionalidades destacadas

### 📋 Filtros avanzados
Filtra los restaurantes por:
- Municipio (Centro Habana, Playa, Plaza, Habana Vieja)
- Tipo de cocina (Criolla, Rápida, Italiana, Mariscos, Cafetería, Heladería, Dulcería)
- Rango de precios (Económico, Moderado, Premium)
- Comodidades (Terraza, Climatizado, Parqueo Privado)

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


## 📞 Contacto

¿Interesado en llevar esta plataforma a producción o adaptarla para otra ciudad?

📧 [ernest0ale428@gmail.com]  
📷 [@ernest0ale]

---

⭐ *Proyecto desarrollado de forma independiente como propuesta para potenciar la difusión de la cultura gastronómica cubana.*
