/* =====================================================================
   Dark / light theme toggle (frontend only, no backend).
   ---------------------------------------------------------------------
   - Reads the user's saved choice from localStorage (defaults to the
     system preference via prefers-color-scheme on first visit).
   - Applies data-theme="dark" | "light" on <html>.
   - Updates the toggle button icon and label.
   - Has no flash-of-wrong-theme: an inline script in the <head> sets the
     attribute before the page paints.
   ===================================================================== */

(function () {
  "use strict";

  var KEY = "adityaram-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var ico = document.getElementById("theme-ico");
  var label = document.getElementById("theme-label");

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function apply(theme, save) {
    root.setAttribute("data-theme", theme);
    if (save) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
    }
    updateButton(theme);
  }

  function updateButton(theme) {
    if (!btn) return;
    var dark = theme === "dark";
    ico.textContent = dark ? "🌙" : "☀️";
    label.textContent = dark ? "Dark" : "Light";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  // Initial theme: saved value, else system preference, else light.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  var initial = saved === "dark" || saved === "light"
    ? saved
    : (systemPrefersDark() ? "dark" : "light");
  apply(initial, false);

  if (btn) {
    btn.addEventListener("click", function () {
      apply(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }
})();
