/**
 * ============================================
 * RESTAURANTES.SEED.JS - Datos iniciales
 * ============================================
 * Este archivo se usará para el seed de Supabase.
 * La estructura coincide con la tabla `restaurantes`.
 */

export const RESTAURANTES_SEED = [
  {
    nombre: 'El Biky',
    municipio: 'Plaza de la Revolución',
    direccion: 'Calle Infanta e/ San Lázaro y Concordia',
    tipo: 'rápida',
    precio: '2',
    horario: 'Lunes - Sábado: 11:00 AM - 12:00 AM | Domingo: 10:00 AM - 10:00 PM',
    telefono: '+53 78706515',
    descripcion: 'Complejo gastronómico icónico en Vedado. Ofrece pastelería de primer nivel, comidas rápidas sabrosas, pizzas crujientes y platos de cocina internacional en un ambiente moderno y climatizado.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    galeria: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600'
    ],
    lat: 23.1368,
    lng: -82.3785,
    aire: true,
    clima: true,
    parqueo: false,
    secciones_carta: [
      { seccion: 'Entrantes', platos: [
        { nombre: 'Croquetas de Jamón', precio: '$600 CUP' },
        { nombre: 'Focaccia de Ajo', precio: '$750 CUP' }
      ]},
      { seccion: 'Platos Fuertes', platos: [
        { nombre: 'Fettuccine Alfredo', precio: '$1950 CUP' },
        { nombre: 'Lomo de Cerdo Asado', precio: '$2200 CUP' },
        { nombre: 'Pizza Margarita Biky', precio: '$1200 CUP', descripcion: 'Masa delgada, salsa de tomate de la casa, abundante queso mozzarella fresco y albahaca aromática.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
        { nombre: 'Hamburguesa Suprema', precio: '$1800 CUP', descripcion: 'Carne de res seleccionada, panceta ahumada cubana, queso cheddar derretido, lechuga y salsa secreta.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' }
      ]}
    ],
    platos_populares: [
      { nombre: 'Pizza Margarita Biky', precio: '$1200 CUP', descripcion: 'Masa delgada, salsa de tomate de la casa, abundante queso mozzarella fresco y albahaca aromática.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
      { nombre: 'Hamburguesa Suprema', precio: '$1800 CUP', descripcion: 'Carne de res seleccionada, panceta ahumada cubana, queso cheddar derretido, lechuga y salsa secreta.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    nombre: 'El Aljibe',
    municipio: 'Playa',
    direccion: 'Avenida 7ma e/ 24 y 26',
    tipo: 'criolla',
    precio: '2',
    horario: 'Todos los días: 12:00 PM - 10:00 PM',
    telefono: '+53 72041584',
    descripcion: 'Famoso restaurante cubano a cielo abierto. Especialidad única es el Pollo Asado al Aljibe.',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    galeria: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
    ],
    lat: 23.1252,
    lng: -82.4190,
    aire: true,
    clima: false,
    parqueo: true,
    secciones_carta: [
      { seccion: 'Especialidades Criollas', platos: [
        { nombre: 'Ropa Vieja', precio: '$2800 CUP' },
        { nombre: 'Masas de Cerdo Fritas', precio: '$2100 CUP' },
        { nombre: 'Pollo Asado Sazón Aljibe', precio: '$2500 CUP', descripcion: 'Pollo asado jugoso cubierto de salsa cítrica agridulce secreta y guarnición campesina ilimitada.', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200' }
      ]}
    ],
    platos_populares: [
      { nombre: 'Pollo Asado Sazón Aljibe', precio: '$2500 CUP', descripcion: 'Pollo asado jugoso cubierto de salsa cítrica agridulce secreta y guarnición campesina ilimitada.', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200' }
    ]
  }
  // ... los demás 19 restaurantes del archivo original data.js
  // Los completaremos al hacer el seed de Supabase
];

export default RESTAURANTES_SEED;