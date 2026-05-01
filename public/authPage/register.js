/* ═══════════════════════════════════════════════
   Sagar Auth — Register Page
   ═══════════════════════════════════════════════ */

import { commonPfpLinks, malePfpLinks, femalePfpLinks } from './avatars.js';

const DEFAULT_AVATAR = "https://ik.imagekit.io/yn9gz2n2g/Avatars/Common/common1.png?updatedAt=1750989714229";

let selectedAvatarUrl = DEFAULT_AVATAR;

/* ── Init multi-step ── */
const form = new MultiStepForm({
  totalSteps: 4,
  stepTitles: [
    "Basic Info",
    "Profile Picture",
    "Set Password",
    "Review & Submit",
  ],
  stepDescs: [
    "Tell us your name, age, and gender.",
    "Choose an avatar that represents you.",
    "Choose a strong password to keep your account safe.",
    "Everything look good? Submit to create your account.",
  ],
  progressId: "progressFill",
  titleId: "stepTitle",
  descId: "stepDesc",
  backBtnId: "btnBack",
  nextBtnId: "btnNext",
  stepListId: "stepList",
});

/* ── Validators ── */
form.registerValidator(1, validateStep1);
form.registerValidator(2, validateStep2);
form.registerValidator(3, validateStep3);
form.registerSubmit(submitRegistration);

/* ── Avatar Selection Logic ── */
const avatarGrid = document.getElementById("avatarGrid");
const tabMale = document.getElementById("tabMale");
const tabFemale = document.getElementById("tabFemale");

let currentTab = "male";

// Tab switching
tabMale.addEventListener("click", () => switchTab("male"));
tabFemale.addEventListener("click", () => switchTab("female"));

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".avatar-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
  renderAvatars(tab);
}

function renderAvatars(tab) {
  let avatars = [];

  if (tab === "male") {
    avatars = [...malePfpLinks, ...commonPfpLinks];
  } else if (tab === "female") {
    avatars = [...femalePfpLinks, ...commonPfpLinks];
  }

  avatarGrid.innerHTML = "";

  avatars.forEach((url) => {
    const div = document.createElement("div");
    div.className = "avatar-option";
    if (url === selectedAvatarUrl) {
      div.classList.add("selected");
    }

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Avatar option";

    div.appendChild(img);
    div.addEventListener("click", () => selectAvatar(url, div));
    avatarGrid.appendChild(div);
  });
}

function selectAvatar(url, element) {
  selectedAvatarUrl = url;
  document.getElementById("selectedAvatarPreview").src = url;
  document.getElementById("avatarPreviewReview").src = url;

  // Update selected state in grid
  document.querySelectorAll(".avatar-option").forEach(opt => {
    opt.classList.remove("selected");
  });
  element.classList.add("selected");

  clearFieldError("avatar", "avatarErr");
}

/* ── Password toggle ── */
document.getElementById("togglePassword").addEventListener("click", () => {
  const inp = document.getElementById("password");
  const isText = inp.type === "text";
  inp.type = isText ? "password" : "text";
  document.getElementById("togglePassword").innerHTML = isText
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
});

document.getElementById("toggleConfirm").addEventListener("click", () => {
  const inp = document.getElementById("confirmPassword");
  inp.type = inp.type === "text" ? "password" : "text";
});

/* ── Strength bar ── */
document.getElementById("password").addEventListener("input", () => {
  const pw = document.getElementById("password").value;
  updateStrengthBar(pw, ["s1", "s2", "s3", "s4", "s5"], "strengthLabel");
  clearFieldError("password", "passwordErr");
});

/* ── Clear-on-input hooks ── */
["firstName", "lastName"].forEach((id) => attachClearOnInput(id, id + "Err"));
attachClearOnInput("email", "emailErr");
attachClearOnInput("dob", "dobErr");
attachClearOnInput("gender", "genderErr");
attachClearOnInput("confirmPassword", "confirmPasswordErr");

/* ── Step 1 validation: name, dob, gender ── */
function validateStep1() {
  const fn = document.getElementById("firstName").value.trim();
  const ln = document.getElementById("lastName").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;

  const fnOk = fn.length >= 3 && fn.length <= 50;
  const lnOk = ln.length >= 3 && ln.length <= 50;
  const dobOk = Validators.dob(dob);
  const genderOk = gender !== "";

  setFieldError("firstName", "firstNameErr", !fnOk);
  setFieldError("lastName", "lastNameErr", !lnOk);
  setFieldError("dob", "dobErr", !dobOk);
  setFieldError("gender", "genderErr", !genderOk);

  return fnOk && lnOk && dobOk && genderOk;
}

/* ── Step 2 validation: avatar selection ── */
function validateStep2() {
  const avatarOk = selectedAvatarUrl !== null;
  setFieldError("avatar", "avatarErr", !avatarOk);
  return avatarOk;
}

/* ── Step 3 validation: email and password ── */
function validateStep3() {
  const email = document.getElementById("email").value.trim();
  const pw = document.getElementById("password").value;
  const cpw = document.getElementById("confirmPassword").value;

  const emailOk = Validators.email(email);
  const pwOk = pw.length >= 8;
  const cpwOk = pw === cpw && cpw.length > 0;

  setFieldError("email", "emailErr", !emailOk);
  setFieldError("password", "passwordErr", !pwOk);
  setFieldError("confirmPassword", "confirmPasswordErr", !cpwOk);

  return emailOk && pwOk && cpwOk;
}

/* ── Build review card ── */
function buildReview() {
  document.getElementById("avatarPreviewReview").src = selectedAvatarUrl;
  const fn = document.getElementById("firstName").value.trim();
  const ln = document.getElementById("lastName").value.trim();
  document.getElementById("reviewName").textContent = `${fn} ${ln}`;

  const dob = document.getElementById("dob").value;
  document.getElementById("reviewAge").textContent = dob
    ? new Date(dob).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  document.getElementById("reviewGender").textContent = document.getElementById("gender").value || "—";
  document.getElementById("reviewEmail").textContent = document.getElementById("email").value.trim();
  document.getElementById("reviewAvatar").textContent = "Selected avatar";
}

/* ── Navigation ── */
document.getElementById("btnNext").addEventListener("click", () => form.next());
document.getElementById("btnBack").addEventListener("click", () => form.back());

/* Override next to build review on step 4 */
const origNext = form.next.bind(form);
form.next = function () {
  if (this.current === 3) {
    if (!validateStep3()) return;
    this.current++;
    buildReview();
    this.render();
  } else {
    origNext();
  }
};

/* ── Show/hide login link on step 1 ── */
const origRender = form.render.bind(form);
form.render = function () {
  origRender();
  const loginLinkWrapper = document.getElementById("loginLinkWrapper");
  if (this.current === 1) {
    loginLinkWrapper.style.display = "block";
  } else {
    loginLinkWrapper.style.display = "none";
  }
};

/* ── Submit ── */
async function submitRegistration() {
  hideApiError("apiError");
  const btn = document.getElementById("btnNext");
  btn.disabled = true;
  const spinner = document.getElementById("submitSpinner");
  if (spinner) spinner.classList.add("visible");

  try {
    const payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      dateOfBirth: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      avatarUrl: selectedAvatarUrl,
    };

    const res = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle error response format: { success: false, error: { code, message, status, details } }
      const errorMessage = data.error?.message || data.message || `Error ${res.status}`;
      const errorDetails = data.error?.details || [];

      // If there are validation details, show them
      if (errorDetails.length > 0) {
        const detailMessages = errorDetails.map(d => d.message || d).join(", ");
        throw new Error(detailMessages);
      }

      throw new Error(errorMessage);
    }

    // Success response format: { success: true, code: "CREATED", status: 201, message, data: { authorizationCode } }
    form.hideForm();
    document.getElementById("successScreen").classList.add("visible");
    document.getElementById("successEmail").textContent = document.getElementById("email").value.trim();
  } catch (e) {
    showApiError(
      "apiError",
      "apiErrorText",
      e.message || "Something went wrong. Please try again.",
    );
    btn.disabled = false;
    if (spinner) spinner.classList.remove("visible");
  }
}

/* ── Init ── */
form.render();

// Pre-render avatars based on default tab (male)
renderAvatars("male");
