import { motion } from "motion/react";
import { MapPin, Navigation, Compass, ExternalLink, Calendar, ShieldCheck } from "lucide-react";

export default function LocationMap() {
  const mapUrl = "https://maps.app.goo.gl/K8tJ1xXUxmfvuXif7";

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-[#fcfbf7] border-b border-stone-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text and arrival instructions - 5 Columns */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Ubicación y Entorno</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927]">
              Un refugio de paz a tu alcance
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              Nos encontramos en una zona rural privilegiada, rodeados de campos tradicionales, horizontes interminables y aire puro. Es el punto de partida perfecto para desconectar de la rutina y volver a conectar con la armonía de la naturaleza.
            </p>

            {/* Practical instructions list */}
            <div className="space-y-4 pt-4 border-t border-stone-100 text-sm text-stone-600">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f4f6f3] flex items-center justify-center text-[#384e3a] shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800">Fácil acceso</h4>
                  <p className="text-stone-500">Ubicado en un punto estratégico campestre de muy cómodo arribo desde rutas principales.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f4f6f3] flex items-center justify-center text-[#384e3a] shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800">Privacidad absoluta</h4>
                  <p className="text-stone-500">Un predio exclusivo sin ruidos urbanos, con seguridad y total tranquilidad natural.</p>
                </div>
              </div>
            </div>

            {/* Direct Link to Google Maps */}
            <div className="pt-4">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#384e3a] hover:bg-[#4c664e] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#4c664e]/20"
              >
                <MapPin className="w-5 h-5 text-[#c28c5f]" />
                Abrir en Google Maps
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>

          {/* Interactive Styled Map Visual - 7 Columns */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl border border-stone-100 p-4 shadow-lg overflow-hidden group"
            >
              {/* Top Bar of the navigator mockup */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="font-medium ml-2 text-stone-700">El campo de Domingo • Ubicación</span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm">GOOGLE MAPS</span>
              </div>

              {/* Map Canvas Frame */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner h-[380px] lg:h-[420px]">
                {/* Live Google Maps Iframe */}
                <iframe
                  src="https://maps.google.com/maps?q=-35.0338269,-57.6613094&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Ubicación de El campo de Domingo"
                ></iframe>
              </div>

              {/* Security info card under map */}
              <div className="mt-4 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex gap-2.5 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  <strong>Coordenadas precisas certificadas:</strong> Al confirmar tu consulta, te enviaremos el plano detallado con referencias e indicaciones paso a paso para GPS/Waze.
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
