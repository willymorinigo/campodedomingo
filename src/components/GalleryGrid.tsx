import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Eye, Grid } from "lucide-react";
import { GALLERY_IMAGES } from "../data";
import { GalleryImage } from "../types";

export default function GalleryGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (imgId: string) => {
    const globalIndex = GALLERY_IMAGES.findIndex((item) => item.id === imgId);
    if (globalIndex !== -1) {
      setLightboxIndex(globalIndex);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    
    let newIndex = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;
    if (newIndex < 0) {
      newIndex = GALLERY_IMAGES.length - 1;
    } else if (newIndex >= GALLERY_IMAGES.length) {
      newIndex = 0;
    }
    
    setLightboxIndex(newIndex);
  };

  return (
    <section id="galeria" className="py-24 bg-[#fcfbf7] border-b border-stone-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Galería Fotográfica</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927] mb-6">
            Rodeado de naturaleza y aire puro
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            Recorré en imágenes cada uno de nuestros rincones. El diseño rústico y elegante convive armoniosamente con el verde del campo para regalarte una experiencia perfecta de desconexión.
          </p>
        </div>

        {/* Filtered Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {GALLERY_IMAGES.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={img.id}
                onClick={() => openLightbox(img.id)}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-stone-100 bg-stone-100 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Elegant overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2927]/80 via-[#2a2927]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 text-[#c28c5f] mb-1.5 text-xs font-semibold uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" /> Ver en grande
                  </div>
                  <h3 className="font-serif text-white font-medium text-sm sm:text-base leading-tight">
                    {img.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox / Slideshow Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 sm:p-10"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Slider Main Frame */}
              <div 
                className="relative max-w-5xl w-full h-full max-h-[75vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Previous Button */}
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-2 sm:-left-12 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Animated Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <img
                      src={GALLERY_IMAGES[lightboxIndex].url}
                      alt={GALLERY_IMAGES[lightboxIndex].title}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Caption bar */}
                    <div className="absolute -bottom-16 left-0 right-0 text-center px-4">
                      <p className="font-serif text-white text-base sm:text-lg mb-1">
                        {GALLERY_IMAGES[lightboxIndex].title}
                      </p>
                      <span className="text-xs uppercase tracking-widest text-stone-300 font-medium">
                        {lightboxIndex + 1} de {GALLERY_IMAGES.length}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Next Button */}
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-2 sm:-right-12 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer z-10"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
