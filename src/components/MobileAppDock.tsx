import { useState, useEffect } from "react";
import { Home, Sparkles, Image, Calendar, MessageCircle, Trees } from "lucide-react";

export default function MobileAppDock() {
  const [activeTab, setActiveTab] = useState<string>("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "comodidades", "galeria", "testimonios", "calendario", "ubicacion"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const openWhatsApp = () => {
    const whatsappUrl = "https://api.whatsapp.com/send?phone=5492216045678&text=" + encodeURIComponent("¡Hola El campo de Domingo! Me comunico desde la app para consultar disponibilidad y tarifas.");
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pointer-events-none">
      <nav 
        className="pointer-events-auto mx-auto max-w-md bg-[#2a2927]/95 backdrop-blur-xl border border-stone-700/60 text-stone-300 rounded-2xl shadow-2xl px-2 py-2 flex items-center justify-around"
        style={{
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Tab 1: Inicio */}
        <button
          onClick={() => scrollToSection("inicio")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[54px] ${
            activeTab === "inicio"
              ? "text-[#c28c5f] font-bold scale-105"
              : "text-stone-400 hover:text-stone-200"
          }`}
          aria-label="Ir a Inicio"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </button>

        {/* Tab 2: Servicios */}
        <button
          onClick={() => scrollToSection("comodidades")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[54px] ${
            activeTab === "comodidades"
              ? "text-[#c28c5f] font-bold scale-105"
              : "text-stone-400 hover:text-stone-200"
          }`}
          aria-label="Ir a Servicios"
        >
          <Trees className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Servicios</span>
        </button>

        {/* Tab 3: Reservar (Central Elevated Primary App Action) */}
        <button
          onClick={() => scrollToSection("calendario")}
          className="relative -top-2 flex flex-col items-center justify-center cursor-pointer group"
          aria-label="Ver Disponibilidad y Reservar"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#384e3a] to-[#4c664e] text-white flex items-center justify-center shadow-lg shadow-[#384e3a]/40 border-2 border-[#fcfbf7] group-active:scale-95 transition-transform">
            <Calendar className="w-5 h-5 text-[#c28c5f]" />
          </div>
          <span className="text-[10px] font-bold text-stone-200 mt-0.5">Reservar</span>
        </button>

        {/* Tab 4: Galería */}
        <button
          onClick={() => scrollToSection("galeria")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[54px] ${
            activeTab === "galeria"
              ? "text-[#c28c5f] font-bold scale-105"
              : "text-stone-400 hover:text-stone-200"
          }`}
          aria-label="Ir a Galería"
        >
          <Image className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Galería</span>
        </button>

        {/* Tab 5: WhatsApp Direct */}
        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-200 cursor-pointer min-w-[54px]"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Chat</span>
        </button>
      </nav>
    </div>
  );
}
