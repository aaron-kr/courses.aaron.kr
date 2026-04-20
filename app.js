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

const getLabel = (item, lang, key) => item[`${key}${lang === "ko" ? "Ko" : "En"}`];

const createCourseCard = (item, lang) => {
  const card = document.createElement("article");
  card.className = "course-card";
  card.innerHTML = `
    <h3>${getLabel(item, lang, "title")}</h3>
    <p>${getLabel(item, lang, "university")} · ${item.code}</p>
    <p>${getLabel(item, lang, "semester")} · ${getLabel(item, lang, "level")}</p>
    <span class="pill">${item.featured ? (lang === "ko" ? "추천" : "Featured") : (lang === "ko" ? "강의" : "Course")}</span>
  `;
  return card;
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
    container.appendChild(createCourseCard(course, state.lang));
  });
};

const init = () => {
  const langToggle = document.getElementById("lang-toggle");
  const themeToggle = document.getElementById("theme-toggle");

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

  applyTheme();
  applyLanguage();
  renderHome();
  renderArchive();
};

init();
