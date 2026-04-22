const TERMS = ["Spring", "Summer", "Fall", "Winter"];

// Edit this list to match your real history. Each item becomes a card.
const COURSES = [
  {
    year: 2026,
    term: "Spring",
    code: "CS 4XX",
    title: "Machine Learning Systems",
    level: "Graduate",
    desc: "Systems for training/serving, evaluation, reproducibility, and responsible deployment.",
    site: "#",
    syllabus: "#",
    repo: "#",
    notes: "New",
  },
  {
    year: 2025,
    term: "Fall",
    code: "CS 3XX",
    title: "Deep Learning",
    level: "Undergrad/Grad",
    desc: "Representation learning, optimization, architectures, and practical training techniques.",
    site: "#",
    syllabus: "#",
    repo: "#",
    notes: "Popular",
  },
  {
    year: 2025,
    term: "Spring",
    code: "CS 2XX",
    title: "Algorithms",
    level: "Undergraduate",
    desc: "Design and analysis with rigorous proofs + implementation-oriented problem sets.",
    site: "#",
    syllabus: "#",
    repo: "#",
  },
  {
    year: 2024,
    term: "Fall",
    code: "CS 5XX",
    title: "Security & Privacy for ML",
    level: "Graduate",
    desc: "Threat models, privacy leakage, poisoning, robust training, and evaluation.",
    site: "#",
    syllabus: "#",
    repo: "#",
  },
  {
    year: 2024,
    term: "Spring",
    code: "Seminar",
    title: "AI Research Reading Group",
    level: "Graduate",
    desc: "Weekly paper discussion: foundations → scaling → alignment → evaluation.",
    site: "#",
    syllabus: "#",
    repo: "#",
    notes: "Seminar",
  },
  {
    year: 2023,
    term: "Fall",
    code: "CS 1XX",
    title: "Intro to Programming",
    level: "Undergraduate",
    desc: "Python fundamentals, debugging habits, testing, and clean code basics.",
    site: "#",
    syllabus: "#",
    repo: "#",
  },
];

function uniq(arr) {
  return Array.from(new Set(arr));
}

function normalize(str) {
  return (str ?? "").toString().trim().toLowerCase();
}

function courseMatchesQuery(course, q) {
  if (!q) return true;
  const hay = normalize(
    [
      course.year,
      course.term,
      course.code,
      course.title,
      course.level,
      course.desc,
      course.notes,
    ].join(" ")
  );
  return hay.includes(normalize(q));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderCourseCard(course) {
  const card = el("article", "card");

  const top = el("div", "card__top");
  const left = el("div");
  const badge = el("div", "badge", `${course.term} ${course.year}`);
  if (course.notes) badge.title = course.notes;

  const code = el("p", "card__code", course.code);
  const title = el("h3", "card__title");
  const titleLink = el("a");
  titleLink.href = course.site || "#";
  titleLink.textContent = course.title;
  title.appendChild(titleLink);

  left.appendChild(code);
  left.appendChild(title);
  top.appendChild(left);
  top.appendChild(badge);

  const desc = el("p", "card__desc", course.desc);

  const meta = el("div", "card__meta");
  const metaLeft = el("div", "meta", course.level);
  const links = el("div", "links");

  const linkDefs = [
    ["Site", course.site],
    ["Syllabus", course.syllabus],
    ["Repo", course.repo],
  ].filter(([, href]) => href);

  for (const [label, href] of linkDefs) {
    const a = el("a");
    a.href = href;
    a.textContent = label;
    a.rel = "noopener";
    links.appendChild(a);
  }

  meta.appendChild(metaLeft);
  meta.appendChild(links);

  card.appendChild(top);
  card.appendChild(desc);
  card.appendChild(meta);

  return card;
}

function populateFilters({ yearSelect, termSelect, courses }) {
  const years = uniq(courses.map((c) => c.year)).sort((a, b) => b - a);

  yearSelect.replaceChildren();
  termSelect.replaceChildren();

  yearSelect.appendChild(new Option("All", "all"));
  for (const y of years) yearSelect.appendChild(new Option(String(y), String(y)));

  termSelect.appendChild(new Option("All", "all"));
  for (const t of TERMS) termSelect.appendChild(new Option(t, t));
}

function applyFilters({ courses, q, year, term }) {
  return courses
    .filter((c) => (year === "all" ? true : String(c.year) === String(year)))
    .filter((c) => (term === "all" ? true : c.term === term))
    .filter((c) => courseMatchesQuery(c, q))
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return TERMS.indexOf(b.term) - TERMS.indexOf(a.term);
    });
}

function main() {
  const grid = document.getElementById("courseGrid");
  const q = document.getElementById("q");
  const year = document.getElementById("year");
  const term = document.getElementById("term");
  const reset = document.getElementById("reset");

  const shownCount = document.getElementById("shownCount");
  const totalCount = document.getElementById("totalCount");
  const emptyState = document.getElementById("emptyState");
  const yearNow = document.getElementById("yearNow");

  yearNow.textContent = String(new Date().getFullYear());
  totalCount.textContent = String(COURSES.length);

  populateFilters({ yearSelect: year, termSelect: term, courses: COURSES });

  function rerender() {
    const filtered = applyFilters({
      courses: COURSES,
      q: q.value,
      year: year.value,
      term: term.value,
    });

    grid.replaceChildren(...filtered.map(renderCourseCard));
    shownCount.textContent = String(filtered.length);
    emptyState.hidden = filtered.length > 0;
  }

  const rerenderDebounced = debounce(rerender, 90);

  q.addEventListener("input", rerenderDebounced);
  year.addEventListener("change", rerender);
  term.addEventListener("change", rerender);
  reset.addEventListener("click", () => {
    q.value = "";
    year.value = "all";
    term.value = "all";
    rerender();
    q.focus();
  });

  rerender();
}

function debounce(fn, delayMs) {
  let t = null;
  return (...args) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delayMs);
  };
}

document.addEventListener("DOMContentLoaded", main);

