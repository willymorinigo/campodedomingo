import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AmenitiesList from "./components/AmenitiesList";
import GalleryGrid from "./components/GalleryGrid";
import TestimonialsList from "./components/TestimonialsList";
import LocationMap from "./components/LocationMap";
import ReservationSection from "./components/ReservationSection";
import MobileAppDock from "./components/MobileAppDock";
import { Trees, Phone, Clock, ArrowUp, Instagram, Heart, Facebook } from "lucide-react";

export default function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-body bg-[#fcfbf7] text-[#2a2927] pb-20 lg:pb-0">
      {/* Top sticky Navigation Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="grow">
        {/* Elegant display greeting with background image & overlays */}
        <Hero />

        {/* Organized Amenities list grouped nicely */}
        <AmenitiesList />

        {/* Premium Photo Gallery + Lightbox */}
        <GalleryGrid />

        {/* Beautiful guest testimonials section */}
        <TestimonialsList />

        {/* Unified 2-Column Availability & Contact Section */}
        <ReservationSection />

        {/* Styled location section with coordinates and map shortcut link */}
        <LocationMap />
      </main>

      {/* Mobile App Bottom Floating Dock */}
      <MobileAppDock />

      {/* Elegant, premium Footer */}
      <footer className="bg-[#2a2927] text-[#f1f4f0] border-t border-stone-800 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Logo and short pitch */}
            <div className="space-y-4 md:col-span-2">
              <div className="h-14 sm:h-16 flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="Logo El campo de Domingo" 
                  className="h-full w-auto object-contain brightness-0 invert" 
                />
              </div>
              <p className="text-stone-400 text-sm max-w-sm leading-relaxed font-serif italic">
                "En el campo, el sabor de lo auténtico se mezcla con la tradición. Vení a conectar con la naturaleza y la armonía del lugar."
              </p>
              <p className="text-stone-400 text-xs">
                Ubicación ideal para escapadas de fin de semana, eventos corporativos íntimos o festejos familiares. Vajilla completa y amenities premium para hasta 20 personas.
              </p>
            </div>

            {/* Quick Contact info */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#c28c5f] font-bold">Contacto Directo</h4>
              <ul className="space-y-3 text-sm text-stone-300">
                <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#c28c5f] shrink-0" />
                  <span>0221 6045678</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#c28c5f] shrink-0" />
                  <span>Abierto todo el año</span>
                </li>
              </ul>
            </div>

            {/* General policies & links */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#c28c5f] font-bold">Redes y Estadía</h4>
              <ul className="space-y-2 text-xs text-stone-400 mb-4">
                <li>• Alquiler flexible por día o estadías completas</li>
                <li>• Capacidad máxima de vajilla para 20 personas</li>
                <li>• Pileta activa en temporada de verano</li>
                <li>• Entorno 100% natural y de descanso</li>
              </ul>
              {/* Real Social Links */}
              <div className="flex flex-col gap-2.5 pt-2">
                <a 
                  href="https://www.instagram.com/elcampodedomingo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-[#c28c5f] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#c28c5f]" />
                  <span>@elcampodedomingo</span>
                </a>
                <a 
                  href="https://www.facebook.com/p/El-campo-de-Domingo-100075998474274/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-[#c28c5f] transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#c28c5f]" />
                  <span>El campo de Domingo</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Footer block */}
          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
            <p className="flex items-center gap-1.5">
              © {new Date().getFullYear()} El campo de Domingo. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1">
              Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> y tradición campera bonaerense.
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#c28c5f] hover:text-white transition-all duration-200 flex items-center gap-1 font-semibold cursor-pointer"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" /> Volver arriba
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
