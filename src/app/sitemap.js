// src/app/sitemap.js

// ⚠️ Ajusta el import según cómo obtengas los restaurantes en tu proyecto.
// Puede ser una función async que consulte Supabase, o un array local.
import { getRestaurantesPublicos } from '@/lib/data/restaurantes';

export default async function sitemap() {
  const baseUrl = 'https://sazonhabana.com'; // ⚠️ Reemplaza con tu dominio real

  // ---- Páginas estáticas ----
  const staticPages = [
    { path: '',                     priority: 1.0, frequency: 'weekly'  },
    { path: '/espacios',            priority: 0.9, frequency: 'daily'   },
    { path: '/mapa',                priority: 0.8, frequency: 'weekly'  },
    { path: '/solicitar-espacio',   priority: 0.7, frequency: 'monthly' },
    { path: '/privacidad',          priority: 0.4, frequency: 'yearly'  },
    { path: '/terminos',            priority: 0.4, frequency: 'yearly'  },
    { path: '/cookies',             priority: 0.4, frequency: 'yearly'  },
  ].map(({ path, priority, frequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: frequency,
    priority,
  }));

  // ---- Páginas dinámicas de espacios ----
  let spacePages = [];
  try {
    const espacios = await getRestaurantesPublicos(); // Debe devolver [{ id, updated_at }, ...]

    spacePages = espacios.map((espacio) => ({
      url: `${baseUrl}/espacios/${espacio.id}`,
      lastModified: espacio.updated_at ? new Date(espacio.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error al generar sitemap dinámico de espacios:', error);
  }

  return [...staticPages, ...spacePages];
}