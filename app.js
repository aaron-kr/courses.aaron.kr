const COURSES = [
  {
    code: "AI-501",
    universityEn: "University A",
    universityKo: "A대학교",
    titleEn: "Machine Learning Studio",
    titleKo: "머신러닝 스튜디오",
    semesterEn: "Spring 2026",
    semesterKo: "2026년 봄",
    levelEn: "Graduate",
    levelKo: "대학원",
    brandColor: "#4d8dff",
    accentColor: "#6ce4cc",
    current: true,
    featured: true,
    year: 2026
  },
  {
    code: "DS-220",
    universityEn: "University B",
    universityKo: "B대학교",
    titleEn: "Data Visualization for Decision-Making",
    titleKo: "의사결정을 위한 데이터 시각화",
    semesterEn: "Spring 2026",
    semesterKo: "2026년 봄",
    levelEn: "Undergraduate",
    levelKo: "학부",
    brandColor: "#1fb88e",
    accentColor: "#6ec8ff",
    current: true,
    featured: true,
    year: 2026
  },
  {
    code: "BUS-AI330",
    universityEn: "University C",
    universityKo: "C대학교",
    titleEn: "AI for Business Strategy",
    titleKo: "비즈니스 전략을 위한 AI",
    semesterEn: "Spring 2026",
    semesterKo: "2026년 봄",
    levelEn: "MBA",
    levelKo: "MBA",
    brandColor: "#6a5cff",
    accentColor: "#c07fff",
    current: true,
    featured: false,
    year: 2026
  },
  {
    code: "ETH-415",
    universityEn: "University D",
    universityKo: "D대학교",
    titleEn: "Data Ethics and Society",
    titleKo: "데이터 윤리와 사회",
    semesterEn: "Fall 2025",
    semesterKo: "2025년 가을",
    levelEn: "Interdisciplinary",
    levelKo: "융합",
    brandColor: "#ca7d3a",
    accentColor: "#ffd071",
    current: false,
    featured: true,
    year: 2025
  },
  {
    code: "STAT-204",
    universityEn: "University E",
    universityKo: "E대학교",
    titleEn: "Applied Statistics with Python",
    titleKo: "파이썬 기반 응용통계",
    semesterEn: "Spring 2025",
    semesterKo: "2025년 봄",
    levelEn: "Undergraduate",
    levelKo: "학부",
    brandColor: "#364dc7",
    accentColor: "#86b8ff",
    current: false,
    featured: false,
    year: 2025
  },
  {
    code: "DS-120",
    universityEn: "University F",
    universityKo: "F대학교",
    titleEn: "Programming for Analytics",
    titleKo: "분석을 위한 프로그래밍",
    semesterEn: "Fall 2024",
    semesterKo: "2024년 가을",
    levelEn: "Undergraduate",
    levelKo: "학부",
    brandColor: "#7f539f",
    accentColor: "#d8a3ff",
    current: false,
    featured: false,
    year: 2024
  }
];

const state = {
  lang: localStorage.getItem("lang") || "en",
  theme: localStorage.getItem("theme") || "dark"
};

const MOBILE_BREAKPOINT = 680;
const MAX_IMAGE_TITLE_LENGTH = 32;
const RESIZE_DEBOUNCE_MS = 120;

const getLabel = (item, lang, key) => item[`${key}${lang === "ko" ? "Ko" : "En"}`];

const svgDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${(lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed).trim()}…`;
};

const getLogoImage = (item, lang) => {
  const uni = getLabel(item, lang, "university");
  const initial = uni.trim().charAt(0).toUpperCase() || "U";
  return svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <radialGradient id="g" cx="28%" cy="26%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="${item.brandColor}" />
      </radialGradient>
    </defs>
    <rect width="120" height="120" rx="60" fill="url(#g)"/>
    <text x="60" y="73" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-weight="700" font-size="48" fill="#ffffff">${initial}</text>
  </svg>`);
};

const getFeaturedImage = (item, lang) => {
  const title = truncateText(getLabel(item, lang, "title"), MAX_IMAGE_TITLE_LENGTH);
  return svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${item.accentColor}" />
        <stop offset="100%" stop-color="${item.brandColor}" />
      </linearGradient>
    </defs>
    <rect width="640" height="360" rx="28" fill="url(#fg)" />
    <rect x="26" y="30" width="588" height="300" rx="20" fill="rgba(0,0,0,0.12)" />
    <text x="50%" y="46%" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${item.code}</text>
    <text x="50%" y="58%" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="21" fill="rgba(255,255,255,0.94)">${title}</text>
  </svg>`);
};

const createCourseCard = (item, lang) => {
  const card = document.createElement("article");
  card.className = "course-card";
  card.innerHTML = `
    <div class="course-media">
      <img class="course-logo" src="${getLogoImage(item, lang)}" alt="${getLabel(item, lang, "university")} logo" loading="lazy" />
      <img class="course-thumb" src="${getFeaturedImage(item, lang)}" alt="${getLabel(item, lang, "title")} featured image" loading="lazy" />
    </div>
    <h3>${getLabel(item, lang, "title")}</h3>
    <p>${getLabel(item, lang, "university")} · ${item.code}</p>
    <p>${getLabel(item, lang, "semester")} · ${getLabel(item, lang, "level")}</p>
    <span class="pill">${item.featured ? (lang === "ko" ? "추천" : "Featured") : (lang === "ko" ? "강의" : "Course")}</span>
  `;
  return card;
};

const createArchiveRow = (item, lang) => {
  const row = document.createElement("article");
  row.className = "archive-row";
  row.innerHTML = `
    <img class="archive-logo" src="${getLogoImage(item, lang)}" alt="${getLabel(item, lang, "university")} logo" loading="lazy" />
    <img class="archive-thumb" src="${getFeaturedImage(item, lang)}" alt="${getLabel(item, lang, "title")} featured image" loading="lazy" />
    <div class="archive-main">
      <h3>${getLabel(item, lang, "title")}</h3>
      <p>${getLabel(item, lang, "university")} · ${item.code}</p>
      <p>${getLabel(item, lang, "semester")} · ${getLabel(item, lang, "level")}</p>
    </div>
    <span class="pill">${lang === "ko" ? "아카이브" : "Archived"}</span>
  `;
  return row;
};

const applyLanguage = () => {
  document.documentElement.lang = state.lang;
  document.body.classList.toggle("lang-ko", state.lang === "ko");
  document.title = document.body.dataset[`title${state.lang === "ko" ? "Ko" : "En"}`] || document.title;

  document.querySelectorAll("[data-en][data-ko]").forEach((node) => {
    node.textContent = node.dataset[state.lang];
  });

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.textContent = state.lang === "ko" ? "EN" : "한국어";
  }
};

const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", state.theme);
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = state.theme === "dark" ? "☀️" : "🌙";
  }
};

const renderHome = () => {
  const currentContainer = document.getElementById("current-courses");
  const featuredContainer = document.getElementById("featured-courses");
  if (!currentContainer || !featuredContainer) {
    return;
  }

  currentContainer.innerHTML = "";
  featuredContainer.innerHTML = "";

  COURSES.filter((course) => course.current).forEach((course) => {
    currentContainer.appendChild(createCourseCard(course, state.lang));
  });

  COURSES.filter((course) => course.featured).forEach((course) => {
    featuredContainer.appendChild(createCourseCard(course, state.lang));
  });
};

const renderArchive = () => {
  const container = document.getElementById("archive-courses");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  const grouped = COURSES.filter((course) => !course.current).sort((a, b) => b.year - a.year);
  grouped.forEach((course) => {
    container.appendChild(createArchiveRow(course, state.lang));
  });
};

const init = () => {
  const langToggle = document.getElementById("lang-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("primary-nav");
  let resizeTimer;

  langToggle?.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "ko" : "en";
    localStorage.setItem("lang", state.lang);
    applyLanguage();
    renderHome();
    renderArchive();
  });

  themeToggle?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    applyTheme();
  });

  navToggle?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        navMenu?.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    }, RESIZE_DEBOUNCE_MS);
  });

  applyTheme();
  applyLanguage();
  renderHome();
  renderArchive();
};

init();
