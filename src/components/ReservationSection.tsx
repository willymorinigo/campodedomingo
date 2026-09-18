import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Users, 
  Compass,
  Home, 
  MessageSquare, 
  Clock,
  RotateCcw
} from "lucide-react";
import { INITIAL_BOOKED_DATES } from "../data";
import { InquiryFormData } from "../types";

// Helper to check if a date is booked
const isDateBooked = (dateStr: string) => {
  return INITIAL_BOOKED_DATES.includes(dateStr);
};

// Formatting date string YYYY-MM-DD
const formatDateString = (year: number, month: number, day: number) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

// Friendly Spanish date format DD/MM/YYYY
const formatFriendlyDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Calculate days/nights difference
const calculateDuration = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  
  if (diffDays === 0) {
    return "Jornada de 1 día (pasadía)";
  } else if (diffDays === 1) {
    return "2 días / 1 noche";
  } else {
    return `${diffDays + 1} días / ${diffDays} noches`;
  }
};

export default function ReservationSection() {
  // Setup calendar starting at current season (September 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1));
  
  // Unified reservation state
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    stayType: "escapada",
    guestsCount: 4,
    message: "",
  });

  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<InquiryFormData | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const prevMonth = () => {
    if (year === 2026 && month === 8) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    if (year === 2027 && month === 3) return;
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar Click Handler
  const handleDateClick = (day: number) => {
    const clickedDateStr = formatDateString(year, month, day);

    if (isDateBooked(clickedDateStr)) {
      setCalendarError("La fecha seleccionada ya está reservada. Por favor, elegí un día disponible.");
      return;
    }

    setCalendarError(null);

    // If no checkIn or both are set, start new selection
    if (!formData.checkIn || (formData.checkIn && formData.checkOut && formData.checkIn !== formData.checkOut)) {
      setFormData((prev) => ({
        ...prev,
        checkIn: clickedDateStr,
        checkOut: clickedDateStr,
      }));
      if (errors.checkIn || errors.checkOut) {
        setErrors((prev) => ({ ...prev, checkIn: undefined, checkOut: undefined }));
      }
    } else {
      // Second click: setting range
      const startObj = new Date(formData.checkIn);
      const endObj = new Date(clickedDateStr);

      if (endObj < startObj) {
        // If clicked date is earlier, make it the new start date
        setFormData((prev) => ({
          ...prev,
          checkIn: clickedDateStr,
          checkOut: clickedDateStr,
        }));
      } else {
        // Check if there are booked dates in between
        let hasBookedInBetween = false;
        const current = new Date(startObj);
        while (current <= endObj) {
          const checkStr = current.toISOString().split("T")[0];
          if (isDateBooked(checkStr)) {
            hasBookedInBetween = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (hasBookedInBetween) {
          setCalendarError("El rango seleccionado incluye días ya reservados. Elegí otro intervalo.");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          checkOut: clickedDateStr,
        }));
        if (errors.checkIn || errors.checkOut) {
          setErrors((prev) => ({ ...prev, checkIn: undefined, checkOut: undefined }));
        }
      }
    }
  };

  const clearDates = () => {
    setFormData((prev) => ({
      ...prev,
      checkIn: "",
      checkOut: "",
    }));
    setCalendarError(null);
  };

  // Status for each day button in calendar
  const getDateStatus = (day: number) => {
    const dateStr = formatDateString(year, month, day);

    if (isDateBooked(dateStr)) return "booked";
    if (!formData.checkIn) return "available";

    if (formData.checkIn === dateStr && (!formData.checkOut || formData.checkIn === formData.checkOut)) {
      return "selected-single";
    }

    if (dateStr === formData.checkIn) return "start";
    if (dateStr === formData.checkOut) return "end";

    if (formData.checkIn && formData.checkOut) {
      const current = new Date(dateStr);
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      if (current > start && current < end) {
        return "range";
      }
    }

    return "available";
  };

  // Form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGuestCountChange = (delta: number) => {
    setFormData((prev) => {
      const next = Math.max(1, Math.min(20, prev.guestsCount + delta));
      return { ...prev, guestsCount: next };
    });
    if (errors.guestsCount) {
      setErrors((prev) => ({ ...prev, guestsCount: undefined }));
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ingresá tu nombre completo.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Ingresá un número de teléfono o WhatsApp.";
    }
    if (!formData.checkIn) {
      newErrors.checkIn = "Seleccioná la fecha de ingreso en el calendario.";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "Seleccioná la fecha de salida.";
    } else if (new Date(formData.checkIn) > new Date(formData.checkOut)) {
      newErrors.checkOut = "La fecha de salida debe ser posterior al ingreso.";
    }
    if (formData.guestsCount < 1 || formData.guestsCount > 20) {
      newErrors.guestsCount = "Capacidad permitida: entre 1 y 20 personas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSubmittedData({ ...formData });

      const stayTypeText = formData.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar / Festejo";
      const messageText = `¡Hola El campo de Domingo! Me gustaría consultar por una estadía.\n\n*Nombre:* ${formData.fullName}\n*Teléfono:* ${formData.phone}\n*Ingreso:* ${formatFriendlyDate(formData.checkIn)}\n*Salida:* ${formatFriendlyDate(formData.checkOut)}\n*Tipo de estadía:* ${stayTypeText}\n*Cantidad de personas:* ${formData.guestsCount}${formData.message ? `\n*Mensaje:* ${formData.message}` : ""}`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5492216045678&text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, "_blank");

      // Reset form but retain dates
      setFormData((prev) => ({
        fullName: "",
        phone: "",
        checkIn: prev.checkIn,
        checkOut: prev.checkOut,
        stayType: "escapada",
        guestsCount: 4,
        message: "",
      }));
    }, 600);
  };

  // Calendar Day Arrays
  const blanks = Array.from({ length: adjustedFirstDayIndex }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...blanks, ...days];

  const durationText = formData.checkIn ? calculateDuration(formData.checkIn, formData.checkOut || formData.checkIn) : null;

  return (
    <section id="calendario" className="py-14 sm:py-20 lg:py-28 bg-[#fcfbf7] border-t border-stone-100">
      {/* Scroll anchor for Navbar contact button */}
      <div id="contacto" className="scroll-mt-24" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">
            Disponibilidad & Reservas
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927] mb-3 sm:mb-4">
            Elegí tu fecha y reservá tu estadía
          </h2>
          <p className="text-stone-600 leading-relaxed text-xs sm:text-base">
            Consultá las fechas disponibles en el calendario y completá tus datos en el formulario. Ambas vistas están sincronizadas en tiempo real para coordinar tu reserva de forma inmediata por WhatsApp.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= COLUMN 1: INTERACTIVE CALENDAR (5 or 6 cols on lg) ================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-7 rounded-2xl border border-stone-200/80 shadow-md">
              
              {/* Calendar Month Header & Toggles */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#384e3a]/10 text-[#384e3a]">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2a2927]">
                      {monthNames[month]} <span className="text-stone-400 font-sans font-normal">{year}</span>
                    </h3>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Temporada 2026/2027 activa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevMonth}
                    disabled={year === 2026 && month === 8}
                    className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition-all cursor-pointer"
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of week labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                  <span key={d} className="text-[11px] font-bold text-stone-400 uppercase tracking-wider py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-6">
                {allDays.map((dayNum, i) => {
                  if (dayNum === null) {
                    return <div key={`blank-${i}`} className="aspect-square" />;
                  }

                  const status = getDateStatus(dayNum);
                  
                  let btnClass = "w-full aspect-square flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 relative cursor-pointer ";
                  let indicator = null;

                  if (status === "booked") {
                    btnClass += "bg-[#fbebeb] text-stone-300 line-through cursor-not-allowed rounded-lg";
                    indicator = <span className="text-[8px] absolute bottom-1 text-red-400 font-bold">✕</span>;
                  } else if (status === "selected-single") {
                    btnClass += "bg-[#384e3a] text-white rounded-xl shadow-md ring-2 ring-[#c28c5f]/40 scale-105 z-10 font-bold";
                  } else if (status === "start") {
                    btnClass += "bg-[#384e3a] text-white rounded-l-xl rounded-r-none shadow-sm z-10 font-bold";
                  } else if (status === "end") {
                    btnClass += "bg-[#384e3a] text-white rounded-r-xl rounded-l-none shadow-sm z-10 font-bold";
                  } else if (status === "range") {
                    btnClass += "bg-[#384e3a]/15 text-[#384e3a] rounded-none hover:bg-[#384e3a]/25 border-y border-dashed border-[#384e3a]/30 font-semibold";
                  } else {
                    btnClass += "bg-[#fcfbf7] hover:bg-[#384e3a]/10 hover:text-[#384e3a] text-stone-700 border border-stone-100 hover:border-[#384e3a]/20 rounded-lg";
                  }

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => handleDateClick(dayNum)}
                      disabled={status === "booked"}
                      className={btnClass}
                    >
                      <span>{dayNum}</span>
                      {indicator}
                    </button>
                  );
                })}
              </div>

              {/* Status or Error Banner */}
              {calendarError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-100 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{calendarError}</span>
                </div>
              )}

              {/* Selected Dates Summary Badge in Calendar */}
              {formData.checkIn ? (
                <div className="bg-[#f4f6f3] p-4 rounded-xl border border-[#384e3a]/15 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#384e3a]">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{durationText}</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Del <strong>{formatFriendlyDate(formData.checkIn)}</strong> al <strong>{formatFriendlyDate(formData.checkOut || formData.checkIn)}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearDates}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
                    title="Limpiar fechas"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl text-center text-xs text-stone-500 flex items-center justify-center gap-2 border border-stone-100">
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  <span>Hacé clic en los días para seleccionar tu ingreso y egreso.</span>
                </div>
              )}

              {/* Calendar Visual Legend */}
              <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#fcfbf7] border border-stone-300" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#fbebeb] border border-red-200 text-red-500 font-bold text-[8px] flex items-center justify-center">✕</span>
                  <span>Reservado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#384e3a]" />
                  <span className="font-semibold text-stone-700">Tu selección</span>
                </div>
              </div>

            </div>

            {/* Practical Quick Info Tip */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-stone-100 flex items-start gap-3 text-xs text-stone-600">
              <span className="p-1.5 rounded-lg bg-[#c28c5f]/15 text-[#c28c5f] shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <strong className="text-stone-800">Alquiler versátil:</strong> Podés reservar tanto por el día (asados, festejos de 1 jornada) como por varios días y noches de descanso rural.
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: RESERVATION & CONTACT FORM (6 or 7 cols on lg) ================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-stone-200/80 shadow-md">
              
              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="reservation-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#2a2927]">
                          Formulario de Reserva
                        </h3>
                        <p className="text-xs text-stone-500">
                          Respuesta personalizada en menos de 24 horas.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[11px] font-semibold">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Vía WhatsApp</span>
                      </div>
                    </div>

                    {/* Sync Indicator Banner */}
                    {formData.checkIn ? (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Fechas vinculadas: <strong>{formatFriendlyDate(formData.checkIn)}</strong> al <strong>{formatFriendlyDate(formData.checkOut || formData.checkIn)}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={clearDates}
                          className="text-stone-400 hover:text-stone-700 underline font-semibold text-[11px] cursor-pointer"
                        >
                          Cambiar
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Hacé clic en el calendario de la izquierda para seleccionar tus fechas.</span>
                      </div>
                    )}

                    {/* Name and Phone Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-400" /> Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Ej: Estela Fernández"
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                            errors.fullName ? "border-red-300 ring-1 ring-red-200" : "border-stone-200"
                          }`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-500 font-medium">{errors.fullName}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" /> WhatsApp o Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ej: 0221 604-5678"
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all ${
                            errors.phone ? "border-red-300 ring-1 ring-red-200" : "border-stone-200"
                          }`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Stay Type (Segmented control) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-stone-400" /> Tipo de Estadía
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, stayType: "escapada" }))}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                            formData.stayType === "escapada"
                              ? "bg-[#384e3a] text-white border-[#384e3a] shadow-sm"
                              : "bg-[#fcfbf7] text-stone-700 border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          <span>Escapada / Descanso</span>
                          <span className={`text-[10px] ${formData.stayType === "escapada" ? "text-stone-200" : "text-stone-400"}`}>
                            1 o más noches
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, stayType: "evento" }))}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                            formData.stayType === "evento"
                              ? "bg-[#384e3a] text-white border-[#384e3a] shadow-sm"
                              : "bg-[#fcfbf7] text-stone-700 border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          <span>Evento Familiar</span>
                          <span className={`text-[10px] ${formData.stayType === "evento" ? "text-stone-200" : "text-stone-400"}`}>
                            Jornada / Asado
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Guests Stepper Counter */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-stone-400" /> Cantidad de Personas
                        </label>
                        <span className="text-[11px] text-stone-500">
                          (Capacidad máx: 20 personas)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-[#fcfbf7] border border-stone-200 rounded-xl p-2 px-4">
                        <span className="text-sm font-semibold text-stone-800">
                          {formData.guestsCount} {formData.guestsCount === 1 ? "persona" : "personas"}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleGuestCountChange(-1)}
                            disabled={formData.guestsCount <= 1}
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 font-bold text-stone-700 transition-colors flex items-center justify-center text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#384e3a]">
                            {formData.guestsCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGuestCountChange(1)}
                            disabled={formData.guestsCount >= 20}
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 font-bold text-stone-700 transition-colors flex items-center justify-center text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Message or Special Request */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-stone-400" /> Mensaje o Consulta Adicional (Opcional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Contanos si traen mascotas, horario estimado de llegada, o consultas particulares..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fcfbf7] text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#384e3a]/20 focus:border-[#384e3a] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Conectando con WhatsApp...</span>
                      ) : (
                        <>
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.706 1.457h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          <span>Enviar Consulta por WhatsApp</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-stone-400">
                      🔒 No cobramos comisión por adelantado en la web. Coordinación directa con los dueños.
                    </p>
                  </motion.form>
                ) : (
                  /* Success Confirmation Screen */
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-5"
                  >
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl font-bold text-[#2a2927]">
                        ¡Consulta Lista para Enviar!
                      </h4>
                      <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                        Se abrió una pestaña directa de WhatsApp hacia <strong>0221 604-5678</strong> con el detalle completo de tu estadía.
                      </p>
                    </div>

                    {/* Summary box */}
                    <div className="bg-[#f4f6f3] p-4 rounded-xl text-left text-xs space-y-2 border border-stone-200/70 max-w-md mx-auto">
                      <div className="flex justify-between pb-2 border-b border-stone-200">
                        <span className="text-stone-500">Huésped:</span>
                        <span className="font-bold text-stone-800">{submittedData?.fullName}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-stone-200">
                        <span className="text-stone-500">Período:</span>
                        <span className="font-bold text-[#384e3a]">
                          {formatFriendlyDate(submittedData?.checkIn || "")} al {formatFriendlyDate(submittedData?.checkOut || "")}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-stone-200">
                        <span className="text-stone-500">Personas:</span>
                        <span className="font-bold text-stone-800">{submittedData?.guestsCount} invitados</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Modalidad:</span>
                        <span className="font-bold text-stone-800">
                          {submittedData?.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <a
                        href={`https://api.whatsapp.com/send?phone=5492216045678&text=${encodeURIComponent(
                          `¡Hola El campo de Domingo! Me gustaría consultar por una estadía.\n\n*Nombre:* ${submittedData?.fullName}\n*Teléfono:* ${submittedData?.phone}\n*Ingreso:* ${formatFriendlyDate(submittedData?.checkIn || "")}\n*Salida:* ${formatFriendlyDate(submittedData?.checkOut || "")}\n*Tipo de estadía:* ${submittedData?.stayType === "escapada" ? "Escapada / Descanso" : "Evento Familiar / Festejo"}\n*Cantidad de personas:* ${submittedData?.guestsCount}${submittedData?.message ? `\n*Mensaje:* ${submittedData?.message}` : ""}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.706 1.457h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Reabrir WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSubmittedData(null);
                        }}
                        className="w-full sm:w-auto px-5 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        Hacer otra consulta
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
