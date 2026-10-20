/**
 * Ganti nilai pada berkas ini untuk menyesuaikan undangan dengan acara Anda.
 * Nomor WhatsApp menggunakan kode negara tanpa tanda +, spasi, atau tanda baca.
 */
export const invitation = {
  partnerOne: "Alya",
  partnerTwo: "Bima",
  dateIso: "2026-12-31",
  dateLabel: "Kamis, 31 Desember 2026",
  dateShort: "31.12.26",
  city: "Bali",
  venue: "The Glass House, Bali",
  address: "Bali, Indonesia",
  mapQuery: "The Glass House Bali",
  akad: { time: "15.00–16.00 WITA", start: "150000", end: "160000" },
  reception: { time: "17.00 WITA–selesai", start: "170000", end: "230000" },
  rsvpDeadline: "1 Desember 2026",
  /** Isi nomor ini untuk mengaktifkan RSVP lewat WhatsApp. */
  rsvpWhatsApp: "",
  /** Foto sampul dan galeri dapat diganti dengan tautan foto milik Anda. */
  coverPhoto:
    "https://images.unsplash.com/photo-1607357910286-1ff94ac13c24?auto=format&fit=crop&w=1800&q=85",
  gallery: [
    { id: "1519741497674-611481863552", alt: "Pasangan pengantin dengan buket bunga", credit: "Nathan Dumlao" },
    { id: "1606216794079-73f85bbd57d5", alt: "Pengantin dengan gaun putih", credit: "Jakob Owens" },
    { id: "1465495976277-4387d4b0b4c6", alt: "Pasangan bergandengan tangan di hari pernikahan", credit: "Drew Coffman" },
    { id: "1591700331354-f7eea65d1ce8", alt: "Buket bunga dan tangan yang saling menggenggam", credit: "Sinitta Leunen" },
  ],
} as const;

export const coupleName = `${invitation.partnerOne} & ${invitation.partnerTwo}`;
