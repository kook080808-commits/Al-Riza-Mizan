// ── GEMINI CONFIGURATION ──
// O'zingizning shaxsiy Gemini API kalitingizni shu yerga kiriting:
// Enter your personal Gemini API key here:
const GEMINI_API_KEY = "AQ.Ab8RN6KLEchD-cAtJS1ksVClvOTieXCcMIJGefBe09oUciZ0ww";

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
  if (typeof updateChatDisplay === 'function') {
    updateChatDisplay();
  }
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
  const triggers = document.querySelectorAll('.credential-modal-trigger');
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

  if (triggers.length > 0 && modal && closeBtn && modalImg) {
    triggers.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        const childImg = t.querySelector('img');
        if (childImg) {
          modalImg.src = childImg.src;
          if (childImg.style.filter) {
            modalImg.style.filter = childImg.style.filter;
          } else {
            modalImg.style.filter = '';
          }
        }
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetZoomState();
      });
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

  // ── AI CONSULTATION (BEPUL MASLAHAT) INTEGRATION ──
  const aiSubmitBtn = document.getElementById('ai-submit-btn');
  const aiClearBtn = document.getElementById('ai-clear-btn');
  const aiQuestionText = document.getElementById('ai-question');
  const aiResponseContainer = document.getElementById('ai-response-container');
  const aiResponseText = document.getElementById('ai-response-text');
  const aiFormBlock = document.getElementById('ai-form');
  const aiBrainIcon = document.getElementById('ai-brain-icon');

  // Multi-turn conversation state
  let conversationHistory = [];

  // Helper to escape HTML characters
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Markdown rendering engine for code blocks, lists, bold/italics
  function renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Code blocks: ```javascript ... ```
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
      const codeEscaped = escapeHTML(code.trim());
      return `<div class="code-block-wrapper" style="margin: 1rem 0; border: 1px solid rgba(212,175,55,0.25); border-radius: 8px; overflow: hidden; background: #0c0f1d; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
        <div style="background: rgba(212,175,55,0.1); padding: 0.4rem 0.85rem; border-bottom: 1px solid rgba(212,175,55,0.15); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gold); font-weight: 600;">
          <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
          <button type="button" class="copy-code-btn" style="background: transparent; border: none; color: var(--gold); cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: color 0.2s; font-weight: 600;" onmouseenter="this.style.color='#ffffff';" onmouseleave="this.style.color='var(--gold)';" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.trim()); this.innerHTML='<i class=\'fa-solid fa-check\'></i> Copied!'; setTimeout(() => this.innerHTML='<i class=\'fa-regular fa-copy\'></i> Copy', 2000);">
            <i class="fa-regular fa-copy"></i> Copy
          </button>
        </div>
        <pre style="margin: 0; padding: 1rem; overflow-x: auto; color: #e2e8f0; line-height: 1.5; white-space: pre;"><code>${codeEscaped}</code></pre>
      </div>`;
    });

    // Inline code: `code`
    html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.35rem; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; font-size: 0.9rem; color: #f6ad55; border: 1px solid rgba(255,255,255,0.05); font-weight: 500;">$1</code>');

    // Bold: **text**
    html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong style="color: var(--gold); font-weight: 700;">$1</strong>');

    // Italic: *text*
    html = html.replace(/\*([\s\S]*?)\*/g, '<em style="font-style: italic; color: #f7fafc;">$1</em>');

    // Bulleted lists: * item or - item
    html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li style="margin-left: 1.25rem; list-style-type: disc; margin-bottom: 0.4rem; color: #cbd5e1;">$1</li>');
    html = html.replace(/(<li style="[^"]*disc"[\s\S]*?<\/li>)/g, '<ul style="margin: 0.75rem 0; padding-left: 0.5rem; list-style-position: inside;">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');

    // Numbered lists: 1. item
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li style="margin-left: 1.25rem; list-style-type: decimal; margin-bottom: 0.4rem; color: #cbd5e1;">$1</li>');
    html = html.replace(/(<li style="[^"]*decimal"[\s\S]*?<\/li>)/g, '<ol style="margin: 0.75rem 0; padding-left: 0.5rem; list-style-position: inside;">$1</ol>');
    html = html.replace(/<\/ol>\s*<ol[^>]*>/g, '');

    // Newlines to br
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  // Updates the chat display by rendering the entire sequence of conversation history
  function updateChatDisplay() {
    if (!aiResponseText) return;
    
    let isUz = !document.body.className.includes('lang-ru') && !document.body.className.includes('lang-en');
    let isRu = document.body.className.includes('lang-ru');
    
    let chatHtml = '';

    // Add initial greeting message
    chatHtml += `
      <div class="chat-message ai-msg" style="margin-bottom: 1.5rem; display: flex; flex-direction: column; align-items: flex-start; animation: fadeIn 0.3s ease;">
        <div style="font-size: 0.75rem; color: var(--gold); margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
          <i class="fa-solid fa-scale-balanced"></i> ${isUz ? 'AL-RIZA MIZAN AI Advokati' : (isRu ? 'ИИ-Адвокат AL-RIZA MIZAN' : 'AL-RIZA MIZAN AI Advocate')}
        </div>
        <div style="background: rgba(212,175,55,0.03); border: 1px solid rgba(212,175,55,0.22); border-radius: 12px 12px 12px 0; padding: 0.9rem 1.25rem; max-width: 85%; color: #e2e8f0; font-size: 0.95rem; line-height: 1.6; text-align: left; word-break: break-word; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
          ${isUz ? 'Assalomu alaykum! Men "AL-RIZA MIZAN" advokatlik byurosi sun\'iy intellekt yordamchisiman. Sizni qanday huquqiy savol qiziqtirmoqda? Savolingizni quyidagi maydonga yozing.' : (isRu ? 'Здравствуйте! Я искусственный интеллект-помощник адвокатского бюро "AL-RIZA MIZAN". Какой юридический вопрос вас интересует? Напишите ваш вопрос в поле ниже.' : 'Hello! I am the AI legal assistant of the "AL-RIZA MIZAN" advocacy bureau. What legal question interests you? Type your question in the field below.')}
        </div>
      </div>
    `;
    
    conversationHistory.forEach((msg) => {
      const text = msg.parts[0].text;
      if (msg.role === 'user') {
        chatHtml += `
          <div class="chat-message user-msg" style="margin-bottom: 1.5rem; display: flex; flex-direction: column; align-items: flex-end; animation: fadeIn 0.3s ease;">
            <div style="font-size: 0.75rem; color: var(--gold); margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fa-regular fa-user"></i> ${isUz ? 'Siz' : (isRu ? 'Вы' : 'You')}
            </div>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px 12px 0 12px; padding: 0.75rem 1.1rem; max-width: 85%; color: #ffffff; font-size: 0.95rem; line-height: 1.5; text-align: left; word-break: break-word; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
              ${escapeHTML(text).replace(/\n/g, '<br>')}
            </div>
          </div>
        `;
      } else {
        chatHtml += `
          <div class="chat-message ai-msg" style="margin-bottom: 1.5rem; display: flex; flex-direction: column; align-items: flex-start; animation: fadeIn 0.3s ease;">
            <div style="font-size: 0.75rem; color: var(--gold); margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-scale-balanced"></i> ${isUz ? 'AL-RIZA MIZAN AI' : (isRu ? 'ИИ-Адвокат AL-RIZA MIZAN' : 'AL-RIZA MIZAN AI')}
            </div>
            <div style="background: rgba(212,175,55,0.03); border: 1px solid rgba(212,175,55,0.22); border-radius: 12px 12px 12px 0; padding: 0.9rem 1.25rem; max-width: 85%; color: #e2e8f0; font-size: 0.95rem; line-height: 1.6; text-align: left; word-break: break-word; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
              ${renderMarkdown(text)}
            </div>
          </div>
        `;
      }
    });
    
    aiResponseText.innerHTML = chatHtml;
    
    // Automatically scroll to the bottom of the conversation window
    setTimeout(() => {
      aiResponseText.scrollTop = aiResponseText.scrollHeight;
    }, 50);
  }

  // Bind to global window scope so that setLang can trigger it
  window.updateChatDisplay = updateChatDisplay;

  // Submit trigger handler
  async function handleAISubmit() {
    const question = aiQuestionText.value.trim();
    if (!question) {
      const isUz = !document.body.className.includes('lang-ru') && !document.body.className.includes('lang-en');
      const isRu = document.body.className.includes('lang-ru');
      alert(isUz ? 'Iltimos, savolingizni yozing.' : (isRu ? 'Пожалуйста, введите ваш вопрос.' : 'Please enter your question.'));
      return;
    }

    // Determine current language
    let lang = 'uz';
    if (document.body.className.includes('lang-ru')) {
      lang = 'ru';
    } else if (document.body.className.includes('lang-en')) {
      lang = 'en';
    }

    // Append user message to local context history
    conversationHistory.push({ role: 'user', parts: [{ text: question }] });
    updateChatDisplay();

    // Clear input field and focus
    aiQuestionText.value = '';
    
    // Add typing indicator / loading block
    const isUz = lang === 'uz';
    const isRu = lang === 'ru';
    const loadingText = isUz ? 'Tahlil qilinmoqda...' : (isRu ? 'Анализ вопроса...' : 'Analyzing...');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'ai-typing-indicator';
    typingIndicator.style.cssText = 'margin-bottom: 1.5rem; display: flex; flex-direction: column; align-items: flex-start; animation: fadeIn 0.3s ease;';
    typingIndicator.innerHTML = `
      <div style="font-size: 0.75rem; color: var(--gold); margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
        <i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}
      </div>
      <div style="background: rgba(212,175,55,0.01); border: 1px dashed rgba(212,175,55,0.2); border-radius: 12px 12px 12px 0; padding: 0.75rem 1.1rem; color: var(--gray); font-size: 0.95rem; font-style: italic; display: flex; align-items: center; gap: 0.5rem;">
        <span>AI is working</span>
        <span class="dot-typing" style="display: inline-flex; gap: 3px;"><span style="width: 5px; height: 5px; background: var(--gold); border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.32s;"></span><span style="width: 5px; height: 5px; background: var(--gold); border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.16s;"></span><span style="width: 5px; height: 5px; background: var(--gold); border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both;"></span></span>
      </div>
    `;
    aiResponseText.appendChild(typingIndicator);
    aiResponseText.scrollTop = aiResponseText.scrollHeight;

    // Button Loading State
    const originalBtnHtml = aiSubmitBtn.innerHTML;
    aiSubmitBtn.disabled = true;
    aiQuestionText.disabled = true;
    if (aiBrainIcon) aiBrainIcon.className = 'fa-solid fa-spinner fa-spin';
    aiSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;

    try {
      let responseText = '';

      // Prepare payload with full conversation history
      const apiPayload = {
        question: question,
        lang: lang,
        history: conversationHistory
      };

      // 1. Try DIRECT Gemini client-side API call first if a key is available (supports double-clicking index.html/offline/VS Code files)
      if (typeof GEMINI_API_KEY !== 'undefined' && GEMINI_API_KEY && GEMINI_API_KEY.trim() !== "") {
        try {
          let systemInst = "Siz \"AL-RIZA MIZAN\" advokatlik byurosi professional va tajribali advokatisiz (Muhammadjon O'lmasov boshchiligidagi). Mijozga uning yozgan tilida (o'zbekcha) juda professional, aniq va ishonchli yuridik maslahat bering (O'zbekiston Respublikasi qonunchiligi asosida). Sizu biz deb murojaat qiling. DIQQAT: Javobingiz juda lo'nda, qisqa va aniq bo'lsin, o'rtacha 4-5 ta gapdan iborat bo'lsin va aslo undan oshmasin! Savol beruvchiga to'g'ri, xatosiz, ishonchli va aniq javob bering.";
          if (lang === 'ru') {
            systemInst = "Вы являетесь профессиональным и опытным адвокатом адвокатского бюро \"AL-RIZA MIZAN\" (под руководством Мухаммаджона Улмасова). Предоставьте клиенту краткую, точную юридическую консультацию на русском языке на основе законодательства Республики Узбекистан. Будьте очень кратки, максимум 4-5 предложений! Дайте абсолютно точный, надежный и безошибочный ответ.";
          } else if (lang === 'en') {
            systemInst = "You are a professional attorney at the \"AL-RIZA MIZAN\" advocacy bureau (led by Muhammadjon O'lmasov). Provide the client with brief, precise, and polite legal advice in English based on the legislation of the Republic of Uzbekistan. Your response must be very short and concise, averaging 4-5 sentences max, and completely accurate without mistakes.";
          }

          // Use the latest gemini-2.5-flash or gemini-1.5-flash for browser client calls
          const rawResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: conversationHistory,
              systemInstruction: {
                parts: [{ text: systemInst }]
              },
              generationConfig: {
                temperature: 0.3
              }
            })
          });

          if (rawResponse.ok) {
            const resData = await rawResponse.json();
            if (resData && resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts && resData.candidates[0].content.parts[0]) {
              responseText = resData.candidates[0].content.parts[0].text;
            }
          } else {
            console.warn("Direct client-side API response failed. Trying server-side backend fallback.");
          }
        } catch (directApiErr) {
          console.warn("Direct client-side API call threw an error. Trying server-side backend fallback:", directApiErr);
        }
      }

      // 2. Try SERVER-SIDE backend API call as fallback if direct call is disabled/unsuccessful
      if (!responseText) {
        try {
          const rawResponse = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiPayload)
          });

          if (rawResponse.ok) {
            const resData = await rawResponse.json();
            if (resData && resData.text) {
              responseText = resData.text;
            }
          } else {
            console.warn("Server-side proxy API response failed. Trying dynamic smart fallback.");
          }
        } catch (apiErr) {
          console.warn("Server-side proxy API call threw an error. Trying dynamic smart fallback:", apiErr);
        }
      }

      // 3. Fallback to offline local rules if absolutely no network response is obtained
      if (!responseText) {
        // Mock a realistic thinking time
        await new Promise(resolve => setTimeout(resolve, 800));
        responseText = getSmartLocalAdvice(question, lang);
      }

      // Remove typing indicator
      const indicatorEl = document.getElementById('ai-typing-indicator');
      if (indicatorEl) indicatorEl.remove();

      // Append AI response to context history
      conversationHistory.push({ role: 'model', parts: [{ text: responseText }] });
      updateChatDisplay();

    } catch (err) {
      console.error("Critical AI error:", err);
      const indicatorEl = document.getElementById('ai-typing-indicator');
      if (indicatorEl) indicatorEl.remove();

      const errMsg = isUz ? "Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring." : (isRu ? 'Произошла ошибка системы. Пожалуйста, попробуйте еще раз.' : 'A system error occurred. Please try again.');
      conversationHistory.push({ role: 'model', parts: [{ text: errMsg }] });
      updateChatDisplay();
    } finally {
      aiSubmitBtn.disabled = false;
      aiQuestionText.disabled = false;
      aiSubmitBtn.innerHTML = originalBtnHtml;
      if (aiBrainIcon) aiBrainIcon.className = 'fa-solid fa-brain';
      aiQuestionText.focus();
    }
  }

  // Click handler
  if (aiSubmitBtn && aiQuestionText && aiResponseContainer && aiResponseText) {
    aiSubmitBtn.addEventListener('click', handleAISubmit);

    // Support Enter Key to Submit & Shift+Enter for New Line
    aiQuestionText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // prevent default carriage return
        handleAISubmit();
      }
    });
  }

  if (aiClearBtn && aiQuestionText) {
    aiClearBtn.addEventListener('click', () => {
      conversationHistory = [];
      aiQuestionText.value = '';
      updateChatDisplay();
      aiQuestionText.focus();
    });
  }

  function getSmartLocalAdvice(query, lang) {
    const q = query.toLowerCase();
    
    if (lang === 'uz') {
      if (q.includes('meros') || q.includes('vasiyat') || q.includes('vafot') || q.includes('mulk') || q.includes('bolish')) {
        return `AL-RIZA MIZAN Advokatlik Byurosi: Meros masalasi bo'yicha maslahat\n\nO'zbekiston Respublikasi Fuqarolik Kodeksining V-bo'limiga binoan merosxo'rlik qonun bo'yicha yoki vasiyatnoma bo'yicha amalga oshiriladi:\n\n1. Merosni qabul qilish muddati: Meros ochilgan kundan boshlab 6 (olti) oy ichida merosxo'r meros ochilgan davrdan buyon o'zining uni qabul qilish niyati haqida notariusga ariza topshirishi shart. Ushbu muddat o'tkazib yuborilsa, uni faqat sud tartibida tiklash mumkin.\n2. Birinchi navbatdagi merosxo'rlar: Qonun bo'yicha farzandlar, turmush o'rtog'i hamda vafot etganning ota-onasi birinchi navbatdagi merosxo'rlar hisoblanadi.\n3. Vasiyatnoma bo'yicha majburiy ulush: Voyaga yetmagan va mehnatga layoqatsiz merosxo'rlar vasiyatnoma shaklidan qat'i nazar o'zlariga tegishli qonuniy ulushning kamida yarmini majburiy ravishda olish huquqiga egadirlar.\n\nTavsiya: Notarial idoraga ariza taqdim etish va mulklarni rasmiylashtirish bo'yicha batafsil ko'mak olish uchun byuromizga murojaat etishingizni tavsiya etamiz. Telefon: +998906819989.`;
      }
      if (q.includes('oila') || q.includes('ajrim') || q.includes('nikoh') || q.includes('aliment') || q.includes('farzand')) {
        return `AL-RIZA MIZAN Advokatlik Byurosi: Oilaviy nizolar va aliment masalalari\n\nO'zbekiston Respublikasining Oila Kodeksi normalariga ko'ra nizolarni hal qilish tartiblari quyidagicha:\n\n1. Aliment miqdori: Voyaga yetmagan bolalar uchun aliment sud tartibida har oylik ish haqi va daromadning quyidagi qismlarida undiriladi: 1 ta bola uchun - 1/4 qismi; 2 ta bola uchun - 1/3 qismi; 3 ta va undan ko'p bola uchun - yarmi (50%).\n2. Er-xotinning birgalikdagi mulki: Nikoh davomida sotib olingan barcha ko'char va ko'chmas mulklar umumiy hamkorlikdagi egalik hisoblanadi va ajralish jarayonida (agar nikoh shartnomasi bo'lmasa) teng 50/50 ulushlarda bo'linadi.\n3. Nikohni bekor qilish: Agar voyaga yetmagan umumiy farzandlar bo'lsa, nikohdan ajratish faqat sud organlari orqali amalga oshiriladi. Sud oilani saqlab qolish uchun 6 oygacha yarashtirish muddati tayinlashi mumkin.\n\nTavsiya: Biz sizga da'vo arizalari tayyorlash va o'z huquqlaringizni qonuniy himoya qilishda mukammal yordam ko'rsatamiz. Maslahat uchun telefonimiz: +998906819989.`;
      }
      if (q.includes('sud') || q.includes('nizo') || q.includes('da\'vo') || q.includes('shikoyat') || q.includes('apellyatsiya')) {
        return `AL-RIZA MIZAN Advokatlik Byurosi: Sud ishlari va himoya\n\nFuqarolik, jinoiy yoki iqtisodiy sud ishlari bo'yicha tayyorlangan maxsus yuridik tavsiyalar:\n\n1. Da'vo qo'zg'atish: Da'vo arizasi Fuqarolik protsessual kodeksining normalariga to'liq javob berishi va barcha vajlarni isbotlovchi dalillar ilova qilinishi shart.\n2. Da'vo vaqti: Huquqi buzilganligini bilgan kundan boshlab umumiy da'vo muddati 3 (uch) yil etib belgilangan.\n3. Apellyatsiya tartibida shikoyat: Birinchi instansiya sudining qaroridan norozi bo'lgan taqdirda, qaror chiqilgan kundan boshlab 1 oy ichida yuqori turuvchi sudga apellyatsiya shikoyati taqdim etilishi lozim.\n\nSizni sudda ishonchli himoya qilishimiz va barcha hujjatlarni professional tayyorlashimiz uchun biz bilan bog'laning: +998906819989.`;
      }
      if (q.includes('shartnoma') || q.includes('biznes') || q.includes('tadbirkor') || q.includes('hujjat')) {
        return `AL-RIZA MIZAN Advokatlik Byurosi: Shartnomaviy va Biznes munosabatlari\n\nTadbirkorlik faoliyati va shartnomalar bo'yicha professional yuridik xulosa:\n\n1. Shartnoma erkinligi: O'zbekiston Respublikasi Fuqarolik kodeksiga ko'ra fuqarolar va yuridik shaxslar shartnoma tuzishda erkindirlar, biroq shartlar majburiy qonun qoidalariga zid bo'lmasligi loqaydlikdir.\n2. Yozma shartnoma: Mulkiy munosabatlarni tartibga soluvchi yoki ma'lum qiymatdan yuqori bitimlar, shuningdek ko'chmas mulk ijarasi va oldi-sotdisi majburiy ravishda yozma tuzilishi va qonunda belgilangan taqdirda ro'yxatdan o'tkazilishi lozim.\n3. Nizoli vaziyatlar: Bitim matnida nizolarni sudgacha hal qilish (pretensiya) tartib-qoidasi va nizolarni ko'rib chiquvchi sud aniq belgilanishi tavsiya etiladi.\n\nSizning shartnomalaringizni yuridik ekspertizadan o'tkazish yoki yangilarini tuzish borasida yordam beramiz. Telefon: +998906819989.`;
      }
      return `AL-RIZA MIZAN Advokatlik Byurosi professional maslahati:\n\nMurojaatingiz qabul qilindi. O'zbekiston Respublikasining amaldagi qonun hujjatlariga asosan yuridik masalalarni muvaffaqiyatli hal qilish bo'yicha dastlabki tavsiyalarimiz:\n\n1. Isbotlash majburiyati: Har qanday yuridik bahsda yoki murojaatda yozma dalillar, guvohlik ko'rsatmalari va rasmiy xatlar hal qiluvchi rol o'ynaydi.\n2. Advokat yordami: Murakkab yuridik holatlarda mustaqil ravishda harakat qilish kutilmagan moliyaviy yoki huquqiy yo'qotishlarga olib kelishi mumkin.\n3. Maxfiylik: Siz bizga taqdim etayotgan har qanday ma'lumot qonun bilan himoyalangan advokatlik siridir.\n\nVaziyatingizni to'liq o'rganish va sizga aniq harakatlar rejasini tuzib berishimiz uchun biz bilan aloqaga chiqing:\n📞 Telefon: +998906819989\n⚖ AL-RIZA MIZAN sizning qonuniy himoyangizni kafolatlaydi!`;
    } else if (lang === 'ru') {
      if (q.includes('наслед') || q.includes('завещ') || q.includes('имуще')) {
        return `Адвокатское Бюро AL-RIZA MIZAN: Консультация по наследственным делам\n\nСогласно Гражданскому кодексу Республики Узбекистан (Часть V), наследование осуществляется по завещанию и по закону:\n\n1. Срок принятия: Наследство должно быть принято в течение 6 месяцев со дня его открытия. Пропуск этого срока требует восстановления через суд.\n2. Наследники первой очереди: Дети, супруг(а) и родители покойного являются наследниками первой очереди.\n3. Обязательная доля: Несовершеннолетние или нетрудоспособные дети наследодателя наследуют независимо от содержания завещания не менее половины доли, которая причиталась бы им по закону.\n\nЗа квалифицированной помощью по оформлению наследственных прав обращайтесь по телефону: +998906819989.`;
      }
      if (q.includes('развод') || q.includes('брак') || q.includes('алимент') || q.includes('семь')) {
        return `Адвокатское Бюро AL-RIZA MIZAN: Семейное право и алименты\n\nВ соответствии с Семейным кодексом Республики Узбекистан:\n\n1. Размер алиментов: На содержание несовершеннолетних детей алименты взыскиваются судом ежемесячно в размере: на 1 ребенка - 1/4 часть дохода; на 2 детей - 1/3 часть; на 3 и более детей - половина заработка.\n2. Совместная собственность: Все имущество, приобретенное супругами в браке, по умолчанию делится поровну (50/50). \n3. Расторжение брака: При наличии несовершеннолетних детей расторжение брака производится исключительно судом. Суд вправе назначить примирительный срок до 6 месяцев.\n\nМы подготовим все судебные документы и защитим ваши права. Связаться с нами: +998906819989.`;
      }
      if (q.includes('суд') || q.includes('иск') || q.includes('жалоб') || q.includes('апелл')) {
        return `Адвокатское Бюро AL-RIZA MIZAN: Судебное представительство\n\nРекомендации по ведению гражданских, экономических или уголовных судебных дел в Узбекистане:\n\n1. Подготовка иска: Иск должен быть подан в строгом соответствии с требованиями ГПК РУз с приложением всех доказательств.\n2. Срок давности: Срок исковой давности по общему правилу составляет 3 года.\n3. Важная деталь: Самостоятельное участие в спорах без адвоката увеличивает правовые и финансовые риски.\n\nНаше бюро готово оказать полноценную защиту ваших интересов в суде. Свяжитесь по телефону: +998906819989.`;
      }
      return `Адвокатское Бюро AL-RIZA MIZAN Консультация:\n\nРекомендации по ведению дел в соответствии с законодательством Республики Узбекистан:\n\n1. Документирование: Фиксируйте любые правоотношения договорами, актами и расписками.\n2. Обратитесь к специалисту: Своевременная поддержка адвоката убережет от ошибок в суде и госорганах.\n3. Конфиденциальность: Вся информация защищена адвокатской тайной.\n\nПозвоните нам для выработки полной стратегии решения вашего дела:\n📞 Телефон: +998906819989\nАдрес: Гулистан, Сырдарьинская область. AL-RIZA MIZAN - надежный щит ваших интересов.`;
    } else {
      if (q.includes('inherit') || q.includes('property') || q.includes('will')) {
        return `AL-RIZA MIZAN Advocacy Bureau: Inheritance Consultation\n\nUnder the Civil Code of Uzbekistan:\n\n1. Accepting Inheritance: Must be claimed at a notary office within 6 months from the date of legacy opening.\n2. First Priority Heirs: Children, spouse, and parents of the deceased are first-tier beneficiaries.\n3. Mandatory Share: Minor or disabled heirs receive at least half of their statutory intestate share regardless of any testamentary will.\n\nContact us for assistance with inheritance filings: +998906819989.`;
      }
      if (q.includes('divorce') || q.includes('marriage') || q.includes('family') || q.includes('child')) {
        return `AL-RIZA MIZAN Advocacy Bureau: Family & Marital Law\n\nBased on the Family Code of Uzbekistan:\n\n1. Child Support (Alimony): 1/4 of net income for 1 child, 1/3 for 2 children, and 1/2 for 3 or more children.\n2. Joint Property: Assets purchased during marriage are jointly owned and split 50/50 unless specified otherwise in a prenuptial agreement.\n3. Divorce: Requires court proceedings if minor children are involved.\n\nFor litigation draft work or defense, please contact us: +998906819989.`;
      }
      return `AL-RIZA MIZAN Advocacy Bureau Legal Consultation:\n\nYour legal question has been logged. Crucial recommendations under the laws of the Republic of Uzbekistan:\n\n1. Written Evidence: Ensure all claims, contracts, or notices are handled in writing with formal receipt stamps.\n2. Statute of Limitations: The default time limit to file lawsuit claims is generally 3 years.\n3. Representation: Operating complex legal requests independently may compromise your assets or liberty.\n\nContact us directly to discuss your detailed case portfolio with Advocate Muhammadjon O'lmasov:\n📞 Hot-line: +998906819989\nLet us defend your rights with premium legal service in Gulistan, Uzbekistan.`;
    }
  }
});