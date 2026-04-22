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
    current: false,
    featured: false,
    year: 2024
  }
];

const state = {
  lang: localStorage.getItem("lang") || "en",
  theme: localStorage.getItem("theme") || "dark"
};

const MOBILE_BREAKPOINT = 760;
const RESIZE_DEBOUNCE_MS = 120;

const getLabel = (item, lang, key) => item[`${key}${lang === "ko" ? "Ko" : "En"}`];
const slugCourse = (code) => `course-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const createCourseCard = (item, lang, withId = false) => {
  const card = document.createElement("article");
  card.className = "course-card";
  if (withId) {
    card.id = slugCourse(item.code);
  }

  const levelText = getLabel(item, lang, "level");
  const isGrad = levelText.toLowerCase().includes("grad") || levelText.includes("대학원") || levelText.includes("MBA");

  card.innerHTML = `
    <span class="course-code">${item.code}</span>
    <h3 class="course-title">${getLabel(item, lang, "title")}</h3>
    <p class="course-meta">${getLabel(item, lang, "university")}</p>
    <p class="course-meta">${getLabel(item, lang, "semester")} · ${levelText}</p>
    <div class="course-tags">
      <span class="tag ${isGrad ? "grad" : "ugrad"}">${levelText}</span>
      ${item.current ? `<span class="tag current">${lang === "ko" ? "현재" : "Current"}</span>` : `<span class="tag">${lang === "ko" ? "아카이브" : "Archive"}</span>`}
    </div>
    <div class="card-footer">
      <span class="course-meta">${lang === "ko" ? "상세 페이지 준비 중" : "Detail page coming soon"}</span>
      <span class="card-arrow" aria-hidden="true">→</span>
    </div>
  `;
  return card;
};

const createArchiveRow = (item, lang) => {
  const row = document.createElement("article");
  row.className = "archive-row";
  row.innerHTML = `
    <span class="archive-code">${item.code}</span>
    <div class="archive-main">
      <h3>${getLabel(item, lang, "title")}</h3>
      <p>${getLabel(item, lang, "university")}</p>
      <p>${getLabel(item, lang, "semester")} · ${getLabel(item, lang, "level")}</p>
    </div>
    <span class="pill">${lang === "ko" ? "아카이브" : "Archived"}</span>
  `;
  return row;
};

const renderCurrentCoursesDropdown = () => {
  const dropdown = document.getElementById("current-courses-dropdown");
  if (!dropdown) {
    return;
  }

  dropdown.innerHTML = "";
  COURSES.filter((course) => course.current).forEach((course) => {
    const link = document.createElement("a");
    link.href = `./index.html#${slugCourse(course.code)}`;
    link.textContent = `${course.code} · ${getLabel(course, state.lang, "title")}`;
    dropdown.appendChild(link);
  });
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

const closeNavAndDropdowns = () => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("primary-nav");

  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");

  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
};

const setupDropdowns = () => {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", (event) => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        return;
      }

      event.preventDefault();
      const wasOpen = dropdown.classList.contains("open");
      document.querySelectorAll("[data-dropdown]").forEach((menu) => {
        menu.classList.remove("open");
        menu.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
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
    currentContainer.appendChild(createCourseCard(course, state.lang, true));
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
  COURSES
    .filter((course) => !course.current)
    .sort((a, b) => b.year - a.year)
    .forEach((course) => {
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
    renderCurrentCoursesDropdown();
  });

  themeToggle?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    applyTheme();
  });

  navToggle?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(Boolean(open)));
    if (!open) {
      closeNavAndDropdowns();
    }
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNavAndDropdowns();
    });
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeNavAndDropdowns();
      }
    }, RESIZE_DEBOUNCE_MS);
  });

  setupDropdowns();
  applyTheme();
  applyLanguage();
  renderHome();
  renderArchive();
  renderCurrentCoursesDropdown();
};

init();
