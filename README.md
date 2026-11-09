# Eva Baktir Frozen Foods - Landing Page

Website statis satu halaman (HTML + CSS + JavaScript murni, tanpa build step).

## Struktur
```
index.html
style.css
script.js        <- data produk, pesan WhatsApp, nomor sertifikat halal
images/          <- salin 11 foto produk ke sini
assets/Produk_Frozen_Foods.pdf   <- katalog PDF
```

Nama file foto yang dipakai: roti-maryam-coklat.jpg, roti-maryam-keju.jpg, roti-maryam-pandan.jpg,
roti-maryam-original.jpg, sambosa-daging-cabe-hijau.jpg, sambosa-smoked-beef-keju.jpg,
sambosa-pisang-coklat.jpg, mamol-coklat.jpg, kebab-mini.jpg, donat-kentang.jpg, roti-goreng.jpg.
Jika foto belum ada, halaman menampilkan kotak krem berisi nama produk.

## Mengubah isi
- Nomor sertifikat halal: konstanta `HALAL_CERT_NUMBER` di script.js.
- Data produk dan langkah penyajian: `PRODUCTS`, `STEPS_TEFLON`, `STEPS_GORENG` di script.js.

## Membuka secara lokal
Cara cepat: klik dua kali `index.html`.
Cara yang disarankan (agar persis seperti di hosting), dari folder ini jalankan:
```
python3 -m http.server 8000
```
lalu buka http://localhost:8000

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub (misal `eva-baktir`).
2. Unggah semua file dan folder ini (lewat "Add file > Upload files" atau `git push`).
3. Di repository: Settings > Pages > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`, Save.
4. Tunggu 1-2 menit, website aktif di `https://<username>.github.io/eva-baktir/`.

## Deploy ke Netlify
Buka app.netlify.com/drop lalu seret folder ini ke halaman tersebut.
