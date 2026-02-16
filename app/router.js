/**
 * Job Notification Tracker — Router
 * Simple client-side router using History API
 */

class Router {
  constructor() {
    this.routes = {
      '/': this.renderHome.bind(this),
      '/dashboard': this.renderDashboard.bind(this),
      '/saved': this.renderSaved.bind(this),
      '/digest': this.renderDigest.bind(this),
      '/settings': this.renderSettings.bind(this),
      '/proof': this.renderProof.bind(this)
    };

    this.state = {
      // filters
      q: "",
      location: "All",
      mode: "All",
      experience: "All",
      source: "All",
      sort: "Latest",
      // modal
      modalJobId: null,
    };
    
    this.init();
  }

  init() {
    // Handle initial load
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        this.handleRoute();
      });
    } else {
      // DOM already loaded
      this.handleRoute();
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Handle link clicks + CTA + buttons
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.kn-nav__link');
      const navLogo = e.target.closest('.kn-nav__logo');
      const ctaButton = e.target.closest('[data-route]');
      const viewBtn = e.target.closest('[data-action="view"]');
      const saveBtn = e.target.closest('[data-action="save"]');
      const applyBtn = e.target.closest('[data-action="apply"]');
      const modalClose = e.target.closest('[data-action="modal-close"]');
      const modalBackdrop = e.target.closest('[data-action="modal-backdrop"]');
      
      if (navLink) {
        e.preventDefault();
        const route = navLink.getAttribute('data-route') || navLink.getAttribute('href');
        this.navigate(route);
      } else if (navLogo) {
        e.preventDefault();
        const route = navLogo.getAttribute('data-route') || navLogo.getAttribute('href');
        this.navigate(route);
      } else if (ctaButton && ctaButton.hasAttribute('data-route')) {
        e.preventDefault();
        const route = ctaButton.getAttribute('data-route');
        this.navigate(route);
      } else if (viewBtn) {
        e.preventDefault();
        const id = viewBtn.getAttribute("data-id");
        this.openModal(id);
      } else if (saveBtn) {
        e.preventDefault();
        const id = saveBtn.getAttribute("data-id");
        this.toggleSave(id);
      } else if (applyBtn) {
        e.preventDefault();
        const url = applyBtn.getAttribute("data-url");
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      } else if (modalClose || modalBackdrop) {
        e.preventDefault();
        this.closeModal();
      }
    });

    // Filters
    document.addEventListener("input", (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      if (el.matches('[data-filter="q"]')) {
        this.state.q = (/** @type {HTMLInputElement} */ (el)).value || "";
        this.rerenderIfDashboardOrSaved();
      }
    });

    document.addEventListener("change", (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      const map = {
        location: "location",
        mode: "mode",
        experience: "experience",
        source: "source",
        sort: "sort",
      };
      const key = el.getAttribute("data-filter");
      if (key && map[key]) {
        this.state[map[key]] = (/** @type {HTMLSelectElement} */ (el)).value || "All";
        this.rerenderIfDashboardOrSaved();
      }
    });

    // Modal ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.state.modalJobId) this.closeModal();
    });

    // Handle hamburger toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.setAttribute('aria-expanded', !isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.kn-nav')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinks.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  navigate(path) {
    // Prevent navigation if already on this route (no-op)
    if (window.location.pathname === path) {
      return;
    }
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    
    // Check if route exists
    const route = this.routes[path];
    
    // Update active nav link (no active link for 404 or landing page)
    if (route && path !== '/') {
      this.updateActiveNav(path);
    } else {
      this.updateActiveNav(null);
    }
    
    // Render page or 404
    const app = document.getElementById('app');
    if (app) {
      if (route) {
        app.innerHTML = route();
      } else {
        app.innerHTML = this.render404();
      }
    }
  }

  getJobs() {
    const jobs = Array.isArray(window.KN_JOBS) ? window.KN_JOBS : [];
    return jobs;
  }

  getSavedIds() {
    try {
      const raw = localStorage.getItem("kn_saved_jobs");
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  setSavedIds(set) {
    try {
      localStorage.setItem("kn_saved_jobs", JSON.stringify(Array.from(set)));
    } catch {
      // ignore
    }
  }

  toggleSave(id) {
    if (!id) return;
    const saved = this.getSavedIds();
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    this.setSavedIds(saved);
    this.rerenderIfDashboardOrSaved();
  }

  openModal(id) {
    if (!id) return;
    this.state.modalJobId = id;
    this.rerenderIfDashboardOrSaved();
  }

  closeModal() {
    this.state.modalJobId = null;
    this.rerenderIfDashboardOrSaved();
  }

  rerenderIfDashboardOrSaved() {
    const path = window.location.pathname;
    if (path === "/dashboard" || path === "/saved") this.handleRoute();
    else if (this.state.modalJobId) this.handleRoute();
  }

  formatPosted(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  uniqueOptions(field) {
    const set = new Set();
    for (const j of this.getJobs()) set.add(j[field]);
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }

  applyFilters(jobs) {
    const q = this.state.q.trim().toLowerCase();
    return jobs
      .filter((j) => {
        if (q) {
          const hay = `${j.title} ${j.company}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (this.state.location !== "All" && j.location !== this.state.location) return false;
        if (this.state.mode !== "All" && j.mode !== this.state.mode) return false;
        if (this.state.experience !== "All" && j.experience !== this.state.experience) return false;
        if (this.state.source !== "All" && j.source !== this.state.source) return false;
        return true;
      })
      .sort((a, b) => {
        if (this.state.sort === "Latest") return a.postedDaysAgo - b.postedDaysAgo; // 0 first
        if (this.state.sort === "Oldest") return b.postedDaysAgo - a.postedDaysAgo;
        if (this.state.sort === "Company A–Z") return a.company.localeCompare(b.company);
        if (this.state.sort === "Company Z–A") return b.company.localeCompare(a.company);
        return a.postedDaysAgo - b.postedDaysAgo;
      });
  }

  renderFilterBar() {
    const locations = ["All", ...this.uniqueOptions("location")];
    const modes = ["All", ...this.uniqueOptions("mode")];
    const experiences = ["All", ...this.uniqueOptions("experience")];
    const sources = ["All", ...this.uniqueOptions("source")];
    const sorts = ["Latest", "Oldest", "Company A–Z", "Company Z–A"];

    const opt = (arr, val) =>
      arr
        .map((x) => `<option value="${String(x)}"${String(x) === String(val) ? " selected" : ""}>${String(x)}</option>`)
        .join("");

    return `
      <div class="kn-filterbar">
        <div class="kn-filterbar__row">
          <div class="kn-filterbar__field kn-filterbar__field--wide">
            <label class="kn-filterbar__label" for="kn-q">Search</label>
            <input id="kn-q" class="kn-input" data-filter="q" type="text" placeholder="Title or company" value="${this.escapeHtml(
              this.state.q
            )}" />
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-location">Location</label>
            <select id="kn-location" class="kn-input" data-filter="location">${opt(locations, this.state.location)}</select>
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-mode">Mode</label>
            <select id="kn-mode" class="kn-input" data-filter="mode">${opt(modes, this.state.mode)}</select>
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-exp">Experience</label>
            <select id="kn-exp" class="kn-input" data-filter="experience">${opt(experiences, this.state.experience)}</select>
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-source">Source</label>
            <select id="kn-source" class="kn-input" data-filter="source">${opt(sources, this.state.source)}</select>
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-sort">Sort</label>
            <select id="kn-sort" class="kn-input" data-filter="sort">${opt(sorts, this.state.sort)}</select>
          </div>
        </div>
      </div>
    `;
  }

  renderJobCard(job, saved) {
    const posted = this.formatPosted(job.postedDaysAgo);
    const saveLabel = saved ? "Saved" : "Save";
    const saveKind = saved ? "secondary" : "secondary";

    return `
      <article class="kn-job-card">
        <div class="kn-job-card__top">
          <div class="kn-job-card__title-block">
            <h3 class="kn-job-card__title">${this.escapeHtml(job.title)}</h3>
            <p class="kn-job-card__meta">
              <span class="kn-job-card__company">${this.escapeHtml(job.company)}</span>
              <span class="kn-job-card__dot">•</span>
              <span>${this.escapeHtml(job.location)} · ${this.escapeHtml(job.mode)}</span>
            </p>
          </div>
          <div class="kn-job-card__badges">
            <span class="kn-badge kn-badge--neutral">${this.escapeHtml(job.source)}</span>
          </div>
        </div>

        <div class="kn-job-card__details">
          <div class="kn-job-pill">Experience: ${this.escapeHtml(job.experience)}</div>
          <div class="kn-job-pill">Salary: ${this.escapeHtml(job.salaryRange)}</div>
          <div class="kn-job-pill">Posted: ${this.escapeHtml(posted)}</div>
        </div>

        <div class="kn-job-card__actions">
          <button class="kn-btn kn-btn--secondary" data-action="view" data-id="${job.id}">View</button>
          <button class="kn-btn kn-btn--${saveKind}" data-action="save" data-id="${job.id}">${saveLabel}</button>
          <a class="kn-btn kn-btn--primary" data-action="apply" data-url="${this.escapeAttr(job.applyUrl)}" href="${this.escapeAttr(
            job.applyUrl
          )}" target="_blank" rel="noopener noreferrer">Apply</a>
        </div>
      </article>
    `;
  }

  renderModal(job) {
    if (!job) return "";
    const skills = job.skills.map((s) => `<span class="kn-skill-chip">${this.escapeHtml(s)}</span>`).join("");

    return `
      <div class="kn-modal" role="dialog" aria-modal="true">
        <div class="kn-modal__backdrop" data-action="modal-backdrop"></div>
        <div class="kn-modal__panel">
          <div class="kn-modal__header">
            <div>
              <h3 class="kn-modal__title">${this.escapeHtml(job.title)}</h3>
              <p class="kn-modal__sub">${this.escapeHtml(job.company)} — ${this.escapeHtml(job.location)} · ${this.escapeHtml(
                job.mode
              )}</p>
            </div>
            <button class="kn-btn kn-btn--ghost" data-action="modal-close">Close</button>
          </div>
          <div class="kn-modal__body">
            <div class="kn-modal__section">
              <p class="kn-modal__label">Skills</p>
              <div class="kn-skill-row">${skills}</div>
            </div>
            <div class="kn-modal__section">
              <p class="kn-modal__label">Description</p>
              <p class="kn-modal__text">${this.escapeHtml(job.description).replace(/\n/g, "<br/>")}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  escapeAttr(str) {
    return this.escapeHtml(str).replace(/`/g, "&#096;");
  }

  updateActiveNav(path) {
    const links = document.querySelectorAll('.kn-nav__link');
    links.forEach(link => {
      const linkRoute = link.getAttribute('data-route') || link.getAttribute('href');
      if (path && linkRoute === path) {
        link.classList.add('kn-nav__link--active');
      } else {
        link.classList.remove('kn-nav__link--active');
      }
    });
  }

  renderPlaceholder(title) {
    return `
      <div class="kn-page-placeholder">
        <h1 class="kn-page-placeholder__heading">${title}</h1>
        <p class="kn-page-placeholder__subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderHome() {
    return `
      <div class="kn-landing">
        <h1 class="kn-landing__headline">Stop Missing The Right Jobs.</h1>
        <p class="kn-landing__subtext">Precision-matched job discovery delivered daily at 9AM.</p>
        <button class="kn-btn kn-btn--primary kn-landing__cta" data-route="/settings">Start Tracking</button>
      </div>
    `;
  }

  renderDashboard() {
    const jobs = this.applyFilters(this.getJobs());
    const saved = this.getSavedIds();

    const body =
      jobs.length === 0
        ? `
          <div class="kn-empty">
            <p class="kn-empty__title">No results.</p>
            <p class="kn-empty__hint">Try adjusting your search or filters.</p>
          </div>
        `
        : `
          <div class="kn-job-grid">
            ${jobs.map((j) => this.renderJobCard(j, saved.has(j.id))).join("")}
          </div>
        `;

    const modalJob = this.state.modalJobId ? this.getJobs().find((j) => j.id === this.state.modalJobId) : null;

    return `
      <div class="kn-page">
        <div class="kn-page__header">
          <h1 class="kn-page__title">Dashboard</h1>
          <p class="kn-page__subtext">Browse realistic jobs. Matching and digest arrive in the next step.</p>
        </div>
        ${this.renderFilterBar()}
        ${body}
        ${this.renderModal(modalJob)}
      </div>
    `;
  }

  renderSaved() {
    const saved = this.getSavedIds();
    const jobs = this.getJobs().filter((j) => saved.has(j.id));
    const filtered = this.applyFilters(jobs);

    const body =
      filtered.length === 0
        ? `
          <div class="kn-empty">
            <p class="kn-empty__title">No saved jobs.</p>
            <p class="kn-empty__hint">Save jobs from the dashboard to see them here.</p>
          </div>
        `
        : `
          <div class="kn-job-grid">
            ${filtered.map((j) => this.renderJobCard(j, true)).join("")}
          </div>
        `;

    const modalJob = this.state.modalJobId ? this.getJobs().find((j) => j.id === this.state.modalJobId) : null;

    return `
      <div class="kn-page">
        <div class="kn-page__header">
          <h1 class="kn-page__title">Saved</h1>
          <p class="kn-page__subtext">A calm place to revisit jobs you marked for later.</p>
        </div>
        ${this.renderFilterBar()}
        ${body}
        ${this.renderModal(modalJob)}
      </div>
    `;
  }

  renderDigest() {
    return `
      <div class="kn-empty">
        <p class="kn-empty__title">No digest available.</p>
        <p class="kn-empty__hint">Your daily digest will appear here once preferences are set.</p>
      </div>
    `;
  }

  renderSettings() {
    return `
      <div class="kn-settings">
        <h1 class="kn-settings__heading">Preferences</h1>
        <form class="kn-settings__form">
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="role-keywords">Role keywords</label>
            <input type="text" id="role-keywords" class="kn-input" placeholder="e.g., Software Engineer, Product Manager" />
          </div>
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="locations">Preferred locations</label>
            <input type="text" id="locations" class="kn-input" placeholder="e.g., San Francisco, New York, Remote" />
          </div>
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="mode">Mode</label>
            <select id="mode" class="kn-input">
              <option value="">Select mode</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="experience">Experience level</label>
            <select id="experience" class="kn-input">
              <option value="">Select level</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </form>
      </div>
    `;
  }

  renderProof() {
    return `
      <div class="kn-empty">
        <p class="kn-empty__title">Proof</p>
        <p class="kn-empty__hint">Artifact collection will be available here.</p>
      </div>
    `;
  }

  render404() {
    return `
      <div class="kn-page-placeholder">
        <h1 class="kn-page-placeholder__heading">Page Not Found</h1>
        <p class="kn-page-placeholder__subtext">The page you're looking for doesn't exist.</p>
      </div>
    `;
  }
}

// Initialize router
new Router();
