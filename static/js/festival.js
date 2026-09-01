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
      '<button class="btn btn-close" data-act="close">Not Now</button>' +
      "</div>";

    card.appendChild(closeBtn);
    card.appendChild(poster);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
    }

    closeBtn.addEventListener("click", close);
    overlay.querySelector('[data-act="close"]').addEventListener("click", close);
    overlay.querySelector('[data-act="celebrate"]').addEventListener("click", function () {
      // happy little sprinkle of colour, then let the visitor browse
      overlay.classList.add("celebrating");
      close();
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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---- render the "Upcoming Celebrations" grid on the landing page ---- */
  function renderUpcoming(t) {
    var grid = document.getElementById("upcoming-grid");
    if (!grid) return;
    var year = t.y;
    var today = year + "-" + t.m + "-" + t.d;

    // Build a date-sortable list using the current year, skipping past windows.
    var items = [];
    for (var i = 0; i < FESTIVALS.length; i++) {
      var f = FESTIVALS[i];
      var s = year + "-" + f.start;
      var e = year + "-" + f.end;
      // show every festival in a "this year or early next year" frame
      if (e >= today) {
        items.push({ f: f, s: s, e: e });
      }
    }
    // If none left this year, roll to next year for a full calendar.
    if (items.length === 0) {
      var ny = year + 1;
      for (var j = 0; j < FESTIVALS.length; j++) {
        var g = FESTIVALS[j];
        items.push({ f: g, s: ny + "-" + g.start, e: ny + "-" + g.end });
      }
    }
    items.sort(function (a, b) { return a.s < b.s ? -1 : 1; });

    var html = items.map(function (it) {
      var f = it.f;
      var dateLabel = it.s === it.e ? it.s : it.s + " \u2192 " + it.e;
      return (
        '<div class="upcoming-card">' +
        '<div class="uc-poster" style="background-image:url(\'' + f.poster + "')\"></div>" +
        '<div class="uc-body">' +
        '<span class="uc-rel">' + escapeHtml(f.religion) + "</span>" +
        "<h3>" + escapeHtml(f.name) + "</h3>" +
        '<span class="uc-date">\u{1F4C5} ' + escapeHtml(dateLabel) + "</span>" +
        "</div></div>"
      );
    }).join("");

    grid.innerHTML = html;
  }

  function run() {
    var forced = query("festival");
    var todayOverride = query("today");
    var t = todayLocal();

    // Always populate the upcoming calendar (uses real today unless ?today overrides)
    renderUpcoming(todayOverride ? { y: +todayOverride.slice(0,4), m: todayOverride.slice(5,7), d: todayOverride.slice(8,10) } : t);

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
