// ============================================
// DATA.JS - BASE DE DATOS LOCAL
// ============================================

const DEFAULT_USERS = [
  { id: "admin_001", email: "admin@sazonhabana.com", telefono: "50000000", password: "admin123", nombre: "Administrador Sazón", rol: "admin", estado: "activo", preferencias: [], colorPrimario: "#5B8A72", restauranteId: null },
  { id: "gestor_001", email: "gestor@elbiky.com", telefono: "51111111", password: "biky123", nombre: "Dueño El Biky", rol: "gestor", estado: "activo", preferencias: ["criolla"], colorPrimario: "#5B8A72", restauranteId: "res_001" }
];

const DEFAULT_RESTAURANTES = [
  { 
    id: "res_001", 
    nombre: "El Biky", 
    municipio: "Plaza de la Revolución", 
    direccion: "Calle Infanta e/ San Lázaro y Concordia", 
    tipo: "rápida", 
    precio: "2", 
    horario: "Lunes - Sábado: 11:00 AM - 12:00 AM | Domingo: 10:00 AM - 10:00 PM", 
    telefono: "+53 78706515", 
    descripcion: "Complejo gastronómico icónico en Vedado. Ofrece pastelería de primer nivel, comidas rápidas sabrosas, pizzas crujientes y platos de cocina internacional en un ambiente moderno y climatizado.", 
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1368, 
    lng: -82.3785, 
    aire: true, 
    clima: true, 
    parqueo: false, 
    createdAt: "2026-05-15T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Entrantes", 
        platos: [ 
          { nombre: "Croquetas de Jamón", precio: "$600 CUP" }, 
          { nombre: "Focaccia de Ajo", precio: "$750 CUP" } 
        ] 
      }, 
      { 
        seccion: "Platos Fuertes", 
        platos: [ 
          { nombre: "Fettuccine Alfredo", precio: "$1950 CUP" }, 
          { nombre: "Lomo de Cerdo Asado", precio: "$2200 CUP" },
          { nombre: "Pizza Margarita Biky", precio: "$1200 CUP", descripcion: "Masa delgada, salsa de tomate de la casa, abundante queso mozzarella fresco y albahaca aromática.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200" },
          { nombre: "Hamburguesa Suprema", precio: "$1800 CUP", descripcion: "Carne de res seleccionada, panceta ahumada cubana, queso cheddar derretido, lechuga y salsa secreta.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pizza Margarita Biky", precio: "$1200 CUP", descripcion: "Masa delgada, salsa de tomate de la casa, abundante queso mozzarella fresco y albahaca aromática.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200" }, 
      { nombre: "Hamburguesa Suprema", precio: "$1800 CUP", descripcion: "Carne de res seleccionada, panceta ahumada cubana, queso cheddar derretido, lechuga y salsa secreta.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_002", 
    nombre: "El Aljibe", 
    municipio: "Playa", 
    direccion: "Avenida 7ma e/ 24 y 26", 
    tipo: "criolla", 
    precio: "2", 
    horario: "Todos los días: 12:00 PM - 10:00 PM", 
    telefono: "+53 72041584", 
    descripcion: "Famoso restaurante cubano a cielo abierto. Especialidad única es el Pollo Asado al Aljibe.", 
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1252, 
    lng: -82.4190, 
    aire: true, 
    clima: false, 
    parqueo: true,
    createdAt: "2026-05-20T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Especialidades Criollas", 
        platos: [ 
          { nombre: "Ropa Vieja", precio: "$2800 CUP" }, 
          { nombre: "Masas de Cerdo Fritas", precio: "$2100 CUP" },
          { nombre: "Pollo Asado Sazón Aljibe", precio: "$2500 CUP", descripcion: "Pollo asado jugoso cubierto de salsa cítrica agridulce secreta y guarnición campesina ilimitada.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pollo Asado Sazón Aljibe", precio: "$2500 CUP", descripcion: "Pollo asado jugoso cubierto de salsa cítrica agridulce secreta y guarnición campesina ilimitada.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_003", 
    nombre: "Dulcería La Esquina", 
    municipio: "Centro Habana", 
    direccion: "Calle San Rafael #304", 
    tipo: "dulcería", 
    precio: "1", 
    horario: "Lunes - Viernes: 8:00 AM - 9:00 PM | Sábado: 9:00 AM - 7:00 PM | Domingo: Cerrado", 
    telefono: "+53 52001234", 
    descripcion: "Los mejores pasteles, tartas y dulces cubanos. Especialidad en helado de mango y pastel de chocolate.", 
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1390, 
    lng: -82.3550, 
    aire: false, 
    clima: true, 
    parqueo: false,
    createdAt: "2026-06-10T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Pasteles", 
        platos: [ 
          { nombre: "Tarta de Queso", precio: "$300 CUP" }, 
          { nombre: "Brazo Gitano", precio: "$250 CUP" },
          { nombre: "Pastel de Chocolate", precio: "$350 CUP", descripcion: "Pastel de chocolate con cobertura de ganache.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" },
          { nombre: "Helado de Mango", precio: "$250 CUP", descripcion: "Helado artesanal de mango cubano.", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pastel de Chocolate", precio: "$350 CUP", descripcion: "Pastel de chocolate con cobertura de ganache.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" }, 
      { nombre: "Helado de Mango", precio: "$250 CUP", descripcion: "Helado artesanal de mango cubano.", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_004", 
    nombre: "La Guarida", 
    municipio: "Centro Habana", 
    direccion: "Calle Concordia #418", 
    tipo: "criolla", 
    precio: "3", 
    horario: "Lunes - Jueves: 12:00 PM - 10:00 PM | Viernes - Sábado: 12:00 PM - 11:30 PM | Domingo: 12:00 PM - 9:00 PM", 
    telefono: "+53 78628847", 
    descripcion: "Uno de los paladares más famosos de La Habana. Cocina cubana contemporánea en un edificio colonial restaurado.", 
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1320, 
    lng: -82.3600, 
    aire: true, 
    clima: true, 
    parqueo: false,
    createdAt: "2026-04-01T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Cocina Criolla", 
        platos: [ 
          { nombre: "Lechón Asado", precio: "$3500 CUP" }, 
          { nombre: "Congrí", precio: "$2800 CUP" },
          { nombre: "Ropa Vieja", precio: "$3200 CUP", descripcion: "Carne deshilachada con salsa criolla y arroz moro.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Ropa Vieja", precio: "$3200 CUP", descripcion: "Carne deshilachada con salsa criolla y arroz moro.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_005", 
    nombre: "La Fontana", 
    municipio: "Playa", 
    direccion: "Calle 16 #307 e/ 3ra y 5ta", 
    tipo: "cafetería", 
    precio: "2", 
    horario: "Lunes - Viernes: 7:00 AM - 9:00 PM | Sábado: 8:00 AM - 8:00 PM | Domingo: Cerrado", 
    telefono: "+53 72047410", 
    descripcion: "Cafetería y repostería de estilo europeo. Famosos por sus croissants y café cubano.", 
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1200, 
    lng: -82.4300, 
    aire: true, 
    clima: true, 
    parqueo: true,
    createdAt: "2026-03-15T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Repostería", 
        platos: [ 
          { nombre: "Pain au Chocolat", precio: "$400 CUP" }, 
          { nombre: "Tarta de Frutas", precio: "$500 CUP" },
          { nombre: "Croissant de Almendras", precio: "$450 CUP", descripcion: "Croissant recién horneado con crema de almendras.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Croissant de Almendras", precio: "$450 CUP", descripcion: "Croissant recién horneado con crema de almendras.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_006", 
    nombre: "Café El Escorial", 
    municipio: "Habana Vieja", 
    direccion: "Calle Obispo #105", 
    tipo: "cafetería", 
    precio: "1", 
    horario: "Lunes - Sábado: 8:00 AM - 8:00 PM | Domingo: 9:00 AM - 2:00 PM", 
    telefono: "+53 78642015", 
    descripcion: "El café más antiguo de La Habana. Ambiente tradicional y el mejor café cubano.", 
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1395, 
    lng: -82.3500, 
    aire: false, 
    clima: true, 
    parqueo: false,
    createdAt: "2026-02-10T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Bebidas", 
        platos: [ 
          { nombre: "Café con Leche", precio: "$200 CUP" }, 
          { nombre: "Batido de Mango", precio: "$250 CUP" },
          { nombre: "Café Cubano", precio: "$150 CUP", descripcion: "Auténtico café cubano con espuma de azúcar.", img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Café Cubano", precio: "$150 CUP", descripcion: "Auténtico café cubano con espuma de azúcar.", img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  { 
    id: "res_007", 
    nombre: "Pizza Napoli", 
    municipio: "Plaza de la Revolución", 
    direccion: "Calle 23 #456 e/ L y M", 
    tipo: "italiana", 
    precio: "2", 
    horario: "Martes - Domingo: 11:00 AM - 11:00 PM | Lunes: Cerrado", 
    telefono: "+53 78321548", 
    descripcion: "Auténtica pizza italiana en el corazón de Vedado. Masa fina y ingredientes frescos.", 
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600", 
    galeria: ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600"], 
    lat: 23.1410, 
    lng: -82.3850, 
    aire: true, 
    clima: true, 
    parqueo: false,
    createdAt: "2026-06-01T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Pizzas", 
        platos: [ 
          { nombre: "Pizza Pepperoni", precio: "$1600 CUP" }, 
          { nombre: "Pizza 4 Quesos", precio: "$1800 CUP" },
          { nombre: "Pizza Margarita", precio: "$1400 CUP", descripcion: "Salsa de tomate, mozzarella fresca y albahaca.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pizza Margarita", precio: "$1400 CUP", descripcion: "Salsa de tomate, mozzarella fresca y albahaca.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_008",
    nombre: "Marisquería El Criollo",
    municipio: "Playa",
    direccion: "Calle 1ra #1202 e/ 12 y 14",
    tipo: "mariscos",
    precio: "3",
    horario: "Lunes - Sábado: 11:00 AM - 10:00 PM | Domingo: 12:00 PM - 8:00 PM",
    telefono: "+53 72040000",
    descripcion: "Especialistas en mariscos frescos. Langosta, camarones y pescado de la costa norte de Cuba.",
    img: "https://images.unsplash.com/photo-1525385133512-2f3b069a8175?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1525385133512-2f3b069a8175?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1180,
    lng: -82.4250,
    aire: true,
    clima: true,
    parqueo: true,
    createdAt: "2026-06-20T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Mariscos", 
        platos: [ 
          { nombre: "Camarones al Ajillo", precio: "$2800 CUP" }, 
          { nombre: "Pescado a la Parrilla", precio: "$2200 CUP" },
          { nombre: "Langosta a la Plancha", precio: "$4500 CUP", descripcion: "Langosta fresca con mantequilla de ajo.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Langosta a la Plancha", precio: "$4500 CUP", descripcion: "Langosta fresca con mantequilla de ajo.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_009",
    nombre: "Paladar El Jardín",
    municipio: "Plaza de la Revolución",
    direccion: "Calle 19 #456 e/ E y F",
    tipo: "criolla",
    precio: "2",
    horario: "Lunes - Viernes: 12:00 PM - 11:00 PM | Sábado: 1:00 PM - 11:00 PM | Domingo: 1:00 PM - 9:00 PM",
    telefono: "+53 78320000",
    descripcion: "Cocina criolla en un ambiente campestre. Especialidad en cerdo asado y yuca con mojo.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1300,
    lng: -82.3800,
    aire: true,
    clima: false,
    parqueo: true,
    createdAt: "2026-06-22T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Platos Criollos", 
        platos: [ 
          { nombre: "Ropa Vieja", precio: "$2400 CUP" }, 
          { nombre: "Picadillo", precio: "$2000 CUP" },
          { nombre: "Cerdo Asado", precio: "$2600 CUP", descripcion: "Cerdo asado con yuca y mojo.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Cerdo Asado", precio: "$2600 CUP", descripcion: "Cerdo asado con yuca y mojo.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_010",
    nombre: "Heladería El Cocuyo",
    municipio: "Centro Habana",
    direccion: "Calle Galiano #123",
    tipo: "heladería",
    precio: "1",
    horario: "Lunes - Domingo: 10:00 AM - 9:00 PM",
    telefono: "+53 78700000",
    descripcion: "Helados artesanales con frutas tropicales. Mango, guayaba y maracuyá.",
    img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1370,
    lng: -82.3600,
    aire: false,
    clima: true,
    parqueo: false,
    createdAt: "2026-06-18T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Helados", 
        platos: [ 
          { nombre: "Helado de Guayaba", precio: "$200 CUP" }, 
          { nombre: "Helado de Maracuyá", precio: "$220 CUP" },
          { nombre: "Helado de Mango", precio: "$200 CUP", descripcion: "Helado cremoso de mango cubano.", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Helado de Mango", precio: "$200 CUP", descripcion: "Helado cremoso de mango cubano.", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_011",
    nombre: "Pizzeria Da Franco",
    municipio: "Playa",
    direccion: "Calle 5ta #103 e/ A y B",
    tipo: "italiana",
    precio: "2",
    horario: "Martes - Sábado: 11:00 AM - 12:00 AM | Domingo: 12:00 PM - 10:00 PM | Lunes: Cerrado",
    telefono: "+53 72041234",
    descripcion: "Auténtica pizza napolitana con horno de leña. Ingredientes importados.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1220,
    lng: -82.4350,
    aire: true,
    clima: true,
    parqueo: false,
    createdAt: "2026-06-15T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Pizzas", 
        platos: [ 
          { nombre: "Pizza Pepperoni", precio: "$1700 CUP" }, 
          { nombre: "Pizza 4 Quesos", precio: "$1900 CUP" },
          { nombre: "Pizza Margarita", precio: "$1500 CUP", descripcion: "Mozzarella fresca y albahaca.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pizza Margarita", precio: "$1500 CUP", descripcion: "Mozzarella fresca y albahaca.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_012",
    nombre: "Café La Catedral",
    municipio: "Habana Vieja",
    direccion: "Calle Mercaderes #206",
    tipo: "cafetería",
    precio: "2",
    horario: "Lunes - Sábado: 8:00 AM - 9:00 PM | Domingo: 9:00 AM - 1:00 PM",
    telefono: "+53 78645555",
    descripcion: "Cafetería con vistas a la catedral. Ideal para un café y un buen libro.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1400,
    lng: -82.3520,
    aire: false,
    clima: true,
    parqueo: false,
    createdAt: "2026-05-25T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Bebidas", 
        platos: [ 
          { nombre: "Cortado", precio: "$250 CUP" }, 
          { nombre: "Capuccino", precio: "$350 CUP" },
          { nombre: "Café Carajillo", precio: "$300 CUP", descripcion: "Café con un toque de ron.", img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Café Carajillo", precio: "$300 CUP", descripcion: "Café con un toque de ron.", img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_013",
    nombre: "Mar y Tierra",
    municipio: "Playa",
    direccion: "Calle 3ra #305 e/ 10 y 12",
    tipo: "mariscos",
    precio: "3",
    horario: "Lunes - Jueves: 12:00 PM - 10:00 PM | Viernes - Sábado: 12:00 PM - 11:30 PM | Domingo: 12:00 PM - 9:00 PM",
    telefono: "+53 72046666",
    descripcion: "Especialidades de mar y tierra. Pescados frescos y carnes a la parrilla.",
    img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1525385133512-2f3b069a8175?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1150,
    lng: -82.4280,
    aire: true,
    clima: true,
    parqueo: true,
    createdAt: "2026-06-12T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Especialidades", 
        platos: [ 
          { nombre: "Lubina a la Plancha", precio: "$3200 CUP" }, 
          { nombre: "Solomillo de Res", precio: "$2800 CUP" },
          { nombre: "Parrillada Mixta", precio: "$5000 CUP", descripcion: "Langosta, camarones y solomillo.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Parrillada Mixta", precio: "$5000 CUP", descripcion: "Langosta, camarones y solomillo.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_014",
    nombre: "Dulcería La Merced",
    municipio: "Centro Habana",
    direccion: "Calle Prado #208",
    tipo: "dulcería",
    precio: "1",
    horario: "Martes - Sábado: 9:00 AM - 7:00 PM | Domingo: 9:00 AM - 2:00 PM | Lunes: Cerrado",
    telefono: "+53 78702222",
    descripcion: "Dulces tradicionales cubanos y pasteles para toda ocasión.",
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1380,
    lng: -82.3580,
    aire: false,
    clima: false,
    parqueo: false,
    createdAt: "2026-06-08T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Dulces", 
        platos: [ 
          { nombre: "Flan de Caramelo", precio: "$300 CUP" }, 
          { nombre: "Pudin de Pan", precio: "$350 CUP" },
          { nombre: "Pastel de Tres Leches", precio: "$400 CUP", descripcion: "Clásico pastel cubano de tres leches.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Pastel de Tres Leches", precio: "$400 CUP", descripcion: "Clásico pastel cubano de tres leches.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  {
    id: "res_015",
    nombre: "El Asador",
    municipio: "Plaza de la Revolución",
    direccion: "Calle 44 #101 e/ 5 y 7",
    tipo: "rápida",
    precio: "1",
    horario: "Lunes - Sábado: 10:00 AM - 10:00 PM | Domingo: 11:00 AM - 8:00 PM",
    telefono: "+53 78330000",
    descripcion: "Comida rápida con sabor casero. Hamburguesas, perritos y papas fritas.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1350,
    lng: -82.3750,
    aire: true,
    clima: false,
    parqueo: true,
    createdAt: "2026-06-05T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Hamburguesas", 
        platos: [ 
          { nombre: "Hamburguesa Clásica", precio: "$1000 CUP" }, 
          { nombre: "Hamburguesa BBQ", precio: "$1300 CUP" },
          { nombre: "Hamburguesa El Asador", precio: "$1200 CUP", descripcion: "Carne de res con queso y tocino.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200" }
        ] 
      } 
    ],
    platosPopulares: [ 
      { nombre: "Hamburguesa El Asador", precio: "$1200 CUP", descripcion: "Carne de res con queso y tocino.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200" } 
    ]
  },
  // ===== NUEVOS RESTAURANTES CON HORARIOS MIXTOS =====
  {
    id: "res_016",
    nombre: "Brunch & Co.",
    municipio: "Vedado",
    direccion: "Calle 21 #456 e/ N y O",
    tipo: "cafetería",
    precio: "2",
    horario: "Lunes - Viernes: 7:30 AM - 8:00 PM | Sábado: 8:00 AM - 8:00 PM | Domingo: 8:00 AM - 2:00 PM",
    telefono: "+53 78885555",
    descripcion: "Especialistas en brunch y café de especialidad. Desayunos, almuerzos y repostería artesanal en un ambiente moderno y acogedor.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1420,
    lng: -82.3760,
    aire: true,
    clima: true,
    parqueo: false,
    createdAt: "2026-07-01T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Desayunos", 
        platos: [ 
          { nombre: "Huevos Benedictinos", precio: "$1800 CUP" }, 
          { nombre: "Panqueques con Frutas", precio: "$1500 CUP" },
          { nombre: "Tostada Francesa", precio: "$1600 CUP", descripcion: "Tostada francesa con frutas y jarabe de arce." }
        ] 
      },
      { 
        seccion: "Cafés", 
        platos: [ 
          { nombre: "Latte Art", precio: "$400 CUP" }, 
          { nombre: "Café Frío", precio: "$350 CUP" },
          { nombre: "Mocha", precio: "$450 CUP", descripcion: "Café con chocolate y crema batida." }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Huevos Benedictinos", precio: "$1800 CUP", descripcion: "Huevos con salsa holandesa y jamón.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200" },
      { nombre: "Latte Art", precio: "$400 CUP", descripcion: "Café con diseño de arte en la espuma." }
    ]
  },
  {
    id: "res_017",
    nombre: "La Parrilla de Carlos",
    municipio: "Miramar",
    direccion: "Calle 5ta #789 e/ 76 y 78",
    tipo: "criolla",
    precio: "2",
    horario: "Martes - Domingo: 12:00 PM - 11:00 PM | Lunes: Cerrado",
    telefono: "+53 72047777",
    descripcion: "Auténtica parrilla cubana con carnes a la brasa y platos típicos. Especialidad en lechón y costillas.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1170,
    lng: -82.4320,
    aire: true,
    clima: false,
    parqueo: true,
    createdAt: "2026-07-05T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Parrilla", 
        platos: [ 
          { nombre: "Lechón Asado", precio: "$3800 CUP" }, 
          { nombre: "Costillas BBQ", precio: "$3200 CUP" },
          { nombre: "Churrasco", precio: "$4500 CUP", descripcion: "Carne de res a la parrilla con chimichurri." }
        ] 
      },
      { 
        seccion: "Guarniciones", 
        platos: [ 
          { nombre: "Yuca con Mojo", precio: "$500 CUP" }, 
          { nombre: "Arroz Moro", precio: "$600 CUP" },
          { nombre: "Tostones", precio: "$400 CUP" }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Lechón Asado", precio: "$3800 CUP", descripcion: "Lechón asado a la brasa con piel crujiente.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200" },
      { nombre: "Churrasco", precio: "$4500 CUP", descripcion: "Carne de res con chimichurri." }
    ]
  },
  {
    id: "res_018",
    nombre: "Pizza & Pasta Roma",
    municipio: "Vedado",
    direccion: "Calle L #456 e/ 23 y 25",
    tipo: "italiana",
    precio: "2",
    horario: "Lunes - Jueves: 11:00 AM - 10:00 PM | Viernes - Sábado: 11:00 AM - 12:00 AM | Domingo: 12:00 PM - 9:00 PM",
    telefono: "+53 78884444",
    descripcion: "Auténtica cocina italiana con pizzas al horno de leña y pastas artesanales. Ambiente familiar y acogedor.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1400,
    lng: -82.3790,
    aire: true,
    clima: true,
    parqueo: false,
    createdAt: "2026-07-08T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Pizzas", 
        platos: [ 
          { nombre: "Pizza Margarita", precio: "$1800 CUP" }, 
          { nombre: "Pizza 4 Estaciones", precio: "$2200 CUP" },
          { nombre: "Pizza Pepperoni", precio: "$2000 CUP", descripcion: "Pepperoni, mozzarella y salsa de tomate." }
        ] 
      },
      { 
        seccion: "Pastas", 
        platos: [ 
          { nombre: "Spaghetti Carbonara", precio: "$2500 CUP" }, 
          { nombre: "Fettuccine Alfredo", precio: "$2700 CUP" },
          { nombre: "Lasaña", precio: "$2900 CUP", descripcion: "Lasaña de carne con queso parmesano." }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Pizza Margarita", precio: "$1800 CUP", descripcion: "Mozzarella, albahaca y salsa de tomate.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200" },
      { nombre: "Lasaña", precio: "$2900 CUP", descripcion: "Lasaña de carne con queso parmesano." }
    ]
  },
  {
    id: "res_019",
    nombre: "Mariscos del Caribe",
    municipio: "Habana del Este",
    direccion: "Calle 1ra #1234 e/ 2 y 4",
    tipo: "mariscos",
    precio: "3",
    horario: "Lunes - Viernes: 11:00 AM - 10:00 PM | Sábado: 12:00 PM - 10:00 PM | Domingo: Cerrado",
    telefono: "+53 78997777",
    descripcion: "Lo mejor del mar en un ambiente caribeño. Pescados, langostas y camarones frescos del día.",
    img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1525385133512-2f3b069a8175?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1650,
    lng: -82.3370,
    aire: true,
    clima: true,
    parqueo: true,
    createdAt: "2026-07-12T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Especialidades", 
        platos: [ 
          { nombre: "Langosta Termidor", precio: "$5500 CUP" }, 
          { nombre: "Camarones al Ajillo", precio: "$3200 CUP" },
          { nombre: "Pescado a la Plancha", precio: "$2800 CUP", descripcion: "Pescado fresco con limón y mantequilla." }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Langosta Termidor", precio: "$5500 CUP", descripcion: "Langosta con salsa cremosa de champiñones.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200" },
      { nombre: "Camarones al Ajillo", precio: "$3200 CUP", descripcion: "Camarones en salsa de ajo y aceite de oliva." }
    ]
  },
  {
    id: "res_020",
    nombre: "Helados y Más",
    municipio: "Centro Habana",
    direccion: "Calle Galiano #456 e/ San José y San Martín",
    tipo: "heladería",
    precio: "1",
    horario: "Lunes - Sábado: 11:00 AM - 9:00 PM | Domingo: 12:00 PM - 6:00 PM",
    telefono: "+53 78883333",
    descripcion: "Variedad de helados artesanales con frutas tropicales, malteadas y postres fríos. Clásicos y sabores nuevos.",
    img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1360,
    lng: -82.3620,
    aire: false,
    clima: true,
    parqueo: false,
    createdAt: "2026-07-15T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Helados", 
        platos: [ 
          { nombre: "Helado de Mango", precio: "$250 CUP" }, 
          { nombre: "Helado de Maracuyá", precio: "$280 CUP" },
          { nombre: "Helado de Guayaba", precio: "$250 CUP", descripcion: "Helado cremoso de guayaba cubana." }
        ] 
      },
      { 
        seccion: "Postres", 
        platos: [ 
          { nombre: "Sundae Especial", precio: "$500 CUP" }, 
          { nombre: "Malteada de Chocolate", precio: "$400 CUP" },
          { nombre: "Banana Split", precio: "$600 CUP", descripcion: "Banana con tres bolas de helado y topping." }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Helado de Mango", precio: "$250 CUP", descripcion: "Helado cremoso de mango cubano.", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200" },
      { nombre: "Sundae Especial", precio: "$500 CUP", descripcion: "Helado con salsa de chocolate, crema y frutas." }
    ]
  },
  {
    id: "res_021",
    nombre: "Sushi Havana",
    municipio: "Vedado",
    direccion: "Calle 17 #123 e/ M y N",
    tipo: "rápida",
    precio: "3",
    horario: "Lunes - Sábado: 12:00 PM - 11:00 PM | Domingo: 12:00 PM - 10:00 PM",
    telefono: "+53 78882222",
    descripcion: "Sushi y comida japonesa con toque cubano. Rolls creativos y ingredientes frescos del día.",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600",
    galeria: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600"],
    lat: 23.1410,
    lng: -82.3700,
    aire: true,
    clima: true,
    parqueo: false,
    createdAt: "2026-07-18T10:00:00Z",
    seccionesCarta: [
      { 
        seccion: "Sushi", 
        platos: [ 
          { nombre: "Roll California", precio: "$3000 CUP" }, 
          { nombre: "Roll Havana", precio: "$3500 CUP" },
          { nombre: "Roll Tropical", precio: "$3200 CUP", descripcion: "Mango, aguacate y camarón." }
        ] 
      },
      { 
        seccion: "Tempuras", 
        platos: [ 
          { nombre: "Tempura de Camarones", precio: "$2800 CUP" }, 
          { nombre: "Tempura Vegetal", precio: "$2200 CUP" }
        ] 
      }
    ],
    platosPopulares: [ 
      { nombre: "Roll Havana", precio: "$3500 CUP", descripcion: "Sushi con toque cubano." },
      { nombre: "Tempura de Camarones", precio: "$2800 CUP", descripcion: "Camarones empanizados con salsa dulce." }
    ]
  }
];

const DEFAULT_RESENAS = [
  { id: "rev_001", restauranteId: "res_001", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "Excelente lugar con comida rápida muy variada. La pastelería siempre fresca.", fecha: "2026-05-15" },
  { id: "rev_002", restauranteId: "res_002", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "El pollo asado es espectacular. Muy recomendado.", fecha: "2026-05-20" },
  { id: "rev_003", restauranteId: "res_004", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "Una experiencia culinaria única. La ropa vieja es la mejor de La Habana.", fecha: "2026-06-01" },
  { id: "rev_004", restauranteId: "res_005", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "Excelente café y croissants. El lugar es muy acogedor.", fecha: "2026-06-10" },
  { id: "rev_005", restauranteId: "res_006", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "El mejor café de La Habana. Un lugar con mucha historia.", fecha: "2026-06-12" },
  { id: "rev_006", restauranteId: "res_007", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "Buena pizza, masa fina y crujiente.", fecha: "2026-06-15" },
  { id: "rev_007", restauranteId: "res_008", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "La langosta es increíble. Volveré seguro.", fecha: "2026-06-22" },
  { id: "rev_008", restauranteId: "res_009", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "Buena comida criolla, ambiente agradable.", fecha: "2026-06-23" },
  { id: "rev_009", restauranteId: "res_010", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "El mejor helado de mango de La Habana.", fecha: "2026-06-20" },
  { id: "rev_010", restauranteId: "res_016", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "El brunch es excelente, el café de especialidad muy bueno.", fecha: "2026-07-02" },
  { id: "rev_011", restauranteId: "res_017", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "El lechón asado es espectacular. Ambiente rústico y acogedor.", fecha: "2026-07-06" },
  { id: "rev_012", restauranteId: "res_018", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "Buena pizza y pastas. El ambiente es familiar.", fecha: "2026-07-09" },
  { id: "rev_013", restauranteId: "res_019", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "La langosta termidor es la mejor que he probado.", fecha: "2026-07-13" },
  { id: "rev_014", restauranteId: "res_020", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 4, texto: "Helados artesanales deliciosos. El sundae es muy bueno.", fecha: "2026-07-16" },
  { id: "rev_015", restauranteId: "res_021", usuarioId: "gestor_001", nombreUsuario: "Dueño El Biky", puntuacion: 5, texto: "El sushi es fresco y creativo. El roll Havana es increíble.", fecha: "2026-07-19" }
];

const DEFAULT_SOLICITUDES = [];

// ===== FUNCIONES DE INICIALIZACIÓN =====
function initDatabase() { 
  if (!localStorage.getItem("sh_usuarios")) localStorage.setItem("sh_usuarios", JSON.stringify(DEFAULT_USERS)); 
  if (!localStorage.getItem("sh_restaurantes")) localStorage.setItem("sh_restaurantes", JSON.stringify(DEFAULT_RESTAURANTES)); 
  if (!localStorage.getItem("sh_resenas")) localStorage.setItem("sh_resenas", JSON.stringify(DEFAULT_RESENAS)); 
  if (!localStorage.getItem("sh_solicitudes")) localStorage.setItem("sh_solicitudes", JSON.stringify(DEFAULT_SOLICITUDES)); 
}

// ===== FUNCIONES DE ACCESO A DATOS =====
function getRestaurantes() { return JSON.parse(localStorage.getItem("sh_restaurantes")); }
function getRestauranteById(id) { return getRestaurantes().find(r => r.id === id); }
function actualizarRestaurante(id, datos) { 
  let rest = getRestaurantes(); 
  let idx = rest.findIndex(r => r.id === id); 
  if(idx !== -1){ 
    rest[idx] = { ...rest[idx], ...datos }; 
    localStorage.setItem("sh_restaurantes", JSON.stringify(rest)); 
    return true; 
  } 
  return false; 
}
function getResenasByRestauranteId(id) { 
  return JSON.parse(localStorage.getItem("sh_resenas")).filter(r => r.restauranteId === id); 
}

// ===== FUNCIÓN PARA OBTENER MUNICIPIOS CON RESTAURANTES =====
function getMunicipiosConRestaurantes() {
  let rest = getRestaurantes();
  if (!rest || rest.length === 0) return [];
  let municipios = [...new Set(rest.map(r => r.municipio).filter(m => m))];
  return municipios.sort();
}

// ===== FUNCIÓN PARA VERIFICAR SI UN RESTAURANTE ESTÁ ABIERTO =====
function isRestaurantOpen(restaurante) {
  if (!restaurante || !restaurante.horario) return false;
  const horario = restaurante.horario.trim().toUpperCase();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const today = days[dayOfWeek];

  const hasDaySpecific = /LUN|MAR|MIE|JUE|VIE|SAB|DOM/i.test(horario);

  if (hasDaySpecific) {
    const dayRegex = new RegExp(`${today}\\s*[:.-]?\\s*([\\d:]+\\s*AM|PM|\\d+\\s*[-–]\\s*\\d+\\s*AM|PM)`, 'i');
    const match = horario.match(dayRegex);
    if (match) {
      const timeRange = match[1];
      return isTimeInRange(timeRange);
    }
    const generalRegex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i;
    const generalMatch = horario.match(generalRegex);
    if (generalMatch) {
      return isTimeInRange(generalMatch[0]);
    }
    return false;
  }

  const regex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i;
  const match = horario.match(regex);
  if (match) {
    return isTimeInRange(match[0]);
  }
  return false;
}

function isTimeInRange(timeRange) {
  const regex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i;
  const match = timeRange.match(regex);
  if (!match) return false;

  const h1 = parseInt(match[1]);
  const m1 = match[2] ? parseInt(match[2]) : 0;
  const ampm1 = match[3].toUpperCase();
  const h2 = parseInt(match[4]);
  const m2 = match[5] ? parseInt(match[5]) : 0;
  const ampm2 = match[6].toUpperCase();

  let hour1 = h1;
  if (ampm1 === 'PM' && h1 !== 12) hour1 += 12;
  if (ampm1 === 'AM' && h1 === 12) hour1 = 0;

  let hour2 = h2;
  if (ampm2 === 'PM' && h2 !== 12) hour2 += 12;
  if (ampm2 === 'AM' && h2 === 12) hour2 = 0;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = hour1 * 60 + m1;
  let endMinutes = hour2 * 60 + m2;

  if (endMinutes < startMinutes) endMinutes += 24 * 60;

  if (startMinutes <= currentMinutes && currentMinutes < endMinutes) return true;
  if (currentMinutes < endMinutes && startMinutes > endMinutes) {
    return currentMinutes < endMinutes;
  }
  return false;
}

// ===== FUNCIÓN DE ICONOS POR TIPO =====
function getTipoIcon(tipo) {
  const icons = {
    criolla: { icon: "fa-utensils", color: "#5B8A72" },
    rápida: { icon: "fa-burger", color: "#E67E22" },
    italiana: { icon: "fa-pizza-slice", color: "#E74C3C" },
    mariscos: { icon: "fa-fish", color: "#3498DB" },
    cafetería: { icon: "fa-mug-hot", color: "#8BAA7B" },
    heladería: { icon: "fa-ice-cream", color: "#F1C40F" },
    dulcería: { icon: "fa-cake-candles", color: "#E91E63" }
  };
  return icons[tipo] || { icon: "fa-utensils", color: "#5B8A72" };
}

// ===== FUNCIÓN DE ESCAPE HTML =====
function escapeHtml(str) { 
  if (!str) return ''; 
  return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); 
}