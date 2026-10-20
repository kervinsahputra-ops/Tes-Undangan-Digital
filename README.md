# Website Undangan Digital

Website undangan pernikahan yang responsif untuk ponsel dan desktop. Dibuat dengan React, TypeScript, Vite, dan Tailwind CSS.

## Menyesuaikan undangan

Edit `src/invitation.ts` sebelum menerbitkan website (judul dan deskripsi halaman ada di `index.html`):

- Ganti nama pasangan, tanggal, kota, tempat, alamat peta, dan jadwal acara.
- Ganti foto sampul dan foto galeri dengan foto yang boleh dipublikasikan.
- Isi `rsvpWhatsApp` dengan nomor WhatsApp tuan rumah. Pakai kode negara, tanpa tanda `+` atau spasi, misalnya `6281234567890`.

> Nilai awal seperti nama Alya & Bima dan The Glass House adalah contoh dari template. Pastikan semua informasi acara sudah diganti dan benar.

## Tautan khusus untuk tamu

Nama tamu bisa ditampilkan dari parameter `to` pada URL:

```text
https://alamat-website-anda/?to=Ibu%20Siti
```

Spasi dan karakter khusus perlu di-encode pada URL. Saat pengunjung membuka tautan, nama tersebut tampil di sampul dan halaman undangan.

## Menjalankan di komputer

Pasang Node.js 20.19+ atau 22.12+, lalu jalankan:

```bash
pnpm install
pnpm dev
```

Untuk membuat berkas website siap unggah:

```bash
pnpm build
```

Folder hasilnya adalah `dist/`. Unggah isi folder tersebut ke layanan hosting website statis seperti Netlify, Vercel, atau Cloudflare Pages. Karena undangan ini berupa website statis, tautan langsung dan parameter `?to=` tidak memerlukan server aplikasi.

## Konfirmasi kehadiran

Setelah `rsvpWhatsApp` diisi, formulir akan membuka WhatsApp dengan pesan konfirmasi yang sudah disusun untuk dikirim oleh tamu. Jawaban tidak disimpan dalam basis data website. Untuk rekap RSVP otomatis, sambungkan formulir ke layanan backend atau database sebelum acara.
