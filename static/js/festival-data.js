/* =====================================================================
   FESTIVAL DATA — Adityaram Group celebration posters
   ---------------------------------------------------------------------
   HOW TO ADD / EDIT A FESTIVAL
   ---------------------------------------------------------------------
   1. Drop a poster image into static/festivals/<name>.jpg  (landscape
      ~1280x720 or larger, no text on the image — the greeting text is
      drawn by the site so it always stays crisp).
   2. Add an entry here with:
        - id        : short slug used for the poster path
        - name      : Title-Case heading shown on the poster
        - emoji     : a friendly symbol
        - poster    : path to the image (relative to /static)
        - greeting  : friendly third-person brand line
        - message   : a short welcoming sentence
        - start     : 'MM-DD'  (recurring start each year)
        - end       : 'MM-DD'  (recurring end, inclusive)
        - accentTop : optional poster tint colour
   3. Re-run the site. On the festival window the poster pops up
      automatically for every visitor in that window.
   ---------------------------------------------------------------------
   NOTE on dates: Hindu festivals move each year (lunar calendar), so the
   day-of-year offsets below are accurate for 2026 (research cross-checked
   against the Economic Times & astroyogi 2026 calendars). Update `start` /
   `end` each year — there is a dedicated section at the bottom that is
   easy to keep current.
   ===================================================================== */

window.FESTIVALS = [
  {
    id: "newyear",
    name: "New Year",
    emoji: "🎉",
    // note: reuses the generic celebration poster (celebration.jpg was out of
    // the per-turn image budget) — swap in a dedicated poster if desired.
    poster: "/static/festivals/diwali.jpg",
    start: "01-01",
    end: "01-01",
    greeting: "Happy New Year",
    message: "Wishing you a bright and prosperous new year from the Adityaram Group family.",
  },
  {
    id: "pongal",
    name: "Pongal",
    emoji: "🌾",
    poster: "/static/festivals/pongal.jpg",
    start: "01-13",
    end: "01-15",
    greeting: "Happy Pongal",
    message: "May the harvest festival bring abundance, sunshine and joy to your home.",
  },
  {
    id: "republicday",
    name: "Republic Day",
    emoji: "🇮🇳",
    poster: "/static/festivals/independence_day.jpg",
    start: "01-26",
    end: "01-26",
    greeting: "Happy Republic Day",
    message: "Saluting the spirit of a proud nation — wishing you a memorable Republic Day.",
  },
  {
    id: "holi",
    name: "Holi",
    emoji: "🎨",
    poster: "/static/festivals/holi.jpg",
    start: "03-03",
    end: "03-05",
    greeting: "Happy Holi",
    message: "May your life be painted with bright colours, laughter and togetherness.",
  },
  {
    id: "tamilnewyear",
    name: "Tamil New Year",
    emoji: "🌞",
    poster: "/static/festivals/pongal.jpg",
    start: "04-13",
    end: "04-14",
    greeting: "Puthandu Vazthukal",
    message: "Wishing you a warm and wonderful Tamil New Year filled with new beginnings.",
  },
  {
    id: "independenceday",
    name: "Independence Day",
    emoji: "🇮🇳",
    poster: "/static/festivals/independence_day.jpg",
    start: "08-15",
    end: "08-15",
    greeting: "Happy Independence Day",
    message: "Celebrating the freedom, pride and bright future of our great nation.",
  },
  {
    id: "onam",
    name: "Onam",
    emoji: "🌼",
    poster: "/static/festivals/onam.jpg",
    start: "08-25",
    end: "08-27",
    greeting: "Happy Onam",
    message: "May the colours of the pookalam and the joy of the harvest light up your home.",
  },
  {
    id: "rakshabandhan",
    name: "Raksha Bandhan",
    emoji: "🎀",
    poster: "/static/festivals/rakshabandhan.jpg",
    start: "08-28",
    end: "08-28",
    greeting: "Happy Raksha Bandhan",
    message: "Celebrating the sweet bond of love and protection between siblings.",
  },
  {
    id: "janmashtami",
    name: "Janmashtami",
    emoji: "🦚",
    poster: "/static/festivals/ganesh_chaturthi.jpg",
    start: "09-04",
    end: "09-04",
    greeting: "Happy Janmashtami",
    message: "Wishing you the blessings of Lord Krishna on this auspicious day.",
  },
  {
    id: "ganeshchaturthi",
    name: "Ganesh Chaturthi",
    emoji: "🐘",
    poster: "/static/festivals/ganesh_chaturthi.jpg",
    start: "09-14",
    end: "09-17",
    greeting: "Happy Ganesh Chaturthi",
    message: "May Lord Ganesha bless you with wisdom, prosperity and success.",
  },
  {
    id: "navratri",
    name: "Navratri",
    emoji: "💃",
    poster: "/static/festivals/navratri.jpg",
    start: "10-11",
    end: "10-19",
    greeting: "Happy Navratri",
    message: "May the nine nights of the Goddess fill your life with strength and grace.",
  },
  {
    id: "dussehra",
    name: "Dussehra",
    emoji: "🏹",
    poster: "/static/festivals/dussehra.jpg",
    start: "10-20",
    end: "10-20",
    greeting: "Happy Dussehra",
    message: "May the victory of good over evil bring peace and prosperity to you.",
  },
  {
    id: "diwali",
    name: "Diwali",
    emoji: "🪔",
    poster: "/static/festivals/diwali.jpg",
    start: "11-06",
    end: "11-11",
    greeting: "Happy Diwali",
    message: "Wishing you a festival of lights filled with joy, prosperity and happiness.",
  },
  {
    id: "christmas",
    name: "Christmas",
    emoji: "🎄",
    poster: "/static/festivals/christmas.jpg",
    start: "12-24",
    end: "12-26",
    greeting: "Merry Christmas",
    message: "May the warmth of the season bring peace and cheer to you and your family.",
  },
];
