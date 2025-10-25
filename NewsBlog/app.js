// app.js — Pure front-end JS demo
// Data model: array of article objects
// Fields: title, slug, excerpt, content, author, category, image, views, publishedAt (ISO), isBreaking (bool)

const DEFAULT_LIMIT = 6;

const sampleArticles = [
  {
    title: "Govt unveils new infrastructure plan",
    slug: "infrastructure-plan-2025",
    excerpt: "A multi-year plan focuses on transport and clean energy projects across states.",
    content: "<p>The government announced a comprehensive infrastructure plan...</p>",
    author: "A. Sharma",
    category: "National",
    image: "https://picsum.photos/id/1015/800/500",
    views: 321,
    publishedAt: "2025-10-21T08:30:00Z",
    isBreaking: true
  },
  {
    title: "Global markets recover after central bank move",
    slug: "markets-recover-oct-2025",
    excerpt: "Stocks rallied as central banks signaled a pause in rate hikes.",
    content: "<p>Markets reacted positively to the announcement...</p>",
    author: "E. Rao",
    category: "Business",
    image: "https://picsum.photos/id/1023/800/500",
    views: 512,
    publishedAt: "2025-10-20T12:00:00Z",
    isBreaking: false
  },
  {
    title: "Breakthrough in battery tech promises longer range",
    slug: "battery-tech-advances",
    excerpt: "Researchers developed a battery with improved density and safety.",
    content: "<p>Researchers at a university demonstrated...</p>",
    author: "Tech Desk",
    category: "Tech",
    image: "https://picsum.photos/id/1037/800/500",
    views: 214,
    publishedAt: "2025-10-18T09:00:00Z",
    isBreaking: false
  },
  {
    title: "National cricket team announces squad for series",
    slug: "cricket-squad-2025",
    excerpt: "A mix of youth and experience will travel for the upcoming series.",
    content: "<p>The selectors announced a 15-player squad...</p>",
    author: "Sports Desk",
    category: "Sports",
    image: "https://picsum.photos/id/1005/800/500",
    views: 1500,
    publishedAt: "2025-10-19T14:00:00Z",
    isBreaking: false
  },
  {
    title: "Diplomatic talks ease tensions in region",
    slug: "diplomatic-talks-2025",
    excerpt: "Leaders held mediated discussions leading to a cooling of hostilities.",
    content: "<p>High level talks resulted in a joint statement...</p>",
    author: "I. Khan",
    category: "International",
    image: "https://picsum.photos/id/1043/800/500",
    views: 890,
    publishedAt: "2025-10-17T18:30:00Z",
    isBreaking: false
  },
  {
    title: "Startup raises $25M to scale electric buses",
    slug: "electric-buses-funding",
    excerpt: "Funding will be used to expand manufacturing and R&D.",
    content: "<p>The startup focuses on zero-emission public transport...</p>",
    author: "Business Desk",
    category: "Business",
    image: "https://picsum.photos/id/1056/800/500",
    views: 420,
    publishedAt: "2025-10-15T10:00:00Z",
    isBreaking: false
  },
  {
    title: "Local festivals draw record crowds",
    slug: "festival-crowds-2025",
    excerpt: "A surge in domestic travel saw many events overflow with visitors.",
    content: "<p>Organizers reported record attendance...</p>",
    author: "Culture Desk",
    category: "National",
    image: "https://picsum.photos/id/1062/800/500",
    views: 190,
    publishedAt: "2025-10-14T09:30:00Z",
    isBreaking: false
  },
  {
    title: "AI tool speeds medical image analysis",
    slug: "ai-medical-imaging",
    excerpt: "New models reduce time-to-diagnose for certain conditions.",
    content: "<p>Doctors say the tool helps in early detection...</p>",
    author: "Health Desk",
    category: "Tech",
    image: "https://picsum.photos/id/1074/800/500",
    views: 325,
    publishedAt: "2025-10-13T08:00:00Z",
    isBreaking: false
  }
];

// State
let articles = [...sampleArticles];
let filtered = [];
let currentCategory = "All";
let currentSearch = "";
let currentSort = "latest";
let cursorIndex = 0; // simple cursor: index into filtered
let limit = DEFAULT_LIMIT;

// DOM handles
const app = document.getElementById("app");
const trendingList = document.getElementById("trendingList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const uploadFile = document.getElementById("uploadFile");
const uploadStatus = document.getElementById("uploadStatus");
const yearEl = document.getElementById("year");
const breakingTicker = document.getElementById("breakingTicker");
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

// Utils
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function renderHero(article) {
  return `
    <div class="hero" role="region" aria-label="Top story">
      <img src="${article.image}" alt="${escapeHTML(article.title)}" loading="lazy" />
      <div class="hero-body">
        <div>
          <div class="badge">${article.category}</div>
          <h2><a href="#/article/${article.slug}">${escapeHTML(article.title)}</a></h2>
          <p class="muted">${escapeHTML(article.excerpt)}</p>
        </div>
        <div class="meta muted">By ${escapeHTML(article.author)} • ${formatDate(article.publishedAt)}</div>
      </div>
    </div>
  `;
}

function renderArticleCard(a) {
  return `
    <article class="card article-card" aria-labelledby="t-${a.slug}">
      <img src="${a.image}" alt="${escapeHTML(a.title)}" loading="lazy" />
      <div>
        <div class="badge">${a.category}</div>
        <h4 id="t-${a.slug}"><a href="#/article/${a.slug}">${escapeHTML(a.title)}</a></h4>
        <p class="muted">${escapeHTML(a.excerpt)}</p>
        <div class="meta muted">By ${escapeHTML(a.author)} • ${formatDate(a.publishedAt)}</div>
      </div>
    </article>
  `;
}

function escapeHTML(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])) }

// Filtering, sorting
function applyFilters() {
  filtered = articles.filter(a => {
    if (currentCategory !== "All" && a.category !== currentCategory) return false;
    if (!currentSearch) return true;
    const q = currentSearch.toLowerCase();
    return (a.title + " " + a.excerpt + " " + (a.content||"") + " " + (a.tags||"")).toLowerCase().includes(q);
  });

  if (currentSort === "latest") {
    filtered.sort((x,y)=> new Date(y.publishedAt) - new Date(x.publishedAt));
  } else if (currentSort === "most-read") {
    filtered.sort((x,y)=> (y.views||0) - (x.views||0));
  }
  cursorIndex = 0;
}

// Render home (list)
function renderHome() {
  applyFilters();
  const top = filtered[0] || null;
  const list = filtered.slice(cursorIndex + (top ? 1 : 0), cursorIndex + (top ? 1 : 0) + limit);
  const hasMore = (cursorIndex + (top ? 1 : 0) + limit) < filtered.length;
  const heroHtml = top ? renderHero(top) : '<div class="card"><p>No articles yet.</p></div>';

  const gridItems = list.map(renderArticleCard).join("");
  app.innerHTML = `
    <section>
      ${heroHtml}
      <div style="height:14px"></div>
      <div class="article-grid">
        <div>
          <div class="card">
            <div id="listContainer">
              ${gridItems || '<p class="muted">No matching articles.</p>'}
            </div>
            ${hasMore ? '<button id="loadMore" class="load-more">Load more</button>' : ''}
          </div>
        </div>
        <div id="rightColumn" style="display:none"></div>
      </div>
    </section>
  `;

  // Attach load more handler
  const loadMore = document.getElementById("loadMore");
  if (loadMore) {
    loadMore.addEventListener("click", () => {
      cursorIndex += limit;
      // Append new items
      const next = filtered.slice(cursorIndex + (top ? 1 : 0), cursorIndex + (top ? 1 : 0) + limit);
      const container = document.getElementById("listContainer");
      container.insertAdjacentHTML("beforeend", next.map(renderArticleCard).join(""));
      // remove button if no more
      const remaining = (cursorIndex + (top ? 1 : 0) + limit) < filtered.length;
      if (!remaining) loadMore.remove();
    });
  }

  renderTrending();
  updateYear();
  updateURLActiveNav();
}

// Render article page
function renderArticlePage(slug) {
  const a = articles.find(x => x.slug === slug);
  if (!a) {
    app.innerHTML = `<div class="card"><h3>Article not found</h3><p class="muted">It may have been removed.</p><p><a href="#/">Back to home</a></p></div>`;
    return;
  }
  // increment views (client side)
  a.views = (a.views || 0) + 1;
  app.innerHTML = `
    <article>
      <header class="article-hero card">
        <div class="badge">${a.category}</div>
        <h1>${escapeHTML(a.title)}</h1>
        <div class="meta muted">By ${escapeHTML(a.author)} • ${formatDate(a.publishedAt)} • ${a.views} views</div>
        <img src="${a.image}" alt="${escapeHTML(a.title)}" loading="lazy"/>
      </header>
      <div class="card article-content">
        <div>${a.content}</div>
        <hr/>
        <p class="muted">Tags: ${a.tags ? escapeHTML(a.tags.join(", ")) : "—"}</p>
        <p><a href="#/">← Back to Home</a></p>
      </div>
    </article>
  `;
  renderTrending();
  updateYear();
  updateURLActiveNav();
}

// Trending & breaking ticker
function renderTrending() {
  const top = [...articles].sort((a,b)=> (b.views||0)-(a.views||0)).slice(0,5);
  trendingList.innerHTML = top.map(t=>`<li><a href="#/article/${t.slug}">${escapeHTML(t.title)}</a><div class="muted">${t.views} reads</div></li>`).join("");
  // ticker
  const breaking = articles.filter(a=>a.isBreaking);
  if (breaking.length) {
    // show brief scrolling text
    breakingTicker.textContent = breaking.map(b=>b.title).join("  •  ");
    // simple animation: scroll by changing transform
    let offset = 0;
    const width = 600; // pixels scrolled before reset
    clearInterval(breakingTicker._timer);
    breakingTicker._timer = setInterval(()=>{
      offset = (offset + 1) % width;
      breakingTicker.style.transform = `translateX(-${offset}px)`;
    }, 40);
  } else {
    breakingTicker.textContent = "";
    clearInterval(breakingTicker._timer);
  }
}

// Search + debounce
function debounce(fn, delay=300){
  let t;
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), delay) }
}

// Simple hash routing
function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/article/")) {
    const slug = hash.replace("#/article/","");
    renderArticlePage(slug);
  } else if (hash.startsWith("#/category/")) {
    currentCategory = decodeURIComponent(hash.replace("#/category/","")) || "All";
    renderHome();
  } else {
    currentCategory = "All";
    renderHome();
  }
}

// Wire up controls
searchInput.addEventListener("input", debounce((e)=>{
  currentSearch = e.target.value.trim();
  renderHome();
}, 350));

sortSelect.addEventListener("change", (e)=>{
  currentSort = e.target.value;
  renderHome();
});

// Nav toggle (mobile)
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navList.style.display = expanded ? "none" : "flex";
});

// Upload JSON handler (admin)
uploadFile.addEventListener("change", async (e)=>{
  const f = e.target.files[0];
  if (!f) return;
  uploadStatus.textContent = "Reading file...";
  try {
    const txt = await f.text();
    const parsed = JSON.parse(txt);
    if (!Array.isArray(parsed)) throw new Error("JSON must be an array of article objects.");
    // validate minimal fields
    let added = 0;
    parsed.forEach(item=>{
      if (item.title && item.slug && item.content) {
        // defaults
        item.publishedAt = item.publishedAt || new Date().toISOString();
        item.category = item.category || "National";
        item.views = item.views || 0;
        item.image = item.image || `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/800/500`;
        articles.unshift(item); // add to front
        added++;
      }
    });
    uploadStatus.textContent = `Added ${added} articles locally.`;
    uploadFile.value = "";
    renderHome();
  } catch (err) {
    uploadStatus.textContent = "Error: " + err.message;
  }
});

// small helpers
function updateYear(){ yearEl.textContent = new Date().getFullYear(); }

function updateURLActiveNav(){
  // mark active nav (simple)
  const links = document.querySelectorAll(".nav-list a");
  links.forEach(a=>{
    a.classList.toggle("active", location.hash.startsWith(a.getAttribute("href")));
  });
}

// init
window.addEventListener("hashchange", route);
window.addEventListener("load", ()=>{
  // put initial articles into state
  articles = articles.sort((a,b)=> new Date(b.publishedAt) - new Date(a.publishedAt));
  currentCategory = "All";
  route();

  // wire up click events inside app for delegated navigation (for single-page feel)
  document.body.addEventListener("click", (ev)=>{
    // allow normal links and external
    const a = ev.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#/article/") || href === "#/" || href.startsWith("#/category/")) {
      // let hashchange handle it
      return;
    }
  });
});
