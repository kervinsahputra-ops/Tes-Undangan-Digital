# undangan-digital

Website undangan pernikahan (React 19 + TypeScript + Vite + Tailwind CSS v4).

## Struktur

- `src/invitation.ts` - semua data acara (nama, tanggal, tempat, jadwal, foto, nomor WhatsApp RSVP)
- `src/App.tsx` - komponen utama dan seluruh halaman undangan
- `src/index.css` - CSS global dan import Tailwind (`@import "tailwindcss";`)
- `src/main.tsx` - entrypoint React
- `index.html` - shell HTML, judul, dan meta tag (edit langsung di sini)
- `vite.config.ts` - konfigurasi Vite (React, Tailwind, alias `@` ke `src`)

## Perintah

- `pnpm dev` - jalankan server pengembangan
- `pnpm build` - build ke `dist/`
- `pnpm preview` - pratinjau hasil build
- `pnpm typecheck` - cek tipe TypeScript

## Catatan kode

- Tailwind v4 lewat plugin `@tailwindcss/vite`; tidak perlu `tailwind.config` atau PostCSS.
- Gunakan tanda kutip ganda untuk string yang mengandung apostrof.
- Komponen diekspor sebagai default export.
