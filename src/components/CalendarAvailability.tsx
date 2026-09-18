import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { INITIAL_BOOKED_DATES } from "../data";

// Helper to check if a date is booked
const isDateBooked = (dateStr: string) => {
  return INITIAL_BOOKED_DATES.includes(dateStr);
};

// Formatting date string
const formatDateString = (year: number, month: number, day: number) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

interface CalendarAvailabilityProps {
  onSelectDates: (checkIn: string, checkOut: string) => void;
}

export default function CalendarAvailability({ onSelectDates }: CalendarAvailabilityProps) {
  // Setup calendar starting at September 2026 (matching current time year 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get day of the week for first day (0 = Sunday, ..., 6 = Saturday)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6 for South American standard
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const prevMonth = () => {
    // Let's prevent going back before September 2026 to keep the demo consistent
    if (year === 2026 && month === 8) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    // Let's cap at 6 months in future
    if (year === 2027 && month === 3) return;
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDateStr = formatDateString(year, month, day);
    
    if (isDateBooked(clickedDateStr)) {
      setErrorMessage("La fecha seleccionada ya está reservada. Por favor, elegí un día disponible.");
      return;
    }

    setErrorMessage(null);

    // If no start date is selected, or both dates are selected, start new selection
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(clickedDateStr);
      setSelectedEnd(null);
    } else {
      // We have a start date, now setting end date
      const startObj = new Date(selectedStart);
      const endObj = new Date(clickedDateStr);

      if (endObj < startObj) {
        // If clicked date is earlier, make it the new start date
        setSelectedStart(clickedDateStr);
      } else {
        // Validate if there are booked dates in between
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
          setErrorMessage("La estadía no puede incluir días que ya están reservados en el medio.");
          setSelectedStart(clickedDateStr);
          setSelectedEnd(null);
        } else {
          setSelectedEnd(clickedDateStr);
        }
      }
    }
  };

  const handleApplySelection = () => {
    if (selectedStart) {
      const end = selectedEnd ? selectedEnd : selectedStart;
      onSelectDates(selectedStart, end);
      
      // Smooth scroll to contact form
      const element = document.getElementById("contacto");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const clearSelection = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setErrorMessage(null);
  };

  // Generate blank spaces for previous month's ending
  const blanks = Array(adjustedFirstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...blanks, ...days];

  // Helper to check if date is currently selected or in selection range
  const getDateStatus = (dayNum: number | null) => {
    if (dayNum === null) return "blank";
    
    const dateStr = formatDateString(year, month, dayNum);
    const isBooked = isDateBooked(dateStr);
    
    if (isBooked) return "booked";
    if (selectedStart === dateStr && !selectedEnd) return "start-only";
    if (selectedStart === dateStr) return "start";
    if (selectedEnd === dateStr) return "end";
    
    if (selectedStart && selectedEnd) {
      const startObj = new Date(selectedStart);
      const endObj = new Date(selectedEnd);
      const currentObj = new Date(dateStr);
      
      if (currentObj > startObj && currentObj < endObj) {
        return "range";
      }
    }
    
    return "available";
  };

  // Helper to format date nicely in Spanish for display
  const formatFriendlyDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <section id="calendario" className="pt-24 pb-8 bg-[#fcfbf7]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c28c5f] font-semibold block mb-2">Disponibilidad</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a2927] mb-6">
            Elegí tu fecha de escapada
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            Consultá nuestro calendario interactivo en tiempo real. Hacé clic en tu fecha de ingreso y de salida para verificar la disponibilidad e iniciar tu reserva directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Legend and Info - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#2a2927] mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#384e3a]" /> Leyenda de fechas
              </h3>
              
              <div className="space-y-4 text-sm text-stone-600">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-md bg-white border border-stone-200" />
                  <span>Disponible para reservar</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-md bg-[#ffebeb] border border-red-200 text-red-500 font-bold flex items-center justify-center text-[10px]">✕</span>
                  <span className="font-medium text-stone-800">Reservado / No Disponible</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-md bg-[#384e3a]" />
                  <span className="font-medium text-stone-800">Tus fechas seleccionadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-md bg-[#384e3a]/15 border border-[#384e3a]/30" />
                  <span>Rango de tu estadía</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100">
                <p className="text-xs text-stone-500 leading-relaxed italic">
                  💡 <strong>Tip camperto:</strong> Podés alquilar tanto por el día (para pasar una jornada de evento o asado) como por varios días/noches de descanso rural.
                </p>
              </div>
            </div>

            {/* Selection Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-[#2a2927] mb-4">Tu Estadía</h3>
              
              {!selectedStart ? (
                <div className="text-center py-6 text-stone-400">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-stone-300 stroke-[1.5]" />
                  <p className="text-sm">Seleccioná días en el calendario para calcular tu estadía.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#f4f6f3] p-4 rounded-xl border border-stone-100">
                    <div className="grid grid-cols-2 gap-4 text-center divide-x divide-stone-200">
                      <div>
                        <span className="text-[10px] uppercase text-stone-400 font-semibold block mb-1">Ingreso</span>
                        <span className="text-sm font-bold text-[#384e3a]">{formatFriendlyDate(selectedStart)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-stone-400 font-semibold block mb-1">Salida</span>
                        <span className="text-sm font-bold text-[#384e3a]">
                          {selectedEnd ? formatFriendlyDate(selectedEnd) : formatFriendlyDate(selectedStart)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2 border border-red-100">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-start gap-2 border border-emerald-100">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>¡Perfecto! El rango seleccionado se encuentra disponible para consultar.</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleApplySelection}
                      disabled={!!errorMessage}
                      className="flex-1 py-2.5 bg-[#384e3a] hover:bg-[#4c664e] disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                    >
                      Reservar estas fechas
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-500 rounded-lg text-xs transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actual Interactive Calendar Grid - 8 Columns */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-100 shadow-sm">
            {/* Header / Month toggles */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#384e3a]" />
                <h3 className="font-serif text-xl font-bold text-[#2a2927]">
                  {monthNames[month]} <span className="text-stone-400 font-sans font-normal">{year}</span>
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  disabled={year === 2026 && month === 8}
                  className="p-2 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-500 transition-all"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Days grid */}
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {["Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <span key={d} className="text-xs font-bold text-stone-400 uppercase tracking-wider py-1">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {allDays.map((dayNum, i) => {
                if (dayNum === null) {
                  return <div key={`blank-${i}`} className="aspect-square" />;
                }

                const status = getDateStatus(dayNum);
                
                let btnClass = "w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 relative cursor-pointer ";
                let indicator = null;

                if (status === "booked") {
                  btnClass += "bg-[#fbebeb] text-stone-400 line-through cursor-not-allowed";
                  indicator = <span className="text-[9px] absolute bottom-1 text-red-400 font-bold">✕</span>;
                } else if (status === "start-only") {
                  btnClass += "bg-[#384e3a] text-white shadow-md ring-2 ring-[#c28c5f]/30 scale-105 z-10";
                } else if (status === "start") {
                  btnClass += "bg-[#384e3a] text-white rounded-r-none shadow-sm z-10";
                } else if (status === "end") {
                  btnClass += "bg-[#384e3a] text-white rounded-l-none shadow-sm z-10";
                } else if (status === "range") {
                  btnClass += "bg-[#384e3a]/15 text-[#384e3a] rounded-none hover:bg-[#384e3a]/25 border-y border-dashed border-[#384e3a]/30";
                } else {
                  // Available
                  btnClass += "bg-[#fcfbf7] hover:bg-[#384e3a]/10 hover:text-[#384e3a] text-stone-800 border border-stone-100 hover:border-[#384e3a]/20";
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

            {/* Availability message footer */}
            <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <p>📅 Hacé clic en los días para seleccionar el rango deseado de reserva.</p>
              <span className="font-semibold text-[#384e3a] bg-[#f4f6f3] px-3 py-1 rounded-full">
                Temporada 2026/2027 activa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
