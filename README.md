# AHP Decision Support System - Pemilihan Lokasi Gudang

Sistem Pendukung Keputusan berbasis web untuk pemilihan lokasi gudang menggunakan metode **Analytical Hierarchy Process (AHP)**.
haqest
## 🎯 Fitur Utama

- **Manajemen Kriteria & Alternatif**: Tambah, edit, dan hapus kriteria dan alternatif secara dinamis
- **Matriks Perbandingan Interaktif**: Input perbandingan berpasangan dengan validasi real-time
- **Perhitungan AHP Lengkap**: Implementasi algoritma eigenvalue dan eigenvector
- **Uji Konsistensi**: Pengecekan otomatis Consistency Ratio (CR ≤ 0.1)
- **Visualisasi Chart**: Pie chart untuk bobot kriteria dan bar chart untuk skor alternatif
- **Responsive Design**: Tampilan yang optimal di desktop, tablet, dan mobile
- **Data Default**: Studi kasus pemilihan lokasi gudang dengan data real

## 🏗️ Struktur Project

Project ini telah direorganisasi mengikuti praktik pengembangan web standar dengan struktur yang bersih dan mudah dipelihara.

```
dss/
├── index.html              # Original HTML file (legacy)
├── index-new.html          # New organized HTML file
├── test.html               # Original test file (legacy)
├── test-new.html           # New organized test file
├── README.md               # Project documentation
├── css/                    # Legacy CSS files
│   ├── inline.css
│   ├── modern-luxury.css
│   ├── style.css
│   └── test.css
├── js/                     # Legacy JavaScript files
│   ├── ahp.js
│   ├── script.js
│   └── test.js
├── src/                    # New organized source code
│   ├── assets/
│   │   ├── css/           # Organized CSS files
│   │   │   ├── variables.css      # CSS custom properties
│   │   │   ├── base.css           # Base styles
│   │   │   ├── animations.css     # Animation styles
│   │   │   ├── layout.css         # Layout styles
│   │   │   ├── components.css     # Component styles
│   │   │   ├── buttons.css        # Button styles
│   │   │   ├── luxury-buttons.css # Luxury button styles
│   │   │   ├── inputs.css         # Input styles
│   │   │   ├── tables.css         # Table styles
│   │   │   ├── matrices.css       # Matrix styles
│   │   │   ├── messages.css       # Message styles
│   │   │   ├── progress.css       # Progress bar styles
│   │   │   ├── navigation.css     # Navigation styles
│   │   │   ├── features.css       # Feature section styles
│   │   │   ├── footer.css         # Footer styles
│   │   │   ├── loader.css         # Loading spinner styles
│   │   │   ├── utils.css          # Utility classes
│   │   │   ├── main.css           # Main application styles
│   │   │   └── test.css           # Test page styles
│   │   └── js/            # Organized JavaScript files
│   │       ├── ahp-calculator.js  # AHP calculation logic
│   │       ├── ui-controller.js   # UI control logic
│   │       └── test.js            # Test functions
│   ├── components/        # Reusable components (future use)
│   │   ├── forms/
│   │   └── ui/
│   └── pages/             # Page-specific components (future use)
│       ├── dashboard/
│       └── results/
├── docs/                  # Documentation
└── tests/                 # Test files
```

## 🚀 Cara Penggunaan

### 1. Setup
- Buka `index-new.html` di web browser modern (untuk versi terbaru)
- Atau buka `index.html` untuk versi legacy
- Pastikan koneksi internet untuk loading CDN libraries (Tailwind CSS, Chart.js, Font Awesome)

### 2. Mengelola Kriteria dan Alternatif
- **Tambah Kriteria**: Masukkan nama kriteria baru dan klik tombol "+"
- **Edit Kriteria**: Klik pada nama kriteria untuk mengedit
- **Hapus Kriteria**: Klik ikon "×" di samping kriteria (minimal 2 kriteria)
- **Alternatif**: Sama seperti kriteria, kelola di panel sebelah kanan

### 3. Input Matriks Perbandingan
- **Matriks Kriteria**: Bandingkan setiap pasang kriteria menggunakan skala 1-9
- **Matriks Alternatif**: Bandingkan alternatif untuk setiap kriteria
- **Auto-calculation**: Nilai reciprocal dihitung otomatis (jika A vs B = 3, maka B vs A = 1/3)

### 4. Load Data Default
- Klik tombol "Muat Data Default" untuk menggunakan studi kasus
- Data berisi 5 kriteria dan 3 alternatif lokasi gudang

### 5. Proses Perhitungan
- Klik "Proses Perhitungan AHP" setelah semua matriks terisi
- Sistem akan menampilkan:
  - Bobot kriteria dengan visualisasi
  - Ranking alternatif dengan skor
  - Hasil uji konsistensi

## 📊 Studi Kasus Default

**Objektif**: Memilih lokasi gudang terbaik untuk perusahaan ekspedisi

**Kriteria**:
1. Jarak (dari pusat distribusi)
2. Biaya (sewa/pembelian)
3. Fasilitas (keamanan, akses)
4. Posisi Geografis (strategis)
5. Luas Gudang (kapasitas)

**Alternatif**:
1. Safe'n Lock
2. Rungkut Industri  
3. SPILL

## 🔬 Metodologi AHP

### Skala Perbandingan Saaty
- **1**: Sama penting
- **3**: Sedikit lebih penting
- **5**: Lebih penting
- **7**: Sangat penting
- **9**: Mutlak lebih penting
- **2,4,6,8**: Nilai tengah

### Langkah Perhitungan
1. **Normalisasi Matriks**: Setiap elemen dibagi dengan jumlah kolom
2. **Eigenvalue Calculation**: Menggunakan power method untuk iterasi
3. **Consistency Check**: CR = CI/RI, dimana CI = (λmax-n)/(n-1)
4. **Final Scoring**: Kombinasi bobot kriteria dan alternatif

### Kriteria Konsistensi
- **CR ≤ 0.1**: Konsisten (dapat diterima)
- **CR > 0.1**: Tidak konsisten (perlu revisi input)

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Charts**: Chart.js untuk visualisasi pie chart dan bar chart
- **Icons**: Font Awesome 6
- **Responsive**: CSS Grid dan Flexbox
- **Algorithm**: Power method untuk eigenvalue calculation

## 📱 Kompatibilitas Browser

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎨 Fitur UI/UX

- **Professional Design**: Clean, modern interface dengan color scheme yang konsisten
- **Interactive Elements**: Hover effects, smooth animations, button feedback
- **Real-time Validation**: Input validation dan error handling
- **Progress Indicators**: Visual feedback untuk status perhitungan
- **Mobile Responsive**: Optimal viewing pada semua ukuran layar
- **Accessibility**: Proper contrast ratios dan keyboard navigation

## 🔧 Customization

### Menambah Kriteria/Alternatif
- Sistem mendukung jumlah kriteria dan alternatif yang fleksibel
- Matriks akan di-generate ulang secara otomatis

### Mengubah Skala Perbandingan
- Edit nilai min/max pada input number di fungsi `renderCriteriaMatrix()`
- Sesuaikan validasi di `validateData()`

### Custom Styling
- Modifikasi file CSS untuk mengubah tema warna
- Gunakan CSS custom properties untuk konsistensi

## 📈 Contoh Output

Setelah perhitungan, sistem akan menampilkan:

```
Bobot Kriteria:
- Biaya: 35.2% (0.352)
- Luas Gudang: 28.1% (0.281)
- Fasilitas: 15.3% (0.153)
- Posisi Geografis: 12.8% (0.128)
- Jarak: 8.6% (0.086)

Ranking Alternatif:
1. SPILL: 45.7% (0.457)
2. Rungkut Industri: 32.1% (0.321)  
3. Safe'n Lock: 22.2% (0.222)

Konsistensi: CR = 0.08 ✅ (Konsisten)
```

## 🗄️ Organisasi File

### File CSS
- **variables.css**: CSS custom properties dan variabel
- **base.css**: Base styles, resets, dan typography
- **animations.css**: CSS animations dan transitions
- **layout.css**: Layout-specific styles (grid, flexbox)
- **components.css**: Reusable component styles
- **buttons.css**: Standard button styles
- **luxury-buttons.css**: Premium button designs
- **inputs.css**: Form input styles
- **tables.css**: Table styling
- **matrices.css**: AHP matrix-specific styles
- **messages.css**: Message dan notification styles
- **progress.css**: Progress bar dan indicator styles
- **navigation.css**: Navigation menu styles
- **features.css**: Feature section styles
- **footer.css**: Footer component styles
- **loader.css**: Loading animation styles
- **utils.css**: Utility classes dan helpers
- **main.css**: Main application styles (sebelumnya style.css)

### File JavaScript
- **ahp-calculator.js**: Core AHP calculation logic dan algorithms
- **ui-controller.js**: User interface control dan interaction logic
- **test.js**: Test functions untuk AHP functionality

### File HTML
- **index-new.html**: Main application page dengan struktur terorganisir
- **test-new.html**: Test page dengan struktur terorganisir

## 🤝 Kontribusi

Untuk pengembangan lebih lanjut:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Submit pull request

## 📄 Lisensi

Project ini dibuat untuk tujuan edukasi dan dapat digunakan secara bebas dengan mencantumkan credit.

---

**© 2024 AHP Decision Support System** - Implementasi metode Analytical Hierarchy Process untuk pengambilan keputusan yang objektif dan terstruktur.
