/* ==========================================================================
   PMII KUDUS - INTERACTIVE JAVASCRIPT APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize component modules
  initNavigation();
  initCounters();
  initGalleryFilter();
  initLightbox();
  initEventFilterAndModal();
  initContactForm();
  initBackToTop();
});

/* --- 1. Mobile Navigation & Header Scroll --- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle Header background on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlight Active Link on Scroll
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });
  }

  // Close menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      if (mobileToggle) {
        const icon = mobileToggle.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });
  });
}

/* --- 2. Stats Animated Counter --- */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter');
  let animated = false;

  const animateCounters = () => {
    counterElements.forEach(el => {
      const target = +el.getAttribute('data-target');
      const speed = 200; // lower is faster
      const inc = Math.ceil(target / speed);
      let count = 0;

      const updateCount = () => {
        count += inc;
        if (count < target) {
          el.innerText = count.toLocaleString('id-ID');
          setTimeout(updateCount, 15);
        } else {
          el.innerText = target.toLocaleString('id-ID') + '+';
        }
      };

      updateCount();
    });
  };

  // Intersection Observer to trigger when visible
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }
}

/* --- 3. Filterable Photo Gallery --- */
function initGalleryFilter() {
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- 4. Gallery Image Lightbox --- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption-text');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption').innerText;
      
      lightboxImg.src = img.src;
      lightboxCaption.innerText = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- 5. Event Filtering & Event Detail Modal --- */
const sampleEventDetails = {
  1: {
    title: "MAPABA (Masa Penerimaan Anggota Baru) 2026",
    category: "Akan Datang",
    date: "25 - 27 September 2026",
    location: "Gedung UMKU / Aula PC PMII Kudus",
    speaker: "Instruktur Cabang & Senior PMII Kudus",
    desc: "MAPABA merupakan gerbang awal proses kaderisasi formal di PMII. Selama 3 hari 2 malam, peserta akan dibekali materi Ke-PMII-an, Ke-Islam-an (Aswaja An-Nahdliyah), Ke-Indonesia-an, NDP (Nilai Dasar Pergerakan), serta teknik persidangan & retorika dasar.",
    benefits: ["Sertifikat Kelulusan MAPABA", "Modul Kaderisasi Digital", "Jaringan Alumni & Senior", "Konsumsi & Penginapan"]
  },
  2: {
    title: "Dialog Publik: Memperkuat Peran Mahasiswa dalam Pembangunan Kudus",
    category: "Terlaksana",
    date: "14 Juli 2026",
    location: "Auditorium Kampus IAIN Kudus",
    speaker: "Tokoh Masyarakat, Akademisi, & Tokoh Kepemudaan",
    desc: "Kajian kritis dan forum diskusi interaktif menyoroti isu-isu strategis ekonomi daerah, pemberdayaan UMKM Kudus, serta pengawalan kebijakan publik oleh elemen gerakan mahasiswa.",
    benefits: ["Notulensi Rekomendasi Kebijakan", "Sertifikat Peserta", "Doorprize Buku & Souvenir"]
  },
  3: {
    title: "Bakti Sosial & Pemeriksaan Kesehatan Gratis",
    category: "Terlaksana",
    date: "02 Juni 2026",
    location: "Desa Wisata Rahtawu, Gebog, Kudus",
    speaker: "KOPRI PMII Kudus & Tim Dokter Syifa",
    desc: "Aksi pengabdian masyarakat berupa penyerahan 250 paket sembako, penyuluhan kesehatan keluarga, serta perpustakaan keliling untuk anak-anak sekolah dasar di daerah lereng Gunung Muria.",
    benefits: ["Bantuan Paket Sembako", "Konsultasi Medis Gratis", "Pemberdayaan Perpustakaan Mini"]
  }
};

function initEventFilterAndModal() {
  const eventFilterBtns = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('.event-card');
  const eventModal = document.querySelector('.event-modal');
  const eventModalBody = document.querySelector('.event-modal-content-area');
  const eventModalClose = document.querySelector('.event-modal-close');

  // Filter Logic
  eventFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      eventFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-event-filter');
      eventCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Open Logic
  const detailButtons = document.querySelectorAll('.btn-event-detail');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const eventId = btn.getAttribute('data-event-id');
      const data = sampleEventDetails[eventId];
      if (data && eventModal && eventModalBody) {
        eventModalBody.innerHTML = `
          <div style="padding: 1rem 0;">
            <span class="section-tag">${data.category}</span>
            <h2 style="font-size: 1.8rem; margin: 0.8rem 0; color: var(--primary);">${data.title}</h2>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; background: var(--bg-alt); padding: 1.2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <div><i class="fa-regular fa-calendar text-accent" style="margin-right: 6px;"></i> <strong>Waktu:</strong> ${data.date}</div>
              <div><i class="fa-solid fa-location-dot text-accent" style="margin-right: 6px;"></i> <strong>Lokasi:</strong> ${data.location}</div>
              <div style="grid-column: span 2;"><i class="fa-solid fa-user-graduate text-accent" style="margin-right: 6px;"></i> <strong>Narasumber/Pemateri:</strong> ${data.speaker}</div>
            </div>

            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary);">Deskripsi Kegiatan:</h4>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${data.desc}</p>

            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary);">Fasilitas / Output:</h4>
            <ul style="list-style-type: none; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 2rem;">
              ${data.benefits.map(b => `<li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;"><i class="fa-solid fa-circle-check" style="color: var(--success);"></i> ${b}</li>`).join('')}
            </ul>

            <div style="display: flex; gap: 1rem;">
              <a href="#contact" onclick="closeEventModal()" class="btn btn-primary" style="flex: 1;"><i class="fa-solid fa-paper-plane"></i> Hubungi Panitia / Daftar</a>
              <button onclick="closeEventModal()" class="btn btn-outline" style="background: var(--text-muted); color: #fff;">Tutup</button>
            </div>
          </div>
        `;
        eventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  window.closeEventModal = () => {
    if (eventModal) {
      eventModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (eventModalClose) {
    eventModalClose.addEventListener('click', window.closeEventModal);
  }

  if (eventModal) {
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) {
        window.closeEventModal();
      }
    });
  }
}

/* --- 6. Contact Form Validation & Submission --- */
function initContactForm() {
  const form = document.getElementById('pmiiContactForm');
  const toast = document.getElementById('toastNotification');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');

    // Reset error states
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input && input.parentElement) {
        input.parentElement.classList.remove('invalid');
      }
    });

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Nama lengkap wajib diisi');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Alamat email wajib diisi');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Format alamat email tidak valid');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Subjek pesan wajib diisi');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Pesan minimal berisi 10 karakter');
      isValid = false;
    }

    if (isValid) {
      // Simulate submission animation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show Toast
        if (toast) {
          toast.classList.add('active');
          setTimeout(() => {
            toast.classList.remove('active');
          }, 4500);
        }

        // WhatsApp Direct Option
        const waText = `Halo PC PMII Kudus, saya ${encodeURIComponent(nameInput.value.trim())} (${encodeURIComponent(emailInput.value.trim())}). Subjek: ${encodeURIComponent(subjectInput.value.trim())}. Pesan: ${encodeURIComponent(messageInput.value.trim())}`;
        console.log('Form validated successfully. Generated WA payload:', waText);

        form.reset();
      }, 1200);
    }
  });

  function showError(input, message) {
    const parent = input.parentElement;
    parent.classList.add('invalid');
    const errorEl = parent.querySelector('.error-msg');
    if (errorEl) {
      errorEl.innerText = message;
    }
  }
}

/* --- 7. Back To Top Button --- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
