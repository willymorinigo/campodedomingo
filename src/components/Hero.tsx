import { motion } from "motion/react";
import { ArrowDown, Calendar } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background Video with rustic warm overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Visual Overlay - Earthy forest vignette */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2a2927]/70 via-[#2a2927]/50 to-[#fcfbf7]" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl" style={{ paddingTop: "35px" }}>
        <motion.p 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.4, 
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f1f4f0] italic max-w-3xl mx-auto drop-shadow-md font-medium leading-snug sm:leading-relaxed"
          style={{ marginBottom: "20px" }}
        >
          "En el campo, el sabor de lo auténtico se mezcla con la tradición. Vení a conectar con la naturaleza y la armonía del lugar."
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-sm sm:text-base text-stone-200 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Escápate de la rutina y disfrutá de uno o más días en el campo, rodeado de aire puro, naturaleza única y la tranquilidad que te merecés.
        </motion.p>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => scrollToSection("calendario")}
            className="w-full sm:w-auto px-8 py-4 bg-[#384e3a] hover:bg-[#4c664e] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#4c664e]/20 group cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-[#c28c5f] group-hover:scale-110 transition-transform" />
            Ver Disponibilidad
          </button>
        </motion.div>
      </div>

      {/* Bounce Down Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer text-stone-400 hover:text-[#384e3a] transition-colors" onClick={() => scrollToSection("comodidades")}>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  );
}
