import { useState, useEffect } from "react";
import { Trees, Menu, X, Phone, Calendar } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", id: "inicio" },
    { name: "Comodidades", id: "comodidades" },
    { name: "Galería", id: "galeria" },
    { name: "Testimonios", id: "testimonios" },
    { name: "Disponibilidad", id: "calendario" },
    { name: "Ubicación", id: "ubicacion" },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky navbar
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? "bg-[#fcfbf7]/95 backdrop-blur-md shadow-sm py-4 border-b border-stone-100" 
        : "bg-gradient-to-b from-black/50 to-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => scrollToSection("inicio")}
          className="cursor-pointer group animate-fade-in"
        >
          <div className="h-14 sm:h-16 flex items-center transition-transform duration-300 group-hover:scale-105">
            <img 
              src="/logo.svg" 
              alt="El campo de Domingo" 
              className={`h-full w-auto object-contain transition-all duration-300 ${
                isScrolled ? "brightness-0" : "brightness-0 invert"
              }`} 
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1.5 transition-colors duration-300 cursor-pointer ${
                    isScrolled 
                      ? "text-stone-600 hover:text-[#384e3a]" 
                      : "text-stone-100 hover:text-[#c28c5f]"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => scrollToSection("contacto")}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
              isScrolled
                ? "bg-[#384e3a] hover:bg-[#4c664e] text-white shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c28c5f]" />
            Consultar Ahora
          </button>
        </div>

        {/* Mobile App Top Actions */}
        <div className="lg:hidden flex items-center gap-2">
          <a
            href="https://api.whatsapp.com/send?phone=5492216045678&text=Hola%20El%20campo%20de%20Domingo,%20quisiera%20hacer%20una%20consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#25d366] text-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
            aria-label="WhatsApp directo"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer active:scale-95 ${
              isScrolled 
                ? "text-[#2a2927] border-stone-200 bg-white/80" 
                : "text-white border-white/20 bg-black/20 backdrop-blur-xs"
            }`}
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile App Drawer / Sheet */}
      {isOpen && (
        <div className="lg:hidden fixed top-[68px] left-0 right-0 bottom-0 bg-[#fcfbf7]/98 backdrop-blur-xl z-50 p-5 flex flex-col justify-between border-t border-stone-100 overflow-y-auto pb-24">
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#c28c5f]">
              Navegación de la App
            </p>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left py-3 px-4 rounded-xl font-serif text-lg font-bold text-stone-800 hover:bg-[#384e3a]/10 hover:text-[#384e3a] active:bg-[#384e3a]/15 transition-all flex items-center justify-between border border-stone-100 bg-white shadow-xs"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-stone-400 font-sans font-normal">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-stone-200/80">
            <button
              onClick={() => scrollToSection("calendario")}
              className="w-full py-3.5 bg-[#384e3a] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
            >
              <Calendar className="w-4 h-4 text-[#c28c5f]" />
              Ver Calendario y Reservar
            </button>
            <p className="text-center text-xs text-stone-500">
              El campo de Domingo • Magdalena, Buenos Aires
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
