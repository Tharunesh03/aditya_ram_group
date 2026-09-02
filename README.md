# Adityaram Group — Celebration-Aware Landing Website

A frontend-only recreation of **www.adityaramgroup.com**, built with **Flask** used
purely as a static web server (no database, no business backend). The site's real
feature: **on any festival day it automatically shows a colourful celebration poster**
the moment a visitor opens the page.

> Everything follows the extracted brand system: colours `#e0c481` / `#00a0d2` /
> `#fde482` + the neutral greys, Open Sans + Times New Roman typography, the spacing
> scale, 1px / 10px radii, and the friendly third-person brand voice.

---

## 1. Run it

```bash
# create a virtual environment once
python3 -m venv .venv
source .venv/bin/activate

# install the single dependency
pip install -r requirements.txt

# start the site
python app.py
```

Then open **http://127.0.0.1:5000** (or the live preview URL Arena gives you).

---

## 2. Project structure

```
aditya_ram_group/
├── app.py                 # Flask entry — serves the single landing page
├── requirements.txt       # Flask only
├── templates/
│   └── index.html         # the one-page marketing site
└── static/
    ├── css/style.css      # brand styles (tokens as CSS custom properties)
    ├── js/
    │   ├── festival-data.js   # ★ ALL festival dates + poster paths live here
    │   └── festival.js        # detects today, shows the poster overlay
    ├── img/               # hero / about / project placeholder artwork
    └── festivals/         # ★ celebration poster images (one per festival)
```

---

## 3. How the celebration poster works

`festival.js` runs in the browser. On page load it compares **today's local date**
against the festival windows in `festival-data.js`. If today falls inside a window
`start <= today <= end`, it pops a full-screen, colourful poster over the page with
a brand greeting, the date range, and friendly buttons.

It is **frontend only** — no server round-trip, no database. The date is taken from
the **visitor's own timezone**, so the poster appears at the right moment for them.

---

## 4. ★ How to ADD / EDIT a festival celebration poster

This is the part you asked about. Two files:

### Step A — add the poster image

Drop your poster into:

```
static/festivals/<name>.jpg
```

Use a **landscape** image, ideally **1280×720 or larger**. Leave the image **free of
text** — the greeting is drawn by the site in HTML, so it stays crisp and matches the
brand. You can use any of the included ones as a template (e.g. `static/festivals/diwali.jpg`).

### Step B — register the festival

Open **`static/js/festival-data.js`** and add an object to the `window.FESTIVALS` array.
Example:

```js
{
  religion: "Hindu",               // faith group shown as a chip on the poster
  id: "diwali",                    // short slug, also used to force-test
  name: "Diwali",                  // Title Case heading on the poster
  emoji: "🪔",                     // friendly symbol
  poster: "/static/festivals/diwali.jpg", // path to your image
  greeting: "Happy Diwali",        // big headline (brand voice)
  message: "Wishing you a festival of lights filled with joy, prosperity and happiness.", // one-line welcome
  start: "11-06",                  // window start  MM-DD  (recurring each year)
  end: "11-11",                    // window end    MM-DD  (inclusive)
}
```

Save, and reload the site — it appears automatically on those dates.

### Religions covered

The site ships with **40 festivals across every faith**: Hindu (Pongal, Holi,
Maha Shivaratri, Ugadi, Onam, Raksha Bandhan, Janmashtami, Ganesh Chaturthi, Navratri,
Dussehra, Diwali, …), Muslim (Eid-ul-Fitr, Eid-ul-Adha, Milad-un-Nabi), Christian
(Good Friday, Easter, Christmas), Sikh (Guru Gobind Singh Jayanti, Baisakhi, Gurpurab),
Buddhist (Buddha Purnima), Jain (Mahavir Jayanti), and National (New Year, Republic Day,
Independence Day, Gandhi Jayanti). Each appears as a colourful poster automatically on its day.

### Very important — dates move every year

Lunar festivals (Hindu, Muslim, Buddhist, Jain) shift year to year, so the dates bundled
here are **accurate for 2026** (cross-checked against the Economic Times, astroyogi and
hindutone 2026 calendars). Moon-sighted festivals (Eid) are tentative until the moon is
seen. Each new year, just update the `start` / `end` strings in the entry you care about —
the site never hard-codes a "current year"; it compares today's `MM-DD` against the windows,
so changing those two numbers is all you do.

---

## 5. Testing the poster without waiting for a festival

No server changes needed — the JS reads the URL. Open these anywhere:

| URL (`?festival=...`)          | What happens                              |
| ------------------------------ | ----------------------------------------- |
| `/?festival=diwali`            | Force-open the Diwali poster (any day)    |
| `/?festival=holi`              | Force-open the Holi poster                |
| `/?festival=off`               | Never show a poster on this visit         |
| `/?today=2026-11-08`           | Pretend today is Diwali — auto detection  |
| `/?today=2026-03-04`           | Pretend today is Holi                     |

Use these to preview each poster before the real day arrives.

---

## 6. Layout / responsiveness

> Note: The landing page no longer includes an "Upcoming Celebrations" grid. The
> celebration auto-display poster (see §3) is untouched — it still appears on each
> festival day. If you want a browsable calendar back, re-add a section that reads
> the same `window.FESTIVALS` array.

- Every image sits in a fixed-ratio frame and is **absolutely positioned with
  `object-fit: cover`**, so photos fill their frame edge-to-edge with no blank gaps
  (this fixed the founder photo leaving a large empty gap below it).
- Grids (companies, awards, honours, upcoming) collapse gracefully across
  `1100px / 900px / 640px` breakpoints; section padding tightens on mobile so there
  is no excessive whitespace. No external CSS framework — everything is hand-written.

## 7. Brand notes / deviations

- **Poster images** — AI-generated decorative backgrounds matching the brand's
  festival gold/cyan palette. The greeting text is rendered in HTML (not baked into
  the image) so it stays sharp and accessible.
- **Website / founder / award images** — `static/img/*` now uses real photography:
  genuine Mr. Adityaram founder portraits (`founder-*.jpg`), the real Galatta Crown
  2022 event moment (`award-galatta.jpg`), and real Adityaram property/project
  photography for the Group of Companies and Honours cards, plus the hero/about
  images. These were sourced from the public web and resized/optimised to keep the
  site light. Replace any of them with your own high-res assets — no code changes
  needed as long as you keep the same filenames.
- **`OpenSans-Light`** — mapped to Open Sans with the light/regular/600/700 weights
  available from Google Fonts; the light weight is approximated by the `400` weight with
  normal letter-spacing (closest available per the extracted family list).
- **`Sifonn-Basic`** — a brand display font not publicly hosted, so it's referenced but
  the fallback is Arial / Times New Roman per the extraction.
- **Form** — the contact form is a frontend-only demo (no backend, no data saved), since
  you asked for no backend. It just shows a friendly confirmation.

---

## 8. Licence

Educational clone for learning purposes. All brand names, copy and company references
belong to Adityaram Group. This project is not affiliated with the company.
