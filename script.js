/* ============================================================
   Sarvesh Khanal — Portfolio scripts (vanilla JS, no build step)
   1. Terminal typing animation
   2. Mobile nav toggle
   3. Active nav link on scroll
   4. Contact form (mailto fallback)
   5. Footer year
   ============================================================ */

/* ---------- 1. Terminal typing animation ---------- */
(function typeIntro() {
  var el = document.getElementById("typed");
  if (!el) return;

  // Each line: { text, cls, pause } — cls "cmd" is green, "out" is muted grey.
  var lines = [
    { text: "> whoami", cls: "cmd" },
    { text: "sarvesh_khanal :: entry-level cybersecurity analyst", cls: "out" },
    { text: "> cat focus.txt", cls: "cmd" },
    { text: "SIEM monitoring | log analysis | endpoint threat detection", cls: "out" },
    { text: "> status --availability", cls: "cmd" },
    { text: "OPEN TO SOC ANALYST ROLES / INTERNSHIPS — Kathmandu, Nepal", cls: "out" }
  ];

  // Reduced motion: render everything instantly.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.innerHTML = lines.map(function (l) {
      return '<span class="' + l.cls + '">' + l.text + "</span>";
    }).join("\n");
    return;
  }

  var lineIndex = 0;
  var charIndex = 0;
  var current = null;

  function step() {
    if (lineIndex >= lines.length) return;

    var line = lines[lineIndex];
    if (!current) {
      current = document.createElement("span");
      current.className = line.cls;
      if (lineIndex > 0) el.appendChild(document.createTextNode("\n"));
      el.appendChild(current);
    }

    current.textContent = line.text.slice(0, ++charIndex);

    if (charIndex >= line.text.length) {
      lineIndex++;
      charIndex = 0;
      current = null;
      setTimeout(step, 420); // pause between lines
    } else {
      setTimeout(step, line.cls === "cmd" ? 45 : 18);
    }
  }

  setTimeout(step, 350);
})();

/* ---------- 2. Mobile nav toggle ---------- */
(function mobileNav() {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after tapping a link (mobile).
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- 3. Active nav link + nav shadow on scroll ---------- */
(function scrollSpy() {
  var nav = document.getElementById("nav");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);

    var pos = window.scrollY + 120;
    var activeIndex = -1;
    sections.forEach(function (sec, i) {
      if (sec.offsetTop <= pos) activeIndex = i;
    });
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === activeIndex); });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- 4. Contact form ----------
   No backend: submitting opens the visitor's mail client with the message
   pre-filled. To use a real service (Formspree, Getform, Basin):
     - set the <form> action to your endpoint and method="POST"
     - remove data-mailto="true" from the <form> so this handler steps aside
-------------------------------------------- */
(function contactForm() {
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (!form || form.dataset.mailto !== "true") return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = "! all fields are required";
      status.classList.add("is-error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "! please enter a valid email address";
      status.classList.add("is-error");
      return;
    }

    status.classList.remove("is-error");
    status.textContent = "> opening your email client...";

    var subject = encodeURIComponent("Portfolio contact from " + name);
    var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = "mailto:khanal.sarvesh@gmail.com?subject=" + subject + "&body=" + body;
  });
})();

/* ---------- 5. Footer year ---------- */
(function year() {
  var el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
})();
