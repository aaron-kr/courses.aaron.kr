/* ── course data ────────────────────────────────────────────── */
const COURSES = [
  {
    code: "AI-501",
    universityEn: "University A", universityKo: "A대학교",
    titleEn: "Machine Learning Studio", titleKo: "머신러닝 스튜디오",
    semesterEn: "Spring 2026", semesterKo: "2026년 봄",
    levelEn: "Graduate", levelKo: "대학원",
    current: true, featured: true, year: 2026,
    textbookGradient: "linear-gradient(160deg,#132244 0%,#1e4080 55%,#2a5cb0 100%)",
    logoColor: "#2046a0",
    href: "#"
  },
  {
    code: "DS-220",
    universityEn: "University B", universityKo: "B대학교",
    titleEn: "Data Visualization for Decision-Making", titleKo: "의사결정을 위한 데이터 시각화",
    semesterEn: "Spring 2026", semesterKo: "2026년 봄",
    levelEn: "Undergraduate", levelKo: "학부",
    current: true, featured: true, year: 2026,
    textbookGradient: "linear-gradient(160deg,#0a2e28 0%,#0d5a4a 55%,#1a8a6e 100%)",
    logoColor: "#0d7a5c",
    href: "#"
  },
  {
    code: "BUS-AI330",
    universityEn: "University C", universityKo: "C대학교",
    titleEn: "AI for Business Strategy", titleKo: "비즈니스 전략을 위한 AI",
    semesterEn: "Spring 2026", semesterKo: "2026년 봄",
    levelEn: "MBA", levelKo: "MBA",
    current: true, featured: false, year: 2026,
    textbookGradient: "linear-gradient(160deg,#280d40 0%,#4a1a78 55%,#6a2aaa 100%)",
    logoColor: "#5a1e9a",
    href: "#"
  },
  {
    code: "ETH-415",
    universityEn: "University D", universityKo: "D대학교",
    titleEn: "Data Ethics and Society", titleKo: "데이터 윤리와 사회",
    semesterEn: "Fall 2025", semesterKo: "2025년 가을",
    levelEn: "Interdisciplinary", levelKo: "융합",
    current: false, featured: true, year: 2025,
    textbookGradient: "linear-gradient(160deg,#2e1400 0%,#6a3000 55%,#a05010 100%)",
    logoColor: "#b04010",
    href: "#"
  },
  {
    code: "STAT-204",
    universityEn: "University E", universityKo: "E대학교",
    titleEn: "Applied Statistics with Python", titleKo: "파이썬 기반 응용통계",
    semesterEn: "Spring 2025", semesterKo: "2025년 봄",
    levelEn: "Undergraduate", levelKo: "학부",
    current: false, featured: false, year: 2025,
    textbookGradient: "linear-gradient(160deg,#0d2a10 0%,#1a5a20 55%,#2a8a32 100%)",
    logoColor: "#1a7a30",
    href: "#"
  },
  {
    code: "DS-120",
    universityEn: "University F", universityKo: "F대학교",
    titleEn: "Programming for Analytics", titleKo: "분석을 위한 프로그래밍",
    semesterEn: "Fall 2024", semesterKo: "2024년 가을",
    levelEn: "Undergraduate", levelKo: "학부",
    current: false, featured: false, year: 2024,
    textbookGradient: "linear-gradient(160deg,#200a0a 0%,#501010 55%,#8a1c1c 100%)",
    logoColor: "#7a1818",
    href: "#"
  }
];

/* ── state ──────────────────────────────────────────────────── */
const state = {
  lang:           localStorage.getItem("lang")           || "en",
  theme:          localStorage.getItem("theme")          || "dark",
  homeFilter:     localStorage.getItem("homeFilter")     || "all",
  archiveFilter:  localStorage.getItem("archiveFilter")  || "all",
  showThumbnails: localStorage.getItem("thumbnails")     === "true"
};

const MOBILE_BP = 760;
const RESIZE_DEBOUNCE = 120;

/* ── helpers ────────────────────────────────────────────────── */
const gl = (item, key) => item[`${key}${state.lang === "ko" ? "Ko" : "En"}`];
const slug = (code) => `course-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/* level → filter key */
const levelKey = (levelEn) => {
  const l = levelEn.toLowerCase();
  if (l.includes("grad") || l === "mba") return "grad";
  return "ugrad";
};

/* ── DOM builders ───────────────────────────────────────────── */
const makeCourseCard = (item, withId = false) => {
  const a = document.createElement("a");
  a.className = "course-card";
  a.href = item.href || "#";
  if (withId) a.id = slug(item.code);
  if (!item.href || item.href === "#") a.setAttribute("aria-disabled", "true");

  const lk = levelKey(item.levelEn);
  const levelText = gl(item, "level");
  const isGrad = lk === "grad";

  /* thumb */
  const thumb = document.createElement("div");
  thumb.className = "course-thumb";
  thumb.style.background = item.textbookGradient;
  thumb.setAttribute("aria-hidden", "true");

  /* logo */
  const logo = document.createElement("div");
  logo.className = "uni-logo";
  logo.style.background = item.logoColor;
  logo.setAttribute("aria-hidden", "true");

  a.appendChild(thumb);

  const inner = document.createElement("span");
  inner.className = "course-code";
  inner.textContent = item.code;
  a.appendChild(inner);

  const title = document.createElement("h3");
  title.className = "course-title";
  title.textContent = gl(item, "title");
  a.appendChild(title);

  const uni = document.createElement("p");
  uni.className = "course-meta";
  uni.textContent = gl(item, "university");
  a.appendChild(uni);

  const sem = document.createElement("p");
  sem.className = "course-meta";
  sem.textContent = `${gl(item, "semester")} · ${levelText}`;
  a.appendChild(sem);

  const tags = document.createElement("div");
  tags.className = "course-tags";
  const levelTag = document.createElement("span");
  levelTag.className = `tag ${isGrad ? "grad" : "ugrad"}`;
  levelTag.textContent = levelText;
  tags.appendChild(levelTag);
  const statusTag = document.createElement("span");
  statusTag.className = item.current ? "tag current" : "tag";
  statusTag.textContent = item.current
    ? (state.lang === "ko" ? "현재" : "Current")
    : (state.lang === "ko" ? "아카이브" : "Archive");
  tags.appendChild(statusTag);
  a.appendChild(tags);

  const footer = document.createElement("div");
  footer.className = "card-footer";
  const soon = document.createElement("span");
  soon.className = "course-meta";
  soon.textContent = state.lang === "ko" ? "상세 페이지 준비 중" : "Detail page coming soon";
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  footer.appendChild(soon);
  footer.appendChild(arrow);
  a.appendChild(footer);

  a.appendChild(logo);
  return a;
};

const makeArchiveRow = (item) => {
  const a = document.createElement("a");
  a.className = "archive-row";
  a.href = item.href || "#";
  if (!item.href || item.href === "#") a.setAttribute("aria-disabled", "true");

  /* thumb */
  const thumb = document.createElement("div");
  thumb.className = "course-thumb";
  thumb.style.background = item.textbookGradient;
  thumb.setAttribute("aria-hidden", "true");

  /* right column: logo + pill */
  const right = document.createElement("div");
  right.className = "archive-right";

  const logo = document.createElement("div");
  logo.className = "uni-logo";
  logo.style.background = item.logoColor;
  logo.setAttribute("aria-hidden", "true");

  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = state.lang === "ko" ? "아카이브" : "Archived";

  right.appendChild(logo);
  right.appendChild(pill);

  const code = document.createElement("span");
  code.className = "archive-code";
  code.textContent = item.code;

  const main = document.createElement("div");
  main.className = "archive-main";
  main.innerHTML = `
    <h3>${gl(item, "title")}</h3>
    <p>${gl(item, "university")}</p>
    <p>${gl(item, "semester")} · ${gl(item, "level")}</p>
  `;

  a.appendChild(thumb);
  a.appendChild(code);
  a.appendChild(main);
  a.appendChild(right);
  return a;
};

/* ── filter bar ─────────────────────────────────────────────── */
const FILTER_SETS = {
  home: [
    { key: "all",   labelEn: "All",           labelKo: "전체" },
    { key: "grad",  labelEn: "Graduate",      labelKo: "대학원" },
    { key: "ugrad", labelEn: "Undergraduate", labelKo: "학부" }
  ],
  archive: [
    { key: "all",   labelEn: "All",           labelKo: "전체" },
    { key: "2026",  labelEn: "2026",          labelKo: "2026" },
    { key: "2025",  labelEn: "2025",          labelKo: "2025" },
    { key: "2024",  labelEn: "2024",          labelKo: "2024" },
    { key: "grad",  labelEn: "Graduate",      labelKo: "대학원" },
    { key: "ugrad", labelEn: "Undergraduate", labelKo: "학부" }
  ]
};

const renderFilterBar = (containerId, filterSet, activeKey, onSelect) => {
  const bar = document.getElementById(containerId);
  if (!bar) return;
  bar.innerHTML = "";

  const label = document.createElement("span");
  label.className = "filter-label";
  label.setAttribute("data-en", "Filter");
  label.setAttribute("data-ko", "필터");
  label.textContent = state.lang === "ko" ? "필터" : "Filter";
  bar.appendChild(label);

  FILTER_SETS[filterSet].forEach(({ key, labelEn, labelKo }) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (key === activeKey ? " active" : "");
    btn.dataset.filter = key;
    btn.textContent = state.lang === "ko" ? labelKo : labelEn;
    btn.addEventListener("click", () => {
      onSelect(key);
    });
    bar.appendChild(btn);
  });
};

/* ── thumb toggle ───────────────────────────────────────────── */
const applyThumbnails = () => {
  document.body.classList.toggle("thumbnails-visible", state.showThumbnails);
  const btn = document.getElementById("thumb-toggle");
  if (!btn) return;
  if (state.showThumbnails) {
    btn.setAttribute("data-en", "Hide thumbnails");
    btn.setAttribute("data-ko", "썸네일 숨기기");
    btn.textContent = state.lang === "ko" ? "썸네일 숨기기" : "Hide thumbnails";
  } else {
    btn.setAttribute("data-en", "Show thumbnails");
    btn.setAttribute("data-ko", "썸네일 표시");
    btn.textContent = state.lang === "ko" ? "썸네일 표시" : "Show thumbnails";
  }
};

/* ── render: home ───────────────────────────────────────────── */
const renderHome = () => {
  const container = document.getElementById("current-courses");
  if (!container) return;
  container.innerHTML = "";

  const filter = state.homeFilter;

  const filtered = COURSES.filter(c => c.current).filter(c => {
    if (filter === "all") return true;
    if (filter === "grad")  return levelKey(c.levelEn) === "grad";
    if (filter === "ugrad") return levelKey(c.levelEn) === "ugrad";
    return true;
  });

  /* group by semester */
  const groups = {};
  filtered.forEach(c => {
    const key = gl(c, "semester");
    if (!groups[key]) groups[key] = { year: c.year, courses: [] };
    groups[key].courses.push(c);
  });

  const sortedGroups = Object.entries(groups).sort(([,a],[,b]) => b.year - a.year);

  if (sortedGroups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "course-meta";
    empty.textContent = state.lang === "ko" ? "해당 조건의 강의가 없습니다." : "No courses match this filter.";
    container.appendChild(empty);
    return;
  }

  sortedGroups.forEach(([semLabel, {courses}]) => {
    const group = document.createElement("div");
    group.className = "semester-group";

    const heading = document.createElement("div");
    heading.className = "semester-heading";
    heading.innerHTML = `<span class="semester-label">${semLabel}</span><span class="semester-line"></span>`;

    const grid = document.createElement("div");
    grid.className = "course-grid";

    courses.forEach(c => grid.appendChild(makeCourseCard(c, true)));

    group.appendChild(heading);
    group.appendChild(grid);
    container.appendChild(group);
  });

  renderFilterBar("home-filter-bar", "home", state.homeFilter, (key) => {
    state.homeFilter = key;
    localStorage.setItem("homeFilter", key);
    renderHome();
  });
};

/* ── render: archive ────────────────────────────────────────── */
const renderArchive = () => {
  const container = document.getElementById("archive-courses");
  if (!container) return;
  container.innerHTML = "";

  const filter = state.archiveFilter;

  let list = COURSES.filter(c => !c.current);

  /* year filter */
  if (["2026","2025","2024"].includes(filter)) {
    list = list.filter(c => c.year === Number(filter));
  } else if (filter === "grad") {
    list = list.filter(c => levelKey(c.levelEn) === "grad");
  } else if (filter === "ugrad") {
    list = list.filter(c => levelKey(c.levelEn) === "ugrad");
  }

  list.sort((a, b) => b.year - a.year);

  /* group by semester */
  const groups = {};
  list.forEach(c => {
    const key = gl(c, "semester");
    if (!groups[key]) groups[key] = { year: c.year, courses: [] };
    groups[key].courses.push(c);
  });

  const sortedGroups = Object.entries(groups).sort(([,a],[,b]) => b.year - a.year);

  if (sortedGroups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "course-meta";
    empty.textContent = state.lang === "ko" ? "해당 조건의 강의가 없습니다." : "No courses match this filter.";
    container.appendChild(empty);
  } else {
    sortedGroups.forEach(([semLabel, {courses}]) => {
      const group = document.createElement("div");
      group.className = "semester-group";

      const heading = document.createElement("div");
      heading.className = "semester-heading";
      heading.innerHTML = `<span class="semester-label">${semLabel}</span><span class="semester-line"></span>`;

      const archiveList = document.createElement("div");
      archiveList.className = "archive-list";

      courses.forEach(c => archiveList.appendChild(makeArchiveRow(c)));

      group.appendChild(heading);
      group.appendChild(archiveList);
      container.appendChild(group);
    });
  }

  renderFilterBar("archive-filter-bar", "archive", state.archiveFilter, (key) => {
    state.archiveFilter = key;
    localStorage.setItem("archiveFilter", key);
    renderArchive();
  });
};

/* ── current-semester dropdown ──────────────────────────────── */
const renderCurrentCoursesDropdown = () => {
  document.querySelectorAll(".current-courses-dropdown").forEach(dd => {
    dd.innerHTML = "";
    COURSES.filter(c => c.current).forEach(c => {
      const link = document.createElement("a");
      link.href = `./index.html#${slug(c.code)}`;
      link.textContent = `${c.code} · ${gl(c, "title")}`;
      dd.appendChild(link);
    });
  });
};

/* ── language / theme ───────────────────────────────────────── */
const applyLanguage = () => {
  document.documentElement.lang = state.lang;
  document.body.classList.toggle("lang-ko", state.lang === "ko");
  const key = state.lang === "ko" ? "Ko" : "En";
  document.title = document.body.dataset[`title${key}`] || document.title;

  document.querySelectorAll("[data-en][data-ko]").forEach(node => {
    node.textContent = node.dataset[state.lang];
  });

  const lt = document.getElementById("lang-toggle");
  if (lt) lt.textContent = state.lang === "ko" ? "EN" : "한국어";
};

const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", state.theme);
  const tt = document.getElementById("theme-toggle");
  if (tt) tt.textContent = state.theme === "dark" ? "☀️" : "🌙";
};

/* ── nav / dropdown interaction ─────────────────────────────── */
const closeAll = () => {
  const nm = document.getElementById("primary-nav");
  const nt = document.getElementById("nav-toggle");
  nm?.classList.remove("is-open");
  nt?.setAttribute("aria-expanded", "false");
  document.querySelectorAll("[data-dropdown]").forEach(dd => {
    dd.classList.remove("open");
    dd.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
};

const setupDropdowns = () => {
  document.querySelectorAll("[data-dropdown]").forEach(dd => {
    const toggle = dd.querySelector(".dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = dd.classList.contains("open");

      /* close every other dropdown */
      document.querySelectorAll("[data-dropdown]").forEach(other => {
        other.classList.remove("open");
        other.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        dd.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* click-outside-to-close */
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-dropdown]")) {
      document.querySelectorAll("[data-dropdown].open").forEach(dd => {
        dd.classList.remove("open");
        dd.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
  });
};

/* ── init ───────────────────────────────────────────────────── */
const init = () => {
  const langToggle  = document.getElementById("lang-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle   = document.getElementById("nav-toggle");
  const navMenu     = document.getElementById("primary-nav");
  const thumbToggle = document.getElementById("thumb-toggle");
  let resizeTimer;

  langToggle?.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "ko" : "en";
    localStorage.setItem("lang", state.lang);
    applyLanguage();
    applyThumbnails();
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
    if (!open) closeAll();
  });

  /* close mobile nav when a link is clicked */
  navMenu?.addEventListener("click", e => {
    if (e.target.tagName === "A") closeAll();
  });

  thumbToggle?.addEventListener("click", () => {
    state.showThumbnails = !state.showThumbnails;
    localStorage.setItem("thumbnails", String(state.showThumbnails));
    applyThumbnails();
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_BP) closeAll();
    }, RESIZE_DEBOUNCE);
  });

  setupDropdowns();
  applyTheme();
  applyLanguage();
  applyThumbnails();
  renderHome();
  renderArchive();
  renderCurrentCoursesDropdown();

};

init();
