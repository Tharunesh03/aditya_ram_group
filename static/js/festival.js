/* =====================================================================
   Festival celebration poster logic (frontend only — no backend).
   ---------------------------------------------------------------------
   On load, JavaScript checks today's date against window.FESTIVALS.
   If today falls inside a festival window (start <= today <= end),
   a colourful celebration poster automatically pops over the page.

   Testing tips (no server changes needed):
     ?festival=diwali      -> force-open the Diwali poster (any day)
     ?festival=holi        -> force-open the Holi poster
     ?festival=off         -> never show a poster
     ?today=2026-11-08     -> pretend today is a specific date (great for
                              testing during the real festival day)

   The date check also honours the visitor's local timezone, so the
   poster appears at the right moment in THEIR time.
   ===================================================================== */

(function () {
  "use strict";

  var FESTIVALS = window.FESTIVALS || [];

  /* ---- helpers ---- */
  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function todayLocal() {
    var d = new Date();
    return {
      y: d.getFullYear(),
      m: pad(d.getMonth() + 1),
      d: pad(d.getDate()),
    };
  }

  // 'MM-DD' -> comparable string in same year
  function monthDay(year, mmdd) {
    return year + "-" + mmdd;
  }

  /* ---- fetch query params (?festival=, ?today=, ?festival=off) ---- */
  function query(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function buildMessage(f, year) {
    var start = monthDay(year, f.start);
    var end = monthDay(year, f.end);
    var msg = f.message || (f.greeting + "!");
    var range = start === end ? start : start + " \u2192 " + end;
    return { message: msg, range: range };
  }

  /* ---- decide which festival is "active" today ---- */
  function activeFestival(f, t) {
    var year = t.y;
    var s = monthDay(year, f.start);
    var e = monthDay(year, f.end);
    var today = year + "-" + t.m + "-" + t.d;
    // a small 1-day grace keeps the poster up through the end of the day
    // and through the first hours after a late-night celebration.
    return today >= s && today <= e;
  }

  function matchFestival(todayStr) {
    var year = todayStr.slice(0, 4);
    var mmdd = todayStr.slice(5);
    for (var i = 0; i < FESTIVALS.length; i++) {
      var f = FESTIVALS[i];
      var s = monthDay(year, f.start);
      var e = monthDay(year, f.end);
      var today = year + "-" + mmdd;
      if (today >= s && today <= e) {
        var info = buildMessage(f, year);
        info.festival = f;
        info.range = s === e ? s : s + " \u2192 " + e;
        return info;
      }
    }
    return null;
  }

  /* ---- render & wire the overlay ---- */
  function makeOverlay(info) {
    var f = info.festival;
    var celebrating = false;
    var fireworks = null;

    var overlay = document.createElement("div");
    overlay.className = "festival-overlay is-open";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", f.greeting);

    var card = document.createElement("div");
    card.className = "festival-card";

    var closeBtn = document.createElement("button");
    closeBtn.className = "close-x";
    closeBtn.setAttribute("aria-label", "Close celebration");
    closeBtn.textContent = "\u00d7";

    var poster = document.createElement("div");
    poster.className = "poster";
    poster.style.backgroundImage = "url('" + f.poster + "')";

    var greet = document.createElement("div");
    greet.className = "greet";
    greet.innerHTML =
      '<span class="emoji">' + f.emoji + "</span>" +
      "<h2>" + escapeHtml(f.greeting) + "</h2>" +
      "<span>" + escapeHtml(f.name) + " \u00b7 " + info.range + "</span>";
    poster.appendChild(greet);

    var body = document.createElement("div");
    body.className = "festival-body";
    var religionChip = f.religion
      ? '<span class="chip religion-chip">' + escapeHtml(f.religion) + "</span>"
      : '<span class="chip">\u{1F4C5} ' + escapeHtml(info.range) + "</span>";
    body.innerHTML =
      "<p>" + escapeHtml(info.message) + "</p>" +
      '<div class="festival-dates">' +
      religionChip +
      '<span class="chip">\u2728 Adityaram Group wishes you joy</span>' +
      "</div>" +
      '<div class="actions">' +
      '<button class="btn btn-celebrate" data-act="celebrate">Start Celebrating \u2728</button>' +
      "</div>";

    card.appendChild(closeBtn);
    card.appendChild(poster);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function close() {
      if (fireworks) fireworks.stop();
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
    }

    closeBtn.addEventListener("click", close);
    overlay.querySelector('[data-act="celebrate"]').addEventListener("click", function () {
      var btn = this;
      if (!celebrating) {
        celebrating = true;
        overlay.classList.add("celebrating");
        // Launch festive crackers behind the poster.
        fireworks = launchFireworks();
        btn.textContent = "\uD83C\uDF86 Celebrating \u2014 Close";
        btn.classList.add("btn-close");
      } else {
        if (fireworks) fireworks.stop();
        close();
      }
    });
    // clicking the dimmed backdrop also dismisses
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    // allow escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---- festive crackers / fireworks (canvas, frontend only) ----
     Colours are derived from the brand palette (gold #e0c481,
     soft-gold #fde482, cyan #00a0d2) plus warm HSL shifts of those hues
     so the effect stays on-brand. Transient celebratory effect, not a UI
     token, so it never touches the extracted colour system.            */
  function launchFireworks() {
    // Respect users who prefer reduced motion: skip the crackers gracefully.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return { stop: function () {} };
    }

    var canvas = document.createElement("canvas");
    canvas.className = "fireworks-canvas";
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    document.body.appendChild(canvas);

    // Brand-derived festive palette (HSL shifts of the extracted gold/cyan).
    var COLORS = ["#e0c481", "#fde482", "#00a0d2", "#f5b64a", "#5ec9e6", "#fff3c4"];
    var rockets = [];
    var particles = [];
    var running = true;
    var last = performance.now();

    function spawnRocket() {
      rockets.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(Math.random() * 6 + 9),
        targetY: Math.random() * (window.innerHeight * 0.5) + 60,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      });
    }

    function explode(x, y, color) {
      var n = 55 + ((Math.random() * 40) | 0);
      for (var i = 0; i < n; i++) {
        var ang = Math.random() * Math.PI * 2;
        var speed = Math.random() * 7 + 2;
        particles.push({
          x: x, y: y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.014,
          size: 1 + Math.random() * 2.6,
          color: Math.random() < 0.3 ? "#fff3c4" : color,
        });
      }
    }

    function step(now) {
      if (!running) return;
      var dt = Math.min((now - last) / 16.7, 3);
      last = now;

      // Keep a steady supply of crackers in the air.
      if (rockets.length < 4 && Math.random() < 0.1) spawnRocket();
      if (Math.random() < 0.04) spawnRocket();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      var i;
      for (i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.15;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(r.x, r.y, 2, 2);
        if (r.vy >= -1 || r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy += 0.06;
        p.life -= p.decay * dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      window.removeEventListener("resize", resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    for (var k = 0; k < 5; k++) spawnRocket();
    requestAnimationFrame(step);
    return { stop: stop };
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function run() {
    var forced = query("festival");
    var todayOverride = query("today");
    var t = todayLocal();

    // ?festival=off disables posters for this visit
    if (forced === "off") return;

    var info = null;

    if (forced) {
      // force-open a specific festival for testing: name matched loosely
      for (var i = 0; i < FESTIVALS.length; i++) {
        if (FESTIVALS[i].id === forced || FESTIVALS[i].name.toLowerCase() === forced.toLowerCase()) {
          info = buildMessage(FESTIVALS[i], todayOverride ? todayOverride.slice(0, 4) : t.y);
          info.festival = FESTIVALS[i];
          info.range = FESTIVALS[i].start === FESTIVALS[i].end
            ? t.y + "-" + FESTIVALS[i].start
            : t.y + "-" + FESTIVALS[i].start + " \u2192 " + t.y + "-" + FESTIVALS[i].end;
          break;
        }
      }
    } else if (todayOverride) {
      info = matchFestival(todayOverride);
    } else {
      info = matchFestival(t.y + "-" + t.m + "-" + t.d);
    }

    if (info) makeOverlay(info);
  }

  // Run after the DOM is ready so the poster always appears on top.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
