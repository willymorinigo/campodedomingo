import { useState } from "react";
import { motion } from "motion/react";
import { 
  Waves, 
  Flame, 
  Compass, 
  LayoutList, 
  ChefHat, 
  Utensils, 
  Layers, 
  Droplets, 
  Bath, 
  BedDouble, 
  Bed, 
  User, 
  Smile, 
  Tv, 
  Wifi,
  Trees,
  Check
} from "lucide-react";
import { AMENITIES } from "../data";
import { Amenity } from "../types";

// Icon mapper for safe compilation
const iconMap: Record<string, React.ComponentType<any>> = {
  Waves: Waves,
  Flame: Flame,
  Compass: Compass,
  LayoutList: LayoutList,
  ChefHat: ChefHat,
  Refrigerator: (props: any) => (
    // Solid fallback SVG in case Refrigerator is missing from older package builds
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M3 10h18" />
      <path d="M7 6v2" />
      <path d="M7 14v4" />
    </svg>
  ),
  Utensils: Utensils,
  Layers: Layers,
  Droplets: Droplets,
  Bath: Bath,
  BedDouble: BedDouble,
  Bed: Bed,
  User: User,
  Smile: Smile,
  Tv: Tv,
  Wifi: Wifi,
};

export default function AmenitiesList() {
  const [activeTab, setActiveTab] = useState<"todos" | "exteriores" | "instalaciones" | "dormitorios">("todos");

  const categories = [
    { id: "todos", name: "Todos los servicios", icon: Trees },
    { id: "exteriores", name: "Aire libre y Recreación", icon: Flame },
    { id: "instalaciones", name: "Casa e Instalaciones", icon: ChefHat },
    { id: "dormitorios", name: "Dormitorios y Descanso", icon: BedDouble },
  ];

  const filteredAmenities = AMENITIES.filter((amenity) => {
    if (activeTab === "todos") return true;
    return amenity.category === activeTab;
  });

  return (
    <section id="comodidades" className="py-24 bg-[#fcfbf7] border-b border-stone-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Comodidades</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927] mb-6">
            Todo lo que te espera en el campo
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            Diseñado para que te relajes al máximo. Contamos con equipamiento completo para hasta 20 personas, permitiendo disfrutar de estadías de un día o de toda una semana con confort rústico y elegante.
          </p>
        </div>

        {/* Elegant Rustic App-like Category Chips */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto pb-3 sm:pb-0 justify-start sm:justify-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-12 scrollbar-none">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id as any)}
                className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#384e3a] text-white border-[#384e3a] shadow-md shadow-[#384e3a]/10 font-semibold"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#384e3a]/30 hover:text-[#384e3a]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#c28c5f]" : "text-stone-400"}`} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid of Amenities */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredAmenities.map((amenity, index) => {
            const IconComponent = iconMap[amenity.icon] || Check;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={amenity.name}
                className="bg-white p-6 rounded-xl border border-stone-100 hover:border-[#384e3a]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#f4f6f3] flex items-center justify-center text-[#384e3a] group-hover:bg-[#384e3a] group-hover:text-white transition-colors duration-300 mb-5">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-stone-800 text-lg mb-2 group-hover:text-[#384e3a] transition-colors">
                    {amenity.name}
                  </h3>
                  {amenity.description && (
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {amenity.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-stone-50 flex items-center gap-1.5 text-xs text-[#c28c5f] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-3.5 h-3.5" /> Incluido en el alquiler
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed specs box from user input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-[#384e3a] text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden"
        >
          {/* Decorative background circle */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
            <div className="md:col-span-2">
              <span className="text-xs font-semibold tracking-widest text-[#c28c5f] uppercase block mb-2">Detalles Destacados</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4">¿Querés armar un evento o una escapada?</h3>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                Nuestras instalaciones están listas para recibir tanto a familias que buscan silencio y aire puro, como a eventos íntimos o festejos campestres de hasta 20 personas. Contamos con vajilla completa, mesas amplias, bancos rústicos y una pileta imponente.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-6 border border-white/10">
              <h4 className="font-bold text-[#c28c5f] mb-3 text-sm tracking-wider uppercase">Especificaciones Clave:</h4>
              <ul className="space-y-2.5 text-sm text-stone-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c28c5f]" />
                  <span>Pileta: 7.5 x 4mt (Prof: 1.4 a 1.8m)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c28c5f]" />
                  <span>Capacidad de Vajilla: 20 personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c28c5f]" />
                  <span>Tv con DirecTV + Wifi Rural</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c28c5f]" />
                  <span>Flexibilidad: 1 o más días</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
