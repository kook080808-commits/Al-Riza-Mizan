// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1500);
});

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  if (cursor) {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  }
  if (ring) {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) {
      cursor.style.width = '14px';
      cursor.style.height = '14px';
    }
    if (ring) {
      ring.style.width = '48px';
      ring.style.height = '48px';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) {
      cursor.style.width = '8px';
      cursor.style.height = '8px';
    }
    if (ring) {
      ring.style.width = '32px';
      ring.style.height = '32px';
    }
  });
});

// ── NAV ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const limit = document.body.scrollHeight - window.innerHeight;
    scrollProgress.style.width = limit > 0 ? (window.scrollY / limit * 100) + '%' : '0%';
  }
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }
});

// ── HAMBURGER ──
const hb = document.getElementById('hamburger');
const mm = document.getElementById('mobileMenu');
if (hb && mm) {
  hb.addEventListener('click', () => {
    hb.classList.toggle('open');
    mm.classList.toggle('open');
  });
}

window.closeMobile = function() {
  const hb = document.getElementById('hamburger');
  const mm = document.getElementById('mobileMenu');
  if (hb) hb.classList.remove('open');
  if (mm) mm.classList.remove('open');
};

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// ── FORM SUBMIT ──
window.submitForm = function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const originalHtml = btn.innerHTML;
  btn.textContent = '...';
  setTimeout(() => {
    const successMsg = document.getElementById('successMsg');
    if (successMsg) successMsg.style.display = 'block';
    e.target.reset();
    btn.innerHTML = originalHtml;
    updateLangDisplay(document.body.className.replace('lang-', ''));
    setTimeout(() => {
      if (successMsg) successMsg.style.display = 'none';
    }, 5000);
  }, 1200);
};

// ── LANGUAGE ──
window.setLang = function(lang) {
  document.body.className = 'lang-' + lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase() === lang);
  });
};

function updateLangDisplay(lang) {
  window.setLang(lang);
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── COUNTER ANIMATION ──
window.animateCounter = function(el, target) {
  let count = 0;
  const step = target / 60;
  const interval = setInterval(() => {
    count = Math.min(count + step, target);
    if (target === 100) {
      el.textContent = Math.round(count) + '%';
    } else if (target === 2026) {
      el.textContent = Math.round(count);
    } else {
      el.textContent = Math.round(count) + '+';
    }
    if (count >= target) clearInterval(interval);
  }, 25);
};

// Run counters once when loaded
document.addEventListener('DOMContentLoaded', () => {
  const statFounded = document.getElementById('stat-founded');
  const statServices = document.getElementById('stat-services');
  const statConf = document.getElementById('stat-conf');
  if (statFounded) window.animateCounter(statFounded, 2026);
  if (statServices) window.animateCounter(statServices, 9);
  if (statConf) window.animateCounter(statConf, 100);

  // ── LICENSE FULLSCREEN LIGHTBOX ──
  const trigger = document.getElementById('contact-license-trigger');
  const modal = document.getElementById('license-modal');
  const closeBtn = document.getElementById('license-modal-close');
  const modalImg = document.getElementById('modal-image');

  // Zoom / Pan variables
  let scale = 1;
  let lastScale = 1;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let posX = 0;
  let posY = 0;
  let lastDistance = 0;

  const updateTransform = () => {
    if (scale <= 1) {
      scale = 1;
      posX = 0;
      posY = 0;
    }
    
    if (scale > 1) {
      modalImg.classList.add('zoomed');
    } else {
      modalImg.classList.remove('zoomed');
    }
    
    modalImg.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`;
  };

  const resetZoomState = () => {
    scale = 1;
    posX = 0;
    posY = 0;
    isPanning = false;
    modalImg.style.transition = 'none';
    updateTransform();
    setTimeout(() => {
      modalImg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 50);
  };

  if (trigger && modal && closeBtn && modalImg) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      resetZoomState();
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modal.style.display = 'none';
        }
      }, 400);
    };

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('license-modal') || e.target.classList.contains('modal-content-wrapper')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // ── MOUSE PANNING ──
    modalImg.addEventListener('mousedown', (e) => {
      if (scale <= 1) return;
      isPanning = true;
      startX = e.clientX - posX;
      startY = e.clientY - posY;
      modalImg.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      posX = e.clientX - startX;
      posY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        modalImg.style.transition = 'transform 0.15s ease-out';
      }
    });

    // ── SCROLL WHEEL ZOOM ──
    modalImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 0.15;
      if (e.deltaY < 0) {
        scale = Math.min(scale + zoomFactor, 4);
      } else {
        scale = Math.max(scale - zoomFactor, 1);
      }
      modalImg.style.transition = 'transform 0.15s ease-out';
      updateTransform();
    }, { passive: false });

    // ── TOUCH GESTURES (MOBILE PINCH & DRAG) ──
    modalImg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        // DRAG STARTED
        if (scale > 1) {
          isPanning = true;
          startX = e.touches[0].clientX - posX;
          startY = e.touches[0].clientY - posY;
          modalImg.style.transition = 'none';
        }
      } else if (e.touches.length === 2) {
        // PINCH STARTED
        isPanning = false;
        lastDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastScale = scale;
      }
    }, { passive: true });

    modalImg.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isPanning) {
        e.preventDefault(); // prevent scroll bounce
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
        updateTransform();
      } else if (e.touches.length === 2) {
        e.preventDefault(); // prevent pinch page zoom
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDistance / lastDistance;
        scale = Math.min(Math.max(1, lastScale * factor), 4);
        updateTransform();
      }
    }, { passive: false });

    modalImg.addEventListener('touchend', () => {
      isPanning = false;
      modalImg.style.transition = 'transform 0.15s ease-out';
    });

    // ── DOUBLE TAP TO ZOOM ──
    let lastTap = 0;
    modalImg.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
        if (scale > 1) {
          resetZoomState();
        } else {
          scale = 2;
          posX = 0;
          posY = 0;
          modalImg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          updateTransform();
        }
      }
      lastTap = currentTime;
    });

    // ── ZOOM ACTIONS VIA REFINED BUTTONS ──
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.5, 4);
        modalImg.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        updateTransform();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.5, 1);
        modalImg.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        updateTransform();
      });
    }

    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoomState();
      });
    }
  }
});
