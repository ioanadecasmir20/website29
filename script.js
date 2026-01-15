// script.js
(() => {
  // Mobile nav
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a link is clicked (mobile)
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Enquiry form (mailto)
  const form = document.getElementById("enquiryForm");
  const toast = document.getElementById("toast");
  const toEmail = "info@westfieldinternationalcollege.com";

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.style.display = "none";
      toast.textContent = "";
    }, 4500);
  };

  const setError = (name, message) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message || "";
  };

  const validate = (data) => {
    let ok = true;

    // Clear errors
    ["name", "email", "subject", "message"].forEach(k => setError(k, ""));

    if (!data.name || data.name.trim().length < 2) {
      setError("name", "Please enter your full name.");
      ok = false;
    }

    const email = (data.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setError("email", "Please enter a valid email address.");
      ok = false;
    }

    if (!data.subject || data.subject.trim().length < 3) {
      setError("subject", "Please add a short subject.");
      ok = false;
    }

    if (!data.message || data.message.trim().length < 10) {
      setError("message", "Please write a message (at least 10 characters).");
      ok = false;
    }

    return ok;
  };

  const encode = (s) => encodeURIComponent(String(s || ""));

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      if (!validate(data)) {
        showToast("Please fix the highlighted fields.");
        return;
      }

      const subject = data.subject.trim();
      const bodyLines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : null,
        "",
        "Message:",
        data.message
      ].filter(Boolean);

      const mailto = `mailto:${toEmail}?subject=${encode(subject)}&body=${encode(bodyLines.join("\n"))}`;

      showToast("Opening your email app to send the enquiry…");
      window.location.href = mailto;
      form.reset();
    });

    form.addEventListener("reset", () => {
      ["name", "email", "subject", "message"].forEach(k => setError(k, ""));
      if (toast) {
        toast.style.display = "none";
        toast.textContent = "";
      }
    });
  }
})();
