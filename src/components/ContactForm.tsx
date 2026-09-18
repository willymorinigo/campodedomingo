import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, User, Calendar, Users, Home, CheckCircle2, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { InquiryFormData } from "../types";

interface ContactFormProps {
  selectedCheckIn: string | null;
  selectedCheckOut: string | null;
  onResetDates: () => void;
}

export default function ContactForm({ selectedCheckIn, selectedCheckOut, onResetDates }: ContactFormProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    stayType: "escapada",
    guestsCount: 4,
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<InquiryFormData | null>(null);

  // Autofill from Calendar selection
  useEffect(() => {
    if (selectedCheckIn) {
      setFormData((prev) => ({
        ...prev,
        checkIn: selectedCheckIn,
        checkOut: selectedCheckOut || selectedCheckIn,
      }));
    }
  }, [selectedCheckIn, selectedCheckOut]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clean field error on change
    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es requerido.";
    }
    if (!formData.checkIn) {
      newErrors.checkIn = "La fecha de ingreso es requerida.";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "La fecha de salida es requerida.";
    } else if (new Date(formData.checkIn) > new Date(formData.checkOut)) {
      newErrors.checkOut = "La fecha de salida debe ser posterior al ingreso.";
    }
    if (formData.guestsCount < 1 || formData.guestsCount > 20) {
      newErrors.guestsCount = "La capacidad permitida es de 1 a 20 personas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate sending inquiry (rustic elegant delay)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSubmittedData({ ...formData });

      // Generate WhatsApp link with custom pre-formatted text
      const stayTypeText = formData.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar / Festejo";
      const messageText = `¡Hola El campo de Domingo! Me gustaría consultar por una estadía.\n\n*Nombre:* ${formData.fullName}\n*Teléfono:* ${formData.phone}\n*Ingreso:* ${formatFriendlyDate(formData.checkIn)}\n*Salida:* ${formatFriendlyDate(formData.checkOut)}\n*Tipo de estadía:* ${stayTypeText}\n*Cantidad de personas:* ${formData.guestsCount}${formData.message ? `\n*Mensaje:* ${formData.message}` : ""}`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5492216045678&text=${encodeURIComponent(messageText)}`;
      
      // Attempt automatic redirect (gracefully handled by most browsers or supported by manual CTA)
      window.open(whatsappUrl, "_blank");
      
      // Reset form but keep selected checkIn/checkOut for confirmation state
      setFormData({
        fullName: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        stayType: "escapada",
        guestsCount: 4,
        message: "",
      });
      onResetDates();
    }, 1500);
  };

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <section id="contacto" className="pt-2 pb-24 bg-[#fcfbf7] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Contacto Directo</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2a2927] mb-4">
            Iniciá tu reserva
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm">
            Completá tu solicitud a continuación. Te responderemos personalmente en menos de 24 horas por teléfono o WhatsApp.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-lg p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* Visual feedback if dates are autofilled */}
                {selectedCheckIn && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Se aplicaron las fechas seleccionadas: <strong>{formatFriendlyDate(selectedCheckIn)}</strong> al <strong>{formatFriendlyDate(selectedCheckOut || selectedCheckIn)}</strong>.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onResetDates}
                      className="text-stone-400 hover:text-stone-700 font-semibold underline cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" /> Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ej: Estela Fernández"
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                        errors.fullName ? "border-red-300" : "border-stone-200"
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" /> Número de Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej: 0221 604-5678"
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                        errors.phone ? "border-red-300" : "border-stone-200"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                  </div>

                  {/* Stay Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-stone-400" /> Tipo de Alquiler
                    </label>
                    <select
                      name="stayType"
                      value={formData.stayType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all"
                    >
                      <option value="escapada">Escapada de Fin de Semana / Descanso</option>
                      <option value="evento">Evento Familiar / Festejo Íntimo</option>
                      <option value="otro">Estadía extendida / Otro motivo</option>
                    </select>
                  </div>

                  {/* Guests count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400" /> Cantidad de Personas *
                    </label>
                    <input
                      type="number"
                      name="guestsCount"
                      value={formData.guestsCount}
                      onChange={handleChange}
                      min={1}
                      max={20}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                        errors.guestsCount ? "border-red-300" : "border-stone-200"
                      }`}
                    />
                    <span className="text-[10px] text-stone-400 font-medium block">Máximo 20 personas (Vajilla completa provista para 20)</span>
                    {errors.guestsCount && <p className="text-xs text-red-500 font-medium">{errors.guestsCount}</p>}
                  </div>

                  {/* Check-In */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" /> Fecha de Ingreso *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                        errors.checkIn ? "border-red-300" : "border-stone-200"
                      }`}
                    />
                    {errors.checkIn && <p className="text-xs text-red-500 font-medium">{errors.checkIn}</p>}
                  </div>

                  {/* Check-Out */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" /> Fecha de Salida *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                        errors.checkOut ? "border-red-300" : "border-stone-200"
                      }`}
                    />
                    {errors.checkOut && <p className="text-xs text-red-500 font-medium">{errors.checkOut}</p>}
                  </div>
                </div>

                {/* Message / Comments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-400" /> Mensaje o Consulta Adicional
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Contanos un poco más sobre lo que tenés planeado: si vas a pasar el día, celebrar un cumpleaños o querés venir a descansar un fin de semana completo..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all resize-none"
                  />
                </div>

                {/* Submission CTA */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-[#384e3a] hover:bg-[#4c664e] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#c28c5f]" />
                        Procesando Consulta...
                      </>
                    ) : (
                      <>
                        Enviar Consulta Directa
                        <ArrowRight className="w-4 h-4 text-[#c28c5f]" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 mt-3 font-medium">Al presionar enviar, iniciás una solicitud de consulta directa sin costo.</p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2a2927]">
                    ¡Consulta recibida con éxito!
                  </h3>
                  <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
                    Muchas gracias, <strong>{submittedData?.fullName}</strong>. Tu solicitud de consulta para el rango del <strong>{formatFriendlyDate(submittedData?.checkIn || "")}</strong> al <strong>{formatFriendlyDate(submittedData?.checkOut || "")}</strong> fue enviada.
                  </p>
                </div>

                 {/* Detail Box */}
                <div className="bg-[#f4f6f3] p-6 rounded-2xl border border-stone-100 max-w-md mx-auto text-left text-xs text-stone-600 space-y-2">
                  <p className="font-bold text-stone-700 text-sm mb-3">Resumen de tu solicitud:</p>
                  <p>• <strong>Tipo de estadía:</strong> {submittedData?.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar / Festejo"}</p>
                  <p>• <strong>Invitados:</strong> {submittedData?.guestsCount} personas</p>
                  <p>• <strong>Teléfono de contacto:</strong> {submittedData?.phone}</p>
                </div>

                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  Te contactaremos en las próximas 24 horas a través de WhatsApp o llamada a tu número provisto para coordinar detalles de seña, acceso y tarifas. ¡Que pases un hermoso día!
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href={`https://api.whatsapp.com/send?phone=5492216045678&text=${encodeURIComponent(
                      `¡Hola El campo de Domingo! Me gustaría consultar por una estadía.\n\n*Nombre:* ${submittedData?.fullName}\n*Teléfono:* ${submittedData?.phone}\n*Ingreso:* ${formatFriendlyDate(submittedData?.checkIn || "")}\n*Salida:* ${formatFriendlyDate(submittedData?.checkOut || "")}\n*Tipo de estadía:* ${submittedData?.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar / Festejo"}\n*Cantidad de personas:* ${submittedData?.guestsCount}${submittedData?.message ? `\n*Mensaje:* ${submittedData?.message}` : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.706 1.457h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar por WhatsApp
                  </a>
                  
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSubmittedData(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Realizar otra consulta
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
