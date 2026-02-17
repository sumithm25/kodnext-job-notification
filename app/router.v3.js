/**
 * Job Notification Tracker — Router
 * Simple client-side router using History API
 */

class Router {
  constructor() {
    this.routes = {
      '/': this.renderDigest.bind(this),
      '/dashboard': this.renderDashboard.bind(this),
      '/saved': this.renderSaved.bind(this),
      '/digest': this.renderDigest.bind(this),
      '/settings': this.renderSettings.bind(this),
      '/proof': this.renderProof.bind(this),
      '/jt/07-test': this.renderTest.bind(this),
      '/jt/08-ship': this.renderShip.bind(this)
    };

    this.state = {
      // filters
      q: "",
      location: "All",
      mode: "All",
      experience: "All",
      source: "All",
      statusFilter: "All",
      sort: "Latest",
      // toggle
      showMatchesOnly: false,
      // preferences (persisted)
      preferences: this.loadPreferences(),
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
      } else if (e.target.closest('[data-action="generate-digest"]')) {
        e.preventDefault();
        this.generateDigest();
      } else if (e.target.closest('[data-action="copy-digest"]')) {
        e.preventDefault();
        this.copyDigestToClipboard();
      } else if (e.target.closest('[data-action="email-digest"]')) {
        e.preventDefault();
        this.createEmailDraft();
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

      // Match Score Slider (Settings)
      if (el.id === "minMatchScore") {
        const val = (/** @type {HTMLInputElement} */ (el)).value;
        document.getElementById("scoreValue").textContent = val;
        this.savePreferencesFromForm();
      }
    });

    document.addEventListener("change", (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;

      // Filter Bar Dropdowns
      const map = {
        location: "location",
        mode: "mode",
        experience: "experience",
        source: "source",
        statusFilter: "statusFilter",
        sort: "sort",
      };
      const key = el.getAttribute("data-filter");
      if (key && map[key]) {
        this.state[map[key]] = (/** @type {HTMLSelectElement} */ (el)).value || "All";
        this.rerenderIfDashboardOrSaved();
      }

      // Toggle Matches Only
      if (el.id === "kn-toggle-matches") {
        this.state.showMatchesOnly = (/** @type {HTMLInputElement} */ (el)).checked;
        this.rerenderIfDashboardOrSaved();
      }

      // Settings Inputs (Auto-save)
      if (el.closest('.kn-settings__form')) {
        this.savePreferencesFromForm();
      }
      // Status Change
      if (el.classList.contains('kn-status-select')) {
        const id = parseInt(el.getAttribute('data-id'), 10);
        const newStatus = el.value;
        this.setStatus(id, newStatus);
      }

      // Test Checklist Toggle
      if (el.classList.contains('kn-check-input')) {
        const key = el.getAttribute('data-key');
        this.setTestStatus(key, el.checked);
      }
    });

    // Reset Test Button
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="reset-test"]')) {
        this.resetTestStatus();
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

  getStatus(jobId) {
    try {
      const raw = localStorage.getItem("jobTrackerStatus");
      const statusMap = raw ? JSON.parse(raw) : {};
      return statusMap[jobId] || "Not Applied";
    } catch {
      return "Not Applied";
    }
  }

  setStatus(jobId, status) {
    try {
      const raw = localStorage.getItem("jobTrackerStatus");
      const statusMap = raw ? JSON.parse(raw) : {};
      statusMap[jobId] = status;
      localStorage.setItem("jobTrackerStatus", JSON.stringify(statusMap));

      // Find job details for logging
      const job = this.getJobs().find(j => j.id === jobId);
      if (job) this.logStatusUpdate(job, status);

      this.rerenderIfDashboardOrSaved();
    } catch (e) {
      console.error("Failed to set status", e);
    }
  }

  logStatusUpdate(job, status) {
    if (status === "Not Applied") return; // Don't log reset
    try {
      const raw = localStorage.getItem("jobTrackerUpdates");
      const updates = raw ? JSON.parse(raw) : [];

      const newUpdate = {
        title: job.title,
        company: job.company,
        status: status,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: Date.now()
      };

      // Add to top, keep last 5
      updates.unshift(newUpdate);
      const trimmed = updates.slice(0, 5);

      localStorage.setItem("jobTrackerUpdates", JSON.stringify(trimmed));

      // Simple toast
      alert(`Status updated to: ${status}`);
    } catch (e) {
      console.error("Failed to log update", e);
    }
  }

  getRecentUpdates() {
    try {
      const raw = localStorage.getItem("jobTrackerUpdates");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
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

  loadPreferences() {
    try {
      const raw = localStorage.getItem("jobTrackerPreferences");
      return {
        roleKeywords: "Developer, Engineer, Software",
        preferredLocations: "Bengaluru, Remote",
        preferredMode: ["Remote", "Hybrid", "On-site"],
        experienceLevel: "Fresher",
        skills: "JavaScript, Python, React",
        minMatchScore: 40
      };
    } catch {
      return {
        roleKeywords: "Developer, Engineer, Software",
        preferredLocations: "Bengaluru, Remote",
        preferredMode: ["Remote", "Hybrid", "On-site"],
        experienceLevel: "Fresher",
        skills: "JavaScript, Python, React",
        minMatchScore: 40
      };
    }
  }

  savePreferencesFromForm() {
    const form = document.querySelector('.kn-settings__form');
    if (!form) return;

    const roleKeywords = document.getElementById('roleKeywords').value;
    const preferredLocations = document.getElementById('preferredLocations').value;
    const experienceLevel = document.getElementById('experienceLevel').value;
    const skills = document.getElementById('skills').value;
    const minMatchScore = parseInt(document.getElementById('minMatchScore').value, 10);

    const modeCheckboxes = document.querySelectorAll('input[name="preferredMode"]:checked');
    const preferredMode = Array.from(modeCheckboxes).map(cb => cb.value);

    this.state.preferences = {
      roleKeywords,
      preferredLocations,
      preferredMode,
      experienceLevel,
      skills,
      minMatchScore
    };

    localStorage.setItem("jobTrackerPreferences", JSON.stringify(this.state.preferences));
  }

  calculateMatchScore(job) {
    let score = 0;
    const p = this.state.preferences;

    // 1. Role Match (+25)
    if (p.roleKeywords) {
      const keywords = p.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
      const titleLower = job.title.toLowerCase();
      if (keywords.some(k => titleLower.includes(k))) score += 25;
    }

    // 2. Description Match (+15)
    if (p.roleKeywords) {
      const keywords = p.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
      const descLower = job.description.toLowerCase();
      if (keywords.some(k => descLower.includes(k))) score += 15;
    }

    // 3. Location Match (+15)
    if (p.preferredLocations) {
      const locs = p.preferredLocations.toLowerCase().split(',').map(l => l.trim()).filter(l => l);
      if (locs.some(l => job.location.toLowerCase().includes(l))) score += 15;
    }

    // 4. Mode Match (+10)
    if (p.preferredMode.length > 0) {
      if (p.preferredMode.some(m => m.toLowerCase() === job.mode.toLowerCase())) score += 10;
    }

    // 5. Experience Match (+10)
    if (p.experienceLevel) {
      // Simple string match for MVP
      if (job.experience.toLowerCase() === p.experienceLevel.toLowerCase()) score += 10;
    }

    // 6. Skill Overlap (+15)
    if (p.skills) {
      const userSkills = p.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
      const jobSkills = job.skills.map(s => s.toLowerCase());
      if (userSkills.some(us => jobSkills.includes(us))) score += 15;
    }

    // 7. Freshness (+5)
    if (job.postedDaysAgo <= 2) score += 5;

    // 8. Source (+5)
    if (job.source === "LinkedIn") score += 5;

    return Math.min(score, 100);
  }

  getMatchBadge(score) {
    let colorClass = "grey";
    if (score >= 80) colorClass = "green";
    else if (score >= 60) colorClass = "amber";
    else if (score >= 40) colorClass = "neutral";

    return `<span class="kn-match-badge kn-match-badge--${colorClass}">${score}% Match</span>`;
  }

  applyFilters(jobs) {
    const q = this.state.q.trim().toLowerCase();

    // First, map jobs to include score for sorting/filtering
    const scoredJobs = jobs.map(j => ({ ...j, _score: this.calculateMatchScore(j) }));

    return scoredJobs
      .filter((j) => {
        // Status Filter
        const status = this.getStatus(j.id);
        if (this.state.statusFilter !== "All" && status !== this.state.statusFilter) return false;

        // Text Search
        if (q) {
          const hay = `${j.title} ${j.company}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        // Dropdown Filters
        if (this.state.location !== "All" && j.location !== this.state.location) return false;
        if (this.state.mode !== "All" && j.mode !== this.state.mode) return false;
        if (this.state.experience !== "All" && j.experience !== this.state.experience) return false;
        if (this.state.source !== "All" && j.source !== this.state.source) return false;

        // Show Only Matches Toggle
        if (this.state.showMatchesOnly) {
          if (j._score < this.state.preferences.minMatchScore) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (this.state.sort === "Latest") return a.postedDaysAgo - b.postedDaysAgo;
        if (this.state.sort === "Match Score") return b._score - a._score; // Descending
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
    const statuses = ["All", "Not Applied", "Applied", "Rejected", "Selected"];
    const sorts = ["Latest", "Match Score", "Oldest", "Company A–Z", "Company Z–A"];

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
            <label class="kn-filterbar__label" for="kn-status">Status</label>
            <select id="kn-status" class="kn-input" data-filter="statusFilter">${opt(statuses, this.state.statusFilter)}</select>
          </div>
          <div class="kn-filterbar__field">
            <label class="kn-filterbar__label" for="kn-sort">Sort</label>
            <select id="kn-sort" class="kn-input" data-filter="sort">${opt(sorts, this.state.sort)}</select>
          </div>
        </div>
        
        <div class="kn-filterbar__row kn-filterbar__row--secondary">
             <div class="kn-toggle-wrapper">
                <input type="checkbox" id="kn-toggle-matches" class="kn-toggle-input" ${this.state.showMatchesOnly ? 'checked' : ''}>
                <label for="kn-toggle-matches" class="kn-toggle-label">Show only jobs above my threshold</label>
             </div>
        </div>
      </div>
    `;
  }

  renderJobCard(job, saved) {
    const posted = this.formatPosted(job.postedDaysAgo);
    const saveLabel = saved ? "Saved" : "Save";
    const saveKind = saved ? "secondary" : "secondary";
    const matchBadge = this.getMatchBadge(job._score || 0);

    const status = this.getStatus(job.id);
    let statusColor = "neutral";
    if (status === "Applied") statusColor = "blue";
    if (status === "Rejected") statusColor = "red";
    if (status === "Selected") statusColor = "green";

    const statusOptions = ["Not Applied", "Applied", "Rejected", "Selected"]
      .map(s => `<option value="${s}" ${s === status ? "selected" : ""}>${s}</option>`)
      .join("");

    return `
      <article class="kn-job-card">
        <div class="kn-job-card__top">
          <div class="kn-job-card__title-block">
            <div class="kn-job-card__header-row">
                 <h3 class="kn-job-card__title">${this.escapeHtml(job.title)}</h3>
                 ${matchBadge}
            </div>
            <p class="kn-job-card__meta">
              <span class="kn-job-card__company">${this.escapeHtml(job.company)}</span>
              <span class="kn-job-card__dot">•</span>
              <span>${this.escapeHtml(job.location)} · ${this.escapeHtml(job.mode)}</span>
            </p>
          </div>
          </div>
          <div class="kn-job-card__badges">
            <select class="kn-status-select kn-status-select--${statusColor}" data-id="${job.id}">
                ${statusOptions}
            </select>
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

  getTodayString() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  getDigest() {
    try {
      const key = `jobTrackerDigest_${this.getTodayString()}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  generateDigest() {
    const jobs = this.getJobs();

    // Calculate scores with current preferences
    const scoredJobs = jobs.map(j => ({ ...j, _score: this.calculateMatchScore(j) }));

    // Filter out jobs with 0 score (completely irrelevant)
    const candidates = scoredJobs.filter(j => j._score > 0);

    // Sort: 1) Score Desc, 2) Posted Days Ago Asc
    candidates.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return a.postedDaysAgo - b.postedDaysAgo;
    });

    // Top 10
    const digest = candidates.slice(0, 10);

    // Persist
    const key = `jobTrackerDigest_${this.getTodayString()}`;
    try {
      localStorage.setItem(key, JSON.stringify(digest));
    } catch (e) {
      console.error("Failed to save digest", e);
    }

    this.handleRoute(); // Re-render
  }

  copyDigestToClipboard() {
    const digest = this.getDigest();
    if (!digest) return;

    const text = digest.map(j =>
      `${j.title} at ${j.company}\nLocation: ${j.location}\nMatch: ${j._score}%\nLink: ${j.applyUrl}\n`
    ).join('\n---\n\n');

    navigator.clipboard.writeText(`Here is your custom Job Digest for ${this.getTodayString()}:\n\n${text}`)
      .then(() => alert("Digest copied to clipboard!"))
      .catch(err => console.error(err));
  }

  // --- Test Checklist System ---

  getTestStatus() {
    try {
      const raw = localStorage.getItem("jobTrackerTestStatus");
      // Default: 10 false flags
      const defaultStatus = {
        prefPersist: false,
        matchCalc: false,
        showMatches: false,
        saveJob: false,
        applyOpen: false,
        statusPersist: false,
        statusFilter: false,
        digestGen: false,
        digestPersist: false,
        noConsole: false
      };
      return raw ? { ...defaultStatus, ...JSON.parse(raw) } : defaultStatus;
    } catch {
      return {};
    }
  }

  setTestStatus(key, value) {
    const status = this.getTestStatus();
    status[key] = value;
    localStorage.setItem("jobTrackerTestStatus", JSON.stringify(status));
    this.handleRoute(); // Re-render to update progress
  }

  resetTestStatus() {
    localStorage.removeItem("jobTrackerTestStatus");
    this.handleRoute();
  }

  renderTest() {
    const status = this.getTestStatus();
    const keys = Object.keys(status);
    const passedCount = Object.values(status).filter(Boolean).length;
    const progressPercent = (passedCount / keys.length) * 100;

    const checklistItems = [
      { key: 'prefPersist', label: 'Preferences persist after refresh', hint: 'Change settings, reload page, check if kept.' },
      { key: 'matchCalc', label: 'Match score calculates correctly', hint: 'Check if job scores align with your profile.' },
      { key: 'showMatches', label: '"Show only matches" toggle works', hint: 'Toggle it and verify low scores disappear.' },
      { key: 'saveJob', label: 'Save job persists after refresh', hint: 'Save a job, reload, check Saved tab.' },
      { key: 'applyOpen', label: 'Apply opens in new tab', hint: 'Click Apply, ensure new tab opens.' },
      { key: 'statusPersist', label: 'Status update persists after refresh', hint: 'Change status, reload, verify.' },
      { key: 'statusFilter', label: 'Status filter works correctly', hint: 'Filter by "Applied" and check results.' },
      { key: 'digestGen', label: 'Digest generates top 10 by score', hint: 'Verify digest logic in "Daily Digest".' },
      { key: 'digestPersist', label: 'Digest persists for the day', hint: 'Reload page, digest should be same.' },
      { key: 'noConsole', label: 'No console errors on main pages', hint: 'F12 > Console. Should be clean.' }
    ];

    const rows = checklistItems.map(item => `
          <label class="kn-check-item ${status[item.key] ? 'checked' : ''}">
              <input type="checkbox" class="kn-check-input" data-key="${item.key}" ${status[item.key] ? 'checked' : ''}>
              <div>
                  <div class="kn-check-label">${item.label}</div>
                  <div class="kn-check-hint">${item.hint}</div>
              </div>
          </label>
      `).join('');

    return `
        <div class="kn-page">
           <div class="kn-page__header">
             <h1 class="kn-page__title">Test Checklist</h1>
             <p class="kn-page__subtext">Verify all features before shipping.</p>
           </div>

           <div class="kn-checklist-header">
               <div style="display:flex; justify-content:space-between; align-items:center;">
                   <div style="font-weight:700; font-size:18px;">Tests Passed: ${passedCount} / ${keys.length}</div>
                   <button class="kn-btn kn-btn--secondary" data-action="reset-test" style="font-size:11px;">Reset Status</button>
               </div>
               <div class="kn-checklist-progress">
                   <div class="kn-progress-bar">
                       <div class="kn-progress-fill" style="width: ${progressPercent}%"></div>
                   </div>
                   <div class="kn-progress-text">${Math.round(progressPercent)}%</div>
               </div>
               ${passedCount < 10 ? '<div style="margin-top:12px; color:#c62828; font-size:13px; font-weight:500;">Resolve all issues before shipping.</div>' : ''}
           </div>

           <div class="kn-checklist-grid">
               ${rows}
           </div>
        </div>
      `;
  }

  renderShip() {
    const status = this.getTestStatus();
    const allPassed = Object.values(status).every(Boolean) && Object.keys(status).length === 10;

    if (!allPassed) {
      return `
            <div class="kn-page">
                 <div class="kn-page__header">
                   <h1 class="kn-page__title">Locked</h1>
                 </div>
                 <div class="kn-locked-overlay">
                     <div class="kn-lock-icon">🔒</div>
                     <h2 style="font-size:20px; color:#333; margin-bottom:8px;">Pre-flight Checks Incomplete</h2>
                     <p style="max-width:400px; margin-bottom:24px;">You must complete the entire checkslist at <a href="/jt/07-test" data-route="/jt/07-test" style="color:var(--kn-accent)">/jt/07-test</a> before you can access the shipping screen.</p>
                     <button class="kn-btn kn-btn--secondary" data-route="/jt/07-test">Go to Checklist</button>
                 </div>
            </div>
          `;
    }

    return `
        <div class="kn-page">
             <div class="kn-ship-success">
                 <div class="kn-ship-icon">🚀</div>
                 <h1 style="font-size:32px; font-family:'Georgia', serif; font-weight:700; margin-bottom:16px; color:#1b5e20;">Ready for Takeoff!</h1>
                 <p style="font-size:18px; color:#555; max-width:600px; margin:0 auto 32px;">All systems operational. The application has passed all verification checks and is ready to be shipped to production.</p>
                 <div style="display:flex; gap:16px; justify-content:center;">
                     <a href="/" data-route="/" class="kn-btn kn-btn--primary" style="padding:12px 24px;">Launch App</a>
                 </div>
             </div>
        </div>
      `;
  }

  createEmailDraft() {
    const digest = this.getDigest();
    if (!digest) return;

    const subject = encodeURIComponent(`My 9AM Job Digest - ${this.getTodayString()}`);

    const bodyText = digest.map(j =>
      `${j.title} at ${j.company}%0D%0ALocation: ${j.location}%0D%0AMatch: ${j._score}%%0D%0ALink: ${j.applyUrl}%0D%0A`
    ).join('%0D%0A---%0D%0A%0D%0A');

    const body = `Here is your custom Job Digest for ${this.getTodayString()}:%0D%0A%0D%0A${bodyText}`;

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  renderDigest() {
    // 1. Check Preferences
    const p = this.state.preferences;
    const hasPreferences = p.roleKeywords || p.preferredLocations || p.experienceLevel;

    if (!hasPreferences) {
      return `
        <div class="kn-empty">
          <p class="kn-empty__title">Preferences Required</p>
          <p class="kn-empty__hint">Set your job preferences to generate a personalized digest.</p>
          <div class="kn-empty-state-actions">
             <button class="kn-btn kn-btn--primary" data-route="/settings">Set Preferences</button>
          </div>
        </div>
      `;
    }

    // 2. Check for Existing Digest
    const digest = this.getDigest();

    if (digest) {
      return this.renderDigestUI(digest);
    }

    // 3. Show "Generate" State
    return `
      <div class="kn-empty">
        <p class="kn-empty__title">Your 9AM Digest is Ready</p>
        <p class="kn-empty__hint">We found matches based on your profile.</p>
        <div class="kn-empty-state-actions">
           <button class="kn-btn kn-btn--primary" data-action="generate-digest">Generate Today's 9AM Digest (Simulated)</button>
        </div>
        <span class="kn-digest-simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</span>
      </div>
    `;
  }

  renderDigestUI(digest) {
    if (!digest || digest.length === 0) {
      return `
            <div class="kn-empty">
                <p class="kn-empty__title">No matching roles today.</p>
                <p class="kn-empty__hint">Try adjusting your preferences or check again tomorrow.</p>
                 <div class="kn-empty-state-actions">
                   <button class="kn-btn kn-btn--secondary" data-action="generate-digest">Regenerate</button>
                </div>
            </div>
        `;
    }

    const items = digest.map(job => `
        <div class="kn-digest-item">
            <div class="kn-digest-item__head">
                <div>
                     <div class="kn-digest-item__title">${this.escapeHtml(job.title)}</div>
                     <div class="kn-digest-item__company">${this.escapeHtml(job.company)}</div>
                </div>
                <div class="kn-digest-item__scora">${job._score}%</div>
            </div>
            <div class="kn-digest-item__meta">
                ${this.escapeHtml(job.location)} · ${this.escapeHtml(job.experience)}
            </div>
            <div style="margin-top:8px;">
                 <a href="${this.escapeAttr(job.applyUrl)}" target="_blank" class="kn-btn kn-btn--primary" style="font-size:12px; padding: 4px 12px;">Apply Now</a>
            </div>
        </div>
    `).join('');

    const updates = this.getRecentUpdates();
    const updatesHTML = `
      <div class="kn-digest-updates">
          <div class="kn-digest-updates__title">Recent Status Updates</div>
          ${updates.length === 0
        ? '<div class="kn-digest-update-item" style="color:#999; font-style:italic; justify-content:center;">No updates yet. Change a job status on the Dashboard to see it here.</div>'
        : updates.map(u => `
              <div class="kn-digest-update-item">
                  <div>
                      <span style="font-weight:600">${this.escapeHtml(u.title)}</span>
                      <span style="color:#666"> at ${this.escapeHtml(u.company)}</span>
                  </div>
                  <div>
                      <span class="kn-digest-update-status ${u.status}">${u.status}</span>
                      <span style="color:#999; font-size:11px; margin-left:8px;">${u.date}</span>
                  </div>
              </div>
          `).join('')}
      </div>
    `;

    return `
      <div class="kn-page">
         <div class="kn-page__header">
           <h1 class="kn-page__title">Daily Digest</h1>
           <p class="kn-page__subtext">Top 10 jobs curated for you.</p>
         </div>

         <div class="kn-digest-container">
            <div class="kn-digest-header">
                <div class="kn-digest-title">Your 9AM Digest</div>
                <div class="kn-digest-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            <div class="kn-digest-body">
                ${items}
            </div>
            ${updatesHTML}
            <div class="kn-digest-footer">
                This digest was generated based on your preferences.
                <div class="kn-digest-actions">
                    <button class="kn-btn kn-btn--secondary" data-action="copy-digest">Copy Digest to Clipboard</button>
                    <button class="kn-btn kn-btn--secondary" data-action="email-digest">Create Email Draft</button>
                </div>
            </div>
         </div>
         <p style="text-align:center;" class="kn-digest-simulation-note">Digest persisted for today.</p>
      </div>
    `;
  }

  renderSettings() {
    const p = this.state.preferences;

    const isMode = (val) => p.preferredMode.includes(val) ? "checked" : "";
    const isExp = (val) => p.experienceLevel === val ? "selected" : "";

    return `
      <div class="kn-settings">
        <h1 class="kn-settings__heading">Preferences</h1>
        <p class="kn-settings__subtext">Set your criteria to enable intelligent match scoring.</p>
        
        <form class="kn-settings__form" onsubmit="return false;">
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="roleKeywords">Role Keywords (comma separated)</label>
            <input type="text" id="roleKeywords" class="kn-input" placeholder="e.g., Software Engineer, Product Manager" value="${this.escapeHtml(p.roleKeywords)}" />
          </div>
          
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="preferredLocations">Preferred Locations (comma separated)</label>
            <input type="text" id="preferredLocations" class="kn-input" placeholder="e.g., Bengaluru, Remote" value="${this.escapeHtml(p.preferredLocations)}" />
          </div>
          
          <div class="kn-form-field">
            <label class="kn-form-field__label">Preferred Mode</label>
            <div class="kn-checkbox-group">
                <label class="kn-checkbox"><input type="checkbox" name="preferredMode" value="Remote" ${isMode("Remote")}> Remote</label>
                <label class="kn-checkbox"><input type="checkbox" name="preferredMode" value="Hybrid" ${isMode("Hybrid")}> Hybrid</label>
                <label class="kn-checkbox"><input type="checkbox" name="preferredMode" value="Onsite" ${isMode("Onsite")}> Onsite</label>
            </div>
          </div>
          
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="experienceLevel">Experience Level</label>
            <select id="experienceLevel" class="kn-input">
              <option value="">Select level</option>
              <option value="Fresher" ${isExp("Fresher")}>Fresher</option>
              <option value="0-1" ${isExp("0-1")}>0-1 Years</option>
              <option value="1-3" ${isExp("1-3")}>1-3 Years</option>
              <option value="3-5" ${isExp("3-5")}>3-5 Years</option>
            </select>
          </div>
          
          <div class="kn-form-field">
            <label class="kn-form-field__label" for="skills">My Skills (comma separated)</label>
            <input type="text" id="skills" class="kn-input" placeholder="e.g., React, Python, Java" value="${this.escapeHtml(p.skills)}" />
          </div>

          <div class="kn-form-field">
            <label class="kn-form-field__label" for="minMatchScore">Minimum Match Score Threshold: <span id="scoreValue" style="color:var(--kn-accent); font-weight:600;">${p.minMatchScore}</span></label>
            <input type="range" id="minMatchScore" class="kn-slider" min="0" max="100" value="${p.minMatchScore}" />
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
