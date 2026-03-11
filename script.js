const postGrid = document.getElementById("post-grid");
const topicPills = document.getElementById("topic-pills");
const articleView = document.getElementById("article-view");
const articleSection = document.getElementById("article");

const categoryClassMap = {
  Tech: "tag-tech",
  Life: "tag-life",
  Culture: "tag-culture"
};

let posts = [];
let activeTopic = "All";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeSlug(value, fallbackTitle) {
  const source = normalizeText(value) || normalizeText(fallbackTitle);
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled-post";
}

function normalizeContent(content) {
  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (item && typeof item === "object" && typeof item.text === "string") {
        return item.text.trim();
      }
      return "";
    })
    .filter(Boolean);
}

function parseSortDate(value) {
  const cleaned = normalizeText(value).replace(/\s+,/g, ",");
  const parsed = Date.parse(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizePost(post, index) {
  const title = normalizeText(post?.title) || `Untitled ${index + 1}`;
  return {
    title,
    slug: normalizeSlug(post?.slug, title),
    category: normalizeText(post?.category) || "Notes",
    date: normalizeText(post?.date),
    readTime: normalizeText(post?.readTime) || "3 min read",
    excerpt: normalizeText(post?.excerpt),
    content: normalizeContent(post?.content),
    sortDate: parseSortDate(post?.date)
  };
}

function getVisiblePosts() {
  if (activeTopic === "All") {
    return posts;
  }
  return posts.filter((post) => post.category === activeTopic);
}

function getTagClass(category) {
  return categoryClassMap[category] || "tag-life";
}

function renderPostCards() {
  const visiblePosts = getVisiblePosts();
  postGrid.innerHTML = visiblePosts
    .map(
      (post) => `
        <article class="post-card fade-in">
          <div class="post-meta">
            <span class="tag ${getTagClass(post.category)}">${post.category}</span>
            <span>${post.date}</span>
          </div>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-meta">
            <span>${post.readTime}</span>
            <a class="post-link" href="#${post.slug}" data-slug="${post.slug}">Read</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTopics() {
  const uniqueTopics = ["All", ...new Set(posts.map((post) => post.category).filter(Boolean))];
  topicPills.innerHTML = uniqueTopics
    .map((topic) => `<button class="topic-pill" type="button" data-topic="${topic}">${topic}</button>`)
    .join("");
}

function renderArticle(slug) {
  const post = posts.find((entry) => entry.slug === slug) || getVisiblePosts()[0] || posts[0];
  if (!post) {
    articleView.innerHTML = '<p class="article-placeholder">No post found.</p>';
    return;
  }

  articleView.innerHTML = `
    <div class="article-header">
      <span class="tag ${getTagClass(post.category)}">${post.category}</span>
      <h2 class="article-title">${post.title}</h2>
      <div class="post-meta">
        <span>${post.date}</span>
        <span>${post.readTime}</span>
      </div>
    </div>
    <div class="article-body">
      ${post.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

function attachEvents() {
  postGrid.addEventListener("click", (event) => {
    const link = event.target.closest("[data-slug]");
    if (!link) {
      return;
    }
    event.preventDefault();
    const { slug } = link.dataset;
    window.location.hash = slug;
    renderArticle(slug);
    articleSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  topicPills.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (!button) {
      return;
    }
    activeTopic = button.dataset.topic;
    renderPostCards();
    renderArticle(window.location.hash.replace("#", ""));
    articleView.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("hashchange", () => {
    const slug = window.location.hash.replace("#", "");
    if (slug) {
      renderArticle(slug);
    }
  });
}

async function loadPosts() {
  const response = await fetch(`./data/posts.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load posts: ${response.status}`);
  }
  const data = await response.json();
  posts = (Array.isArray(data.posts) ? data.posts : [])
    .map(normalizePost)
    .sort((a, b) => b.sortDate - a.sortDate);
}

async function init() {
  try {
    await loadPosts();
    renderPostCards();
    renderTopics();
    attachEvents();
    renderArticle(window.location.hash.replace("#", "") || posts[0]?.slug);
  } catch (error) {
    articleView.innerHTML = '<p class="article-placeholder">Posts could not be loaded right now.</p>';
    console.error(error);
  }
}

init();
