# ☕ Kopiku - Platform E-Commerce Kopi Modern

[![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)](https://sequelize.org/)

**Kopiku** adalah platform e-commerce pemesanan kopi modern berbasis web yang dirancang khusus untuk menghadirkan pengalaman belanja kopi yang mulus, interaktif, dan estetik. Aplikasi ini memisahkan bagian antarmuka pengguna (Frontend) dengan server pusat data (Backend) untuk menyajikan performa halaman yang cepat, aman, dan responsif bagi semua kalangan pencinta kopi.

Aplikasi ini menyederhanakan cara pelanggan menikmati kopi pilihan mereka—mulai dari proses pemilihan biji kopi atau minuman racikan, manajemen keranjang belanja, hingga pelacakan transaksi. Selain itu, platform ini juga dilengkapi dengan panel pengelolaan internal yang komprehensif bagi pemilik kedai kopi untuk mengawasi operasional bisnis.

---

## 🌟 Fitur Utama Aplikasi

### 🛒 Sisi Pelanggan (Customer Experience)
* **Beranda Interaktif (Landing Page)**: Halaman utama dinamis yang menampilkan menu kopi terpopuler, promosi terbaru, keunggulan layanan, serta testimoni ulasan pelanggan.
* **Katalog Kopi Cerdas**: Menu lengkap dengan fitur pencarian instan, penyaringan berdasarkan kategori kopi (seperti *Signature*, *Specialty*, *Espresso*, atau *Latte*), serta opsi pengurutan harga dan rating.
* **Detail Kopi Informatif**: Informasi lengkap mengenai profil rasa kopi, ketersediaan stok secara real-time, serta kolom ulasan pelanggan berskala rating bintang.
* **Sistem Favorit (Wishlist)**: Menyimpan daftar kopi incaran pelanggan ke dalam satu ruang khusus untuk dibeli kemudian hari.
* **Keranjang Belanja & Kupon Diskon**: Pengelolaan kuantitas item pesanan dengan sistem deteksi kupon otomatis untuk potongan harga instan.
* **Alur Checkout Ringkas**: Pengisian alamat pengiriman yang terintegrasi dengan perhitungan ringkasan biaya transaksi yang transparan.
* **Pelacakan Status Pesanan**: Kemudahan dalam melihat riwayat pembelian serta melacak perkembangan status pembuatan kopi (dari persiapan hingga selesai).

### 🛠️ Sisi Pengelola (Admin Dashboard)
* **Dashboard Statistik Real-Time**: Visualisasi data penjualan berupa grafik interaktif yang menyajikan performa pendapatan harian, volume pesanan, produk terpopuler, dan jumlah pengguna aktif.
* **Manajemen Katalog Menu**: Kontrol penuh untuk menambahkan menu kopi baru, memperbarui stok harian, mengedit harga, dan mengunggah foto kopi yang estetik.
* **Manajemen Pesanan Masuk**: Memproses seluruh antrean transaksi pelanggan dan memperbarui status pesanan agar proses pengiriman berjalan tepat waktu.
* **Manajemen Kupon Promo**: Membuat kode voucher potongan harga secara fleksibel guna meningkatkan retensi pelanggan.
* **Manajemen Pengguna**: Memantau basis data pelanggan terdaftar dan mengelola hak akses administrator kedai.

---

## 💻 Tech Stack (Teknologi yang Digunakan)

Aplikasi Kopiku dibangun menggunakan kombinasi teknologi modern untuk menjamin kestabilan dan kecepatan performa:

### 🎨 Frontend (Antarmuka Pengguna)
* **React 19 & Vite**: Framework modern untuk membangun antarmuka pengguna yang dinamis dengan performa rendering yang sangat cepat.
* **Tailwind CSS**: Framework styling utilitas untuk menciptakan tata letak web yang bersih, responsif, dan konsisten di berbagai ukuran layar.
* **Zustand**: Pustaka manajemen state global yang ringan untuk menangani data keranjang belanja dan status login secara efisien.
* **TanStack React Query v5**: Digunakan untuk mengelola sinkronisasi data dari server, melakukan caching data menu, serta mempercepat pemuatan halaman.
* **Chart.js & React Chartjs 2**: Menghasilkan grafik laporan bisnis yang interaktif pada halaman dashboard admin.
* **React Router DOM v7**: Mengatur navigasi antarhalaman dengan sistem proteksi keamanan (*Route Guarding*).

### ⚙️ Backend (Server & API)
* **Node.js & Express.js**: Menyediakan runtime server dan kerangka kerja API RESTful yang cepat untuk memproses setiap permintaan dari klien.
* **Sequelize ORM**: Abstraksi database untuk berinteraksi dengan tabel relasional menggunakan sintaks JavaScript yang bersih.
* **MySQL**: Mesin basis data relasional utama untuk menyimpan data katalog kopi, akun pengguna, pesanan, kupon, dan ulasan secara aman.
* **JSON Web Token (JWT) & Bcrypt**: Menjamin keamanan otentikasi akun pengguna melalui enkripsi kata sandi dan manajemen token sesi belanja.

---

## 📱 Keunggulan Desain & Pengalaman Pengguna (UX)

* **Estetika Kedai Kopi Modern**: Pemilihan palet warna hangat (nuansa cokelat kopi dan krem lembut) serta tipografi modern yang memanjakan mata.
* **Aksesibilitas Multi-Gawai**: Dioptimalkan secara penuh untuk dapat diakses dengan nyaman melalui perangkat smartphone Android/iOS, tablet, maupun komputer desktop.
* **Antarmuka Tanpa Hambatan**: Setiap aksi pengguna (menambahkan barang, memproses kupon, beralih halaman) disertai dengan notifikasi visual instan dan animasi mikro untuk kenyamanan ekstra.

---

## ☕ Tentang Kopiku
Kopiku hadir sebagai solusi digital komprehensif bagi industri kopi modern, mempertemukan kenyamanan memesan kopi secara online dengan keandalan manajemen kedai fisik. Kami terus berkomitmen mengembangkan fitur-fitur baru demi menghadirkan secangkir kebahagiaan langsung ke meja Anda.
