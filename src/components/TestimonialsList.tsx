import { motion } from "motion/react";
import { Star, MessageSquare } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function TestimonialsList() {
  return (
    <section id="testimonios" className="py-16 sm:py-24 bg-[#f4f6f3] border-b border-stone-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Testimonios Reales</span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927] mb-4 sm:mb-6">
            La experiencia de nuestros huéspedes
          </h2>
          <p className="text-stone-600 leading-relaxed text-xs sm:text-base">
            No hay nada más auténtico que las voces de quienes ya disfrutaron de la paz de nuestro campo. Parejas, familias y grupos de amigos comparten su paso por La Armonía.
          </p>
        </div>

        {/* 3-column elegant layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((testimonial, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={testimonial.id}
                className="bg-white p-5 sm:p-8 rounded-2xl border border-stone-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#c28c5f] text-[#c28c5f]" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic mb-6 font-serif">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Profile Details */}
                <div className="flex items-center gap-3 pt-5 border-t border-stone-100 mt-4">
                  <div className="w-10 h-10 rounded-full bg-[#f4f6f3] flex items-center justify-center text-[#384e3a] font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800 text-sm">{testimonial.name}</h4>
                    <div className="flex justify-between items-center w-full gap-4 text-[11px] text-stone-400">
                      <span>{testimonial.role}</span>
                      <span className="font-medium text-[#c28c5f]">• {testimonial.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Traditional touch info panel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center max-w-2xl mx-auto bg-stone-100/50 rounded-2xl p-6 border border-stone-200/50"
        >
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            🌿 "En La Armonía, cada detalle está pensado para honrar el sabor de lo auténtico y la tradición del campo bonaerense." ¡Sumá tu testimonio después de tu estadía!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
