/**
 * ==========================================================================
 * MAIN PORTFOLIO CONTROLLER
 * Project Rendering, Live Clock, Filter Tabs, Modals, Toasts
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initProjectModal();
  initProjects();
  initSkillsFilter();
  initContactForm();
  initCopyEmail();
  initResumeDownload();
  initBackToTop();
});

/* ==========================================================================
   1. Live Clock in Header Bar
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. Project Details Glassmorphic Dialog Modal
   ========================================================================== */
function initProjectModal() {
  let backdrop = document.getElementById('projectModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'projectModalBackdrop';
    backdrop.className = 'project-modal-backdrop';
    document.body.appendChild(backdrop);
  }

  function closeModal() {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('.project-modal-close-btn')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  window.openProjectModal = function (project) {
    const demoLabel = project.demoText || 'Live Demo ↗';
    const highlightsHtml = project.highlights && project.highlights.length
      ? `
        <div class="project-modal-section-title">Key Architectural Highlights</div>
        <ul class="project-modal-highlights">
          ${project.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      `
      : '';

    const videoHtml = project.youtubeEmbedUrl
      ? `
        <div class="project-modal-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-top:24px;">
          <span>Demo Video Walkthrough</span>
          <a href="${project.videoUrl}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem;font-weight:600;color:var(--color-espresso-subtle);text-decoration:underline;">Open in YouTube ↗</a>
        </div>
        <div class="project-modal-video-wrap">
          <iframe 
            src="${project.youtubeEmbedUrl}" 
            title="${project.title} Demo Video" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            class="project-modal-video-iframe">
          </iframe>
        </div>
      `
      : '';

    const actionsHtml = `
      ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-dark">${demoLabel}</a>` : ''}
      ${project.videoUrl ? `<a href="${project.videoUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-dark" style="background:#e11d48;border-color:#e11d48;">Watch Demo 🎬</a>` : ''}
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-outline">GitHub Repository ⌥</a>
    `;

    backdrop.innerHTML = `
      <div class="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modalProjectTitle">
        <button class="project-modal-close-btn" aria-label="Close dialog" title="Close">✕</button>
        
        <div class="project-modal-image-wrap" style="background: ${project.gradient};">
          ${project.image
            ? `<img src="${project.image}" alt="${project.title}" class="project-modal-image" onerror="this.style.display='none';">`
            : `<div style="font-size:3.5rem;color:white;">${project.icon || '✨'}</div>`}
        </div>

        <div class="project-modal-body">
          <h2 class="project-modal-title" id="modalProjectTitle">${project.title}</h2>
          <p class="project-modal-desc">${project.details || project.summary}</p>
          
          ${highlightsHtml}

          ${videoHtml}

          <div class="project-modal-section-title">Technical Proficiencies & Stack</div>
          <div class="project-modal-skills">
            ${project.tags.map(tag => `<span class="project-modal-skill-tag">${tag}</span>`).join('')}
          </div>

          <div class="project-modal-actions">
            ${actionsHtml}
          </div>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
}

/* ==========================================================================
   3. Projects Showcase & Filter
   ========================================================================== */
function initProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  const filterButtons = document.querySelectorAll('.project-filter-btn');

  if (!projectsGrid || !window.portfolioProjects) return;

  function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = '';

    const filtered = filter === 'all'
      ? window.portfolioProjects
      : window.portfolioProjects.filter(p => p.category === filter);

    filtered.forEach((project) => {
      const card = document.createElement('div');
      card.className = 'project-card glass-card';

      const demoLabel = project.demoText || 'Live Demo ↗';
      const actionsHtml = project.demoUrl
        ? `
            <a href="${project.demoUrl}" class="pill-btn pill-btn-dark" target="${project.demoUrl.startsWith('http') ? '_blank' : '_self'}">
              ${demoLabel}
            </a>
            <a href="${project.githubUrl}" class="pill-btn pill-btn-outline" target="_blank">
              GitHub ⌥
            </a>
          `
        : `
            <a href="${project.githubUrl}" class="pill-btn pill-btn-dark" style="width: 100%; text-align: center;" target="_blank">
              GitHub ⌥
            </a>
          `;

      const imageMarkup = project.image
        ? `<img src="${project.image}" alt="${project.title}" class="project-card-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="project-img-fallback" style="display: none; font-size: 3rem; opacity: 0.95; color: white; width: 100%; height: 100%; align-items: center; justify-content: center;">
             ${project.icon || '✨'}
           </div>`
        : `<div style="font-size: 3rem; opacity: 0.95; color: white;">${project.icon || '✨'}</div>`;

      card.innerHTML = `
        <div class="project-image-wrap" style="background: ${project.gradient};">
          ${imageMarkup}
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.summary}</p>
          <div class="project-tags">
            ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            ${actionsHtml}
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        // If clicking directly on action button link, let link open normally
        if (e.target.closest('a')) return;
        window.openProjectModal(project);
      });

      projectsGrid.appendChild(card);
    });
  }

  renderProjects('all');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderProjects(cat);
    });
  });
}

/* ==========================================================================
   3. Skills Filter Matrix
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('#skills .skills-filter-btn');
  const skillCards = document.querySelectorAll('#skillsGrid .skill-card');
  const skillsGrid = document.getElementById('skillsGrid');

  /* ── Build Reel Gallery (once) ── */
  const reel = document.createElement('div');
  reel.className = 'skills-reel active';
  reel.id = 'skillsReel';

  const cards = Array.from(skillCards);
  const cols = [[], [], [], []];
  cards.forEach((c, i) => cols[i % 4].push(c));

  cols.forEach(colCards => {
    const col = document.createElement('div');
    col.className = 'reel-column';
    const track = document.createElement('div');
    track.className = 'reel-track';

    // Original + duplicate for seamless infinite scroll
    [...colCards, ...colCards].forEach(c => {
      const clone = c.cloneNode(true);
      track.appendChild(clone);
    });

    col.appendChild(track);
    reel.appendChild(col);
  });

  skillsGrid.parentNode.insertBefore(reel, skillsGrid.nextSibling);

  // Default: reel visible, grid hidden
  skillsGrid.style.display = 'none';

  /* ── Filter switching ── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-skill-cat') || 'all';

      if (category === 'all') {
        reel.classList.add('active');
        skillsGrid.style.display = 'none';
      } else {
        reel.classList.remove('active');
        skillsGrid.style.display = 'grid';
        skillCards.forEach(card => {
          const cardCats = (card.getAttribute('data-category') || '').trim().split(/\s+/);
          card.style.display = cardCats.includes(category) ? 'flex' : 'none';
        });
      }
    });
  });
}

/* ==========================================================================
   4. Contact Form & Toast System
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const messageInput = document.getElementById('senderMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending... ⏳</span>';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/nidhi24dharme2006@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      if (response.ok) {
        showToast('🚀 Message sent successfully! Thanks for reaching out, Nidhi will reply soon.');
        form.reset();
      } else {
        // Fallback to mailto
        window.location.href = `mailto:nidhi24dharme2006@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        showToast('✉️ Opening email client to send message...');
      }
    } catch (err) {
      window.location.href = `mailto:nidhi24dharme2006@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
      showToast('✉️ Opening email client to send message...');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'nidhi24dharme2006@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('✓ Email copied to clipboard!');
      const label = copyBtn.querySelector('.copy-label');
      if (label) {
        const original = label.textContent;
        label.textContent = 'Copied! ✓';
        setTimeout(() => { label.textContent = original; }, 2000);
      }
    }).catch(() => {
      showToast('Email: nidhi24dharme2006@gmail.com');
    });
  });
}

function showToast(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = 'padding:14px 22px;background:#1e1713;color:#fff;border-radius:9999px;font-size:0.9rem;font-weight:600;box-shadow:0 8px 30px rgba(0,0,0,0.3);';
  toast.innerHTML = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   5. Sticky Navbar & Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Sticky navbar glassmorphic state
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Floating circular button visibility
    if (btn) {
      if (scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   6. Resume Download Handler (with graceful fallback)
   ========================================================================== */
function initResumeDownload() {
  const resumeLinks = document.querySelectorAll('a[download][href*=".pdf"]');
  resumeLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      try {
        const response = await fetch(link.getAttribute('href'), { method: 'HEAD' });
        if (!response.ok) {
          e.preventDefault();
          showToast('📄 Resume will be available for download soon!');
        }
      } catch {
        // Allow default download behavior
      }
    });
  });
}
