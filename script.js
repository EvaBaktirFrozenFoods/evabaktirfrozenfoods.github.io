/* =========================================================
   Eva Baktir Frozen Foods - script.js
   ========================================================= */
'use strict';

/* ---------- Sertifikat halal ----------
   Sudah dikonfirmasi pemilik (9 Nov 2026). Ubah di sini jika nomor berganti. */
const HALAL_CERT_NUMBER = 'ID32110007643580723';

/* ---------- WhatsApp ---------- */
const WA_NUMBER = '6282113392581';
const WA_MESSAGES = {
  order: 'Halo Eva Baktir Frozen Foods, saya ingin memesan produk. Boleh minta info produk yang tersedia?',
  reseller: 'Halo Eva Baktir Frozen Foods, saya tertarik menjadi reseller. Boleh minta info harga reseller dan sampelnya?',
  cafe: 'Halo Eva Baktir Frozen Foods, saya dari [nama kafe] dan tertarik bekerja sama sebagai pemasok camilan. Boleh minta info dan sampelnya?'
};

function waLink(key) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MESSAGES[key]);
}

/* ---------- Data produk (urutan = urutan tampil di halaman) ----------
   serving: array langkah penyajian (tampil sebagai daftar bernomor).
   serving: null  -> tampilkan teks sementara (belum ada petunjuk resmi). */
// Langkah penyajian bersama
const STEPS_TEFLON = [
  'Keluarkan dari freezer.',
  'Biarkan sampai lunak.',
  'Panaskan di teflon dengan api kecil.',
  'Bolak-balik sekitar 5 menit.'
];
const STEPS_GORENG = [
  'Keluarkan dari freezer.',
  'Panaskan minyak dengan api kecil.',
  'Goreng hingga kecoklatan.'
];

const PRODUCTS = [
  {
    name: 'Roti Maryam',
    variants: ['Coklat', 'Keju', 'Pandan', 'Original'],
    pack: 'Isi 5 pcs / pack',
    taste: 'Manis dan gurih',
    images: [
      { file: 'images/roti-maryam-coklat.jpg', alt: 'Roti Maryam rasa coklat' },
      { file: 'images/roti-maryam-keju.jpg', alt: 'Roti Maryam rasa keju' },
      { file: 'images/roti-maryam-pandan.jpg', alt: 'Roti Maryam rasa pandan' },
      { file: 'images/roti-maryam-original.jpg', alt: 'Roti Maryam original' }
    ],
    serving: STEPS_TEFLON
  },
  {
    name: 'Sambosa',
    variants: ['Daging Cabe Hijau', 'Smoked Beef Keju', 'Pisang Coklat'],
    pack: 'Isi 10 pcs / pack',
    taste: 'Gurih dan manis',
    images: [
      { file: 'images/sambosa-daging-cabe-hijau.jpg', alt: 'Sambosa daging cabe hijau' },
      { file: 'images/sambosa-smoked-beef-keju.jpg', alt: 'Sambosa smoked beef keju' },
      { file: 'images/sambosa-pisang-coklat.jpg', alt: 'Sambosa pisang coklat' }
    ],
    serving: STEPS_GORENG.concat(['Sajikan dengan saus atau sambal.'])
  },
  {
    name: 'Mamol',
    variants: ['Coklat'],
    pack: 'Isi 10 pcs / pack',
    taste: 'Manis',
    images: [
      { file: 'images/mamol-coklat.jpg', alt: 'Mamol coklat' }
    ],
    serving: STEPS_GORENG
  },
  {
    name: 'Kebab Mini',
    variants: ['Ori', 'Pedas', 'Pedas Keju'],
    pack: 'Isi 10 pcs / pack',
    taste: 'Gurih',
    images: [
      { file: 'images/kebab-mini.jpg', alt: 'Kebab mini frozen' }
    ],
    imageCaption: 'Varian yang tersedia: Ori, Pedas, Pedas Keju.',
    serving: STEPS_TEFLON
  },
  {
    name: 'Donat Kentang',
    variants: ['Original (bertabur gula)'],
    pack: 'Isi 8 pcs / pack',
    taste: 'Manis',
    images: [
      { file: 'images/donat-kentang.jpg', alt: 'Donat kentang bertabur gula' }
    ],
    serving: STEPS_GORENG
  },
  {
    name: 'Roti Goreng',
    variants: ['Coklat', 'Coklat Keju'],
    pack: 'Isi 8 pcs / pack',
    taste: 'Manis',
    images: [
      { file: 'images/roti-goreng.jpg', alt: 'Roti goreng isi coklat' }
    ],
    imageCaption: 'Varian yang tersedia: Coklat, Coklat Keju.',
    serving: STEPS_GORENG
  }
];

const SERVING_PENDING = 'Petunjuk penyajian sedang kami lengkapi. Tanyakan langsung kepada kami via WhatsApp.';

/* ---------- Util ---------- */
function esc(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Ganti gambar yang gagal dimuat dengan placeholder krem berisi nama produk. */
function makePlaceholder(name, alt) {
  const div = document.createElement('div');
  div.className = 'img-placeholder';
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label', alt || name);
  div.innerHTML = '<strong>' + esc(name) + '</strong><small>Foto segera hadir</small>';
  return div;
}

function guardImage(img, name) {
  const fail = function () { img.replaceWith(makePlaceholder(name, img.alt)); };
  img.addEventListener('error', fail, { once: true });
  // Untuk gambar yang sudah selesai (gagal) dimuat sebelum skrip berjalan
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
}

/* ---------- Render kartu produk ---------- */
const ICON_CHEVRON_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
const ICON_CHEVRON_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const ICON_CHEVRON_D = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const ICON_BOX = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/></svg>';

function imgTag(image) {
  return '<img src="' + esc(image.file) + '" alt="' + esc(image.alt) + '" loading="lazy" decoding="async" width="800" height="600">';
}

function mediaHTML(p, idx) {
  if (p.images.length === 1) {
    return '<div class="product-media">' + imgTag(p.images[0]) + '</div>';
  }
  const slides = p.images.map(function (image, i) {
    return '<div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' dari ' + p.images.length + '">' + imgTag(image) + '</div>';
  }).join('');
  const dots = p.images.map(function (image, i) {
    return '<button type="button" class="carousel-dot" data-index="' + i + '" aria-label="Tampilkan foto ' + esc(image.alt) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>';
  }).join('');
  return (
    '<div class="product-media carousel" aria-roledescription="carousel" aria-label="Foto ' + esc(p.name) + '">' +
      '<div class="carousel-track" tabindex="0" id="carousel-' + idx + '">' + slides + '</div>' +
      '<button type="button" class="carousel-btn" data-dir="prev" aria-controls="carousel-' + idx + '" aria-label="Foto sebelumnya">' + ICON_CHEVRON_L + '</button>' +
      '<button type="button" class="carousel-btn" data-dir="next" aria-controls="carousel-' + idx + '" aria-label="Foto berikutnya">' + ICON_CHEVRON_R + '</button>' +
      '<span class="carousel-count" aria-live="polite">1/' + p.images.length + '</span>' +
      '<div class="carousel-dots">' + dots + '</div>' +
    '</div>'
  );
}

function productHTML(p, idx) {
  const variants = p.variants.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('');
  const caption = p.imageCaption ? '<p class="image-caption">' + esc(p.imageCaption) + '</p>' : '';
  const serving = p.serving
    ? '<ol class="steps">' + p.serving.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol>'
    : '<p class="pending">' + esc(SERVING_PENDING) + '</p>';

  return (
    '<article class="product-card">' +
      mediaHTML(p, idx) +
      '<div class="product-body">' +
        '<div class="product-head"><h3>' + esc(p.name) + '</h3><span class="taste-tag">' + esc(p.taste) + '</span></div>' +
        caption +
        '<div><p class="product-label">Varian</p><ul class="variant-list">' + variants + '</ul></div>' +
        '<p class="pack">' + ICON_BOX + esc(p.pack) + '</p>' +
        '<details class="serving"><summary>Cara penyajian ' + ICON_CHEVRON_D + '</summary>' + serving + '</details>' +
      '</div>' +
    '</article>'
  );
}

function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const dots = Array.prototype.slice.call(root.querySelectorAll('.carousel-dot'));
  const count = root.querySelector('.carousel-count');
  const total = track.children.length;
  let current = 0;

  function update(i) {
    current = i;
    dots.forEach(function (d, j) {
      if (j === i) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    count.textContent = (i + 1) + '/' + total;
  }

  function go(i) {
    i = (i + total) % total;
    track.scrollTo({ left: i * track.clientWidth });
  }

  root.querySelector('[data-dir="prev"]').addEventListener('click', function () { go(current - 1); });
  root.querySelector('[data-dir="next"]').addEventListener('click', function () { go(current + 1); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () { go(Number(d.dataset.index)); });
  });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
  });

  let ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current && i >= 0 && i < total) update(i);
    });
  }, { passive: true });
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(productHTML).join('');

  // Pasang penangan gambar rusak per kartu
  grid.querySelectorAll('.product-card').forEach(function (card, i) {
    card.querySelectorAll('img').forEach(function (img) { guardImage(img, PRODUCTS[i].name); });
  });
  grid.querySelectorAll('.carousel').forEach(initCarousel);
}

/* ---------- Inisialisasi ---------- */
function init() {
  // Semua tombol WhatsApp: <a data-wa="order|reseller|cafe">
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    const key = a.getAttribute('data-wa');
    if (WA_MESSAGES[key]) a.href = waLink(key);
  });

  // Nomor sertifikat halal
  document.querySelectorAll('[data-halal-number]').forEach(function (el) {
    el.textContent = HALAL_CERT_NUMBER;
  });

  // Foto hero (dan gambar statis lain yang punya data-placeholder)
  document.querySelectorAll('img[data-placeholder]').forEach(function (img) {
    guardImage(img, img.getAttribute('data-placeholder'));
  });

  renderProducts();
}

init();
