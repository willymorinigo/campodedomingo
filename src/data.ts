import { Amenity, GalleryImage, Testimonial } from "./types";

export const AMENITIES: Amenity[] = [
  // Exteriores y Recreación
  {
    name: "Pileta Amplia",
    description: "Pileta de 7,5 x 4 metros. Profundidad de 1.4 a 1.8 metros, ideal para refrescarse y disfrutar del sol.",
    icon: "Waves",
    category: "exteriores",
  },
  {
    name: "Parrilla Tradicional",
    description: "Gran parrilla para disfrutar de los mejores asados al aire libre con amigos o familia.",
    icon: "Flame",
    category: "exteriores",
  },
  {
    name: "Fogón con Asador",
    description: "Espacio para fogata y asador a la cruz, perfecto para veladas estrelladas y cocina rústica.",
    icon: "Compass",
    category: "exteriores",
  },
  {
    name: "Mesas, Bancos y Sillas",
    description: "Equipamiento completo para sentarse cómodamente y disfrutar de banquetes al aire libre o bajo techo.",
    icon: "LayoutList",
    category: "exteriores",
  },
  // Instalaciones Interiores
  {
    name: "Cocina Equipada",
    description: "Cocina funcional para preparar todo tipo de platos camperos.",
    icon: "ChefHat",
    category: "instalaciones",
  },
  {
    name: "Heladera con Freezer",
    description: "Para mantener tus bebidas y comida a la temperatura ideal durante tu estadía.",
    icon: "Refrigerator",
    category: "instalaciones",
  },
  {
    name: "Vajilla Completa",
    description: "Servicio de vajilla completo para hasta 20 personas, listo para usar.",
    icon: "Utensils",
    category: "instalaciones",
  },
  {
    name: "Manteles Opcionales",
    description: "Disponemos de mantelería para vestir las mesas de tus eventos (opcional).",
    icon: "Layers",
    category: "instalaciones",
  },
  {
    name: "Agua Fría y Caliente",
    description: "Servicio continuo de agua con excelente presión en toda la casa.",
    icon: "Droplets",
    category: "instalaciones",
  },
  {
    name: "Baño Completo",
    description: "Baño cómodo y equipado con todo lo necesario.",
    icon: "Bath",
    category: "instalaciones",
  },
  // Dormitorios y Descanso
  {
    name: "Cama Matrimonial",
    description: "Habitación principal con sommier matrimonial muy cómodo para descansar profundamente.",
    icon: "BedDouble",
    category: "dormitorios",
  },
  {
    name: "Cama Cucheta",
    description: "Camas superpuestas ideales para los chicos o amigos en el sector familiar.",
    icon: "Bed",
    category: "dormitorios",
  },
  {
    name: "Cama Individual",
    description: "Cama de una plaza adicional en el espacio de descanso.",
    icon: "User",
    category: "dormitorios",
  },
  {
    name: "Colchón de Dos Plazas",
    description: "Colchón de dos plazas adicional disponible para sumar capacidad de descanso.",
    icon: "Smile",
    category: "dormitorios",
  },
  // Comodidades Tecnológicas
  {
    name: "TV con DirecTV",
    description: "Televisión con servicio de cable satelital para no perderte tus programas o partidos favoritos.",
    icon: "Tv",
    category: "comodidades",
  },
  {
    name: "Conectividad Wi-Fi",
    description: "Wi-Fi en toda la propiedad para estar conectado si lo necesitás, sin perder la paz del campo.",
    icon: "Wifi",
    category: "comodidades",
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    url: "/campo_y_asado.jpg",
    title: "Campo y asado tradicional de domingo",
    category: "exterior",
  },
  {
    id: "g2",
    url: "/disfrutar_al_aire_libre.jpg",
    title: "Disfrutar al aire libre bajo la arboleda",
    category: "exterior",
  },
  {
    id: "g3",
    url: "/naturaleza_por_donde_mires.jpg",
    title: "Naturaleza y verde por donde mires",
    category: "exterior",
  },
  {
    id: "g4",
    url: "/noches_de_armonia.jpg",
    title: "Noches de armonía al calor del fogón",
    category: "eventos",
  },
  {
    id: "g5",
    url: "/pile_y_aire_puro.jpg",
    title: "Pileta y aire puro para desconectar",
    category: "pileta",
  },
  {
    id: "g6",
    url: "/pileta_sombra_descanso.jpg",
    title: "Pileta, sombra y descanso en la reposera",
    category: "pileta",
  },
  {
    id: "g7",
    url: "/tranquilidad.jpg",
    title: "La tranquilidad única de nuestros espacios",
    category: "interior",
  },
  {
    id: "g8",
    url: "/atardeceres_unicos.jpg",
    title: "Atardeceres únicos pintando el horizonte",
    category: "exterior",
  },
  {
    id: "g9",
    url: "/espacios_de_mate_charlas_y_juegos.jpg",
    title: "Espacios de mate, charlas y juegos familiares",
    category: "eventos",
  },
  {
    id: "g10",
    url: "/nada_como_la_paz_del_campo.jpg",
    title: "Nada como la paz y armonía del campo",
    category: "interior",
  },
  {
    id: "g11",
    url: "/placeres_unicos.jpg",
    title: "Placeres únicos y de encuentro auténtico",
    category: "eventos",
  },
  {
    id: "g12",
    url: "/espacios_de_calidez.jpg",
    title: "Espacios de calidez y confort en cada rincón",
    category: "interior",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Estela & Familia",
    role: "Escapada de Fin de Semana",
    text: "Un lugar mágico. Pasamos 3 días maravillosos desconectados de la ciudad. El parque es enorme, la pileta estaba impecable y la calidez de la casa te hace sentir como en tu propio hogar. ¡El fogón por la noche bajo las estrellas es imperdible!",
    rating: 5,
    date: "Marzo 2026",
  },
  {
    id: "t2",
    name: "Mariano Gómez",
    role: "Cumpleaños de 40",
    text: "Alquilamos la casa de campo para mi cumpleaños de 40. Éramos 18 personas y la comodidad fue total. Las mesas, bancos y la vajilla completa para 20 nos facilitaron todo. El asador a la cruz funcionó espectacular. Todos los invitados quedaron fascinados con el entorno.",
    rating: 5,
    date: "Febrero 2026",
  },
  {
    id: "t3",
    name: "Clara y Facundo",
    role: "Escapada Romántica",
    text: "La tranquilidad del entorno natural es increíble, solo se escuchan los pájaros y el viento. La cama súper cómoda, la cocina muy equipada y el Wi-Fi funcionó de diez para cuando tuvimos que responder un par de correos. Sin duda volveremos.",
    rating: 5,
    date: "Enero 2026",
  },
];

// Realistic busy dates for our availability calendar (next 3 months)
// Format: YYYY-MM-DD
export const INITIAL_BOOKED_DATES: string[] = [
  // September 2026
  "2026-09-19",
  "2026-09-20",
  "2026-09-26",
  "2026-09-27",
  // October 2026
  "2026-10-03",
  "2026-10-04",
  "2026-10-10",
  "2026-10-11",
  "2026-10-12", // Holiday long weekend
  "2026-10-24",
  "2026-10-25",
  // November 2026
  "2026-11-07",
  "2026-11-08",
  "2026-11-21",
  "2026-11-22",
  "2026-11-23", // Holiday
];
