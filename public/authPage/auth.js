/* ═══════════════════════════════════════════════
   Sagar Auth — Shared JS Utilities
   ═══════════════════════════════════════════════ */

/* ── Validation helpers ── */
const Validators = {
  required: (v) => v.trim().length > 0,
  minLen: (v, n) => v.trim().length >= n,
  maxLen: (v, n) => v.trim().length <= n,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  url: (v) => {
    try {
      const u = new URL(v);
      return u.protocol === "https:";
    } catch {
      return false;
    }
  },
  dob: (v) => {
    if (!v) return false;
    const d = new Date(v);
    const now = new Date();
    const age = (now - d) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 0 && age <= 120;
  },
  password: (v) => v.length >= 8,
  match: (v, other) => v === other,
};

/* ── Field error display ── */
function setFieldError(inputId, errId, hasError) {
  const el = document.getElementById(inputId);
  const er = document.getElementById(errId);
  if (!el || !er) return;
  el.classList.toggle("error", hasError);
  er.classList.toggle("visible", hasError);
}

function clearFieldError(inputId, errId) {
  setFieldError(inputId, errId, false);
}

/* ── Inline clear-on-input ── */
function attachClearOnInput(inputId, errId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.addEventListener("input", () => clearFieldError(inputId, errId));
}

/* ── Password strength ── */
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

const STRENGTH_COLORS = [
  "#3f3f46",
  "#f87171",
  "#fbbf24",
  "#fbbf24",
  "#34d399",
  "#34d399",
];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Fair", "Strong", "Very strong"];

function updateStrengthBar(pw, segIds, labelId) {
  const s = calcStrength(pw);
  segIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.background = i < s ? STRENGTH_COLORS[s] : "var(--surface3)";
  });
  const lbl = document.getElementById(labelId);
  if (lbl) {
    lbl.textContent = pw.length === 0 ? "" : STRENGTH_LABELS[s];
    lbl.style.color = STRENGTH_COLORS[s];
  }
}

/* ── API call helper ── */
async function apiPost(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

/* ── Show API error banner ── */
function showApiError(bannerId, textId, msg) {
  const b = document.getElementById(bannerId);
  const t = document.getElementById(textId);
  if (b && t) {
    t.textContent = msg;
    b.classList.add("visible");
  }
}
function hideApiError(bannerId) {
  const b = document.getElementById(bannerId);
  if (b) b.classList.remove("visible");
}

/* ── Multi-step controller ── */
class MultiStepForm {
  constructor({
    totalSteps,
    stepTitles,
    stepDescs,
    progressId,
    titleId,
    descId,
    backBtnId,
    nextBtnId,
    stepListId,
    stepPrefix = "step",
  }) {
    this.total = totalSteps;
    this.titles = stepTitles;
    this.descs = stepDescs;
    this.current = 1;
    this.progressId = progressId;
    this.titleId = titleId;
    this.descId = descId;
    this.backBtnId = backBtnId;
    this.nextBtnId = nextBtnId;
    this.stepListId = stepListId;
    this.prefix = stepPrefix;
    this.validators = {}; // step -> fn()
    this.onSubmit = null;
  }

  registerValidator(step, fn) {
    this.validators[step] = fn;
  }
  registerSubmit(fn) {
    this.onSubmit = fn;
  }

  validate() {
    const fn = this.validators[this.current];
    return fn ? fn() : true;
  }

  next() {
    if (!this.validate()) return;
    if (this.current < this.total) {
      this.current++;
      this.render();
    } else {
      if (this.onSubmit) this.onSubmit();
    }
  }

  back() {
    if (this.current > 1) {
      this.current--;
      this.render();
    }
  }

  render() {
    // Step panels
    for (let i = 1; i <= this.total; i++) {
      const el = document.getElementById(`${this.prefix}${i}`);
      if (el) el.classList.toggle("active", i === this.current);
    }
    // Left step list
    const list = document.getElementById(this.stepListId);
    if (list) {
      list.querySelectorAll(".step-item").forEach((li) => {
        const s = +li.dataset.step;
        li.className =
          "step-item " +
          (s === this.current
            ? "active"
            : s < this.current
              ? "done"
              : "pending");
        const num = li.querySelector(".step-num");
        if (num) num.textContent = s < this.current ? "✓" : s;
      });
    }
    // Progress
    const prog = document.getElementById(this.progressId);
    if (prog) prog.style.width = `${(this.current / this.total) * 100}%`;
    // Title / desc
    const titleEl = document.getElementById(this.titleId);
    const descEl = document.getElementById(this.descId);
    if (titleEl) titleEl.textContent = this.titles[this.current - 1];
    if (descEl) descEl.textContent = this.descs[this.current - 1];
    // Buttons
    const back = document.getElementById(this.backBtnId);
    const next = document.getElementById(this.nextBtnId);
    if (back) back.style.display = this.current > 1 ? "inline-flex" : "none";
    if (next) {
      if (this.current === this.total) {
        next.innerHTML = `Create account <div class="spinner" id="submitSpinner"></div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      } else {
        next.innerHTML = `Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    }
  }

  hideForm() {
    for (let i = 1; i <= this.total; i++) {
      const el = document.getElementById(`${this.prefix}${i}`);
      if (el) el.classList.remove("active");
    }
    const actions = document.getElementById("actions");
    if (actions) actions.style.display = "none";
    const prog = document.getElementById(this.progressId);
    if (prog) prog.style.width = "100%";
    const list = document.getElementById(this.stepListId);
    if (list)
      list.querySelectorAll(".step-item").forEach((li) => {
        li.className = "step-item done";
        const num = li.querySelector(".step-num");
        if (num) num.textContent = "✓";
      });
  }
}
