export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: "exterior" | "interior" | "pileta" | "eventos";
}

export interface Amenity {
  name: string;
  description?: string;
  icon: string; // Lucide icon name
  category: "instalaciones" | "exteriores" | "dormitorios" | "comodidades";
}

export interface InquiryFormData {
  fullName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  stayType: "escapada" | "evento" | "otro";
  guestsCount: number;
  message: string;
}
