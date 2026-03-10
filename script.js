const postGrid = document.getElementById("post-grid");
const topicPills = document.getElementById("topic-pills");
const articleView = document.getElementById("article-view");

const categoryClassMap = {
  Tech: "tag-tech",
  Life: "tag-life",
  Culture: "tag-culture"
};

let posts = [];

function renderPostCards() {
  postGrid.innerHTML = posts
    .map(
      (post) => `
        <article class="post-card fade-in">
          <div class="post-meta">
            <span class="tag ${categoryClassMap[post.category] || ""}">${post.category}</span>
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
  const uniqueTopics = [...new Set(posts.map((post) => post.category))];
  topicPills.innerHTML = uniqueTopics
    .map((topic) => `<button class="topic-pill" type="button" data-topic="${topic}">${topic}</button>`)
    .join("");
}

function renderArticle(slug) {
  const post = posts.find((entry) => entry.slug === slug) || posts[0];
  if (!post) {
    articleView.innerHTML = '<p class="article-placeholder">No post found.</p>';
    return;
  }

  articleView.innerHTML = `
    <div class="article-header">
      <span class="tag ${categoryClassMap[post.category] || ""}">${post.category}</span>
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
  });

  topicPills.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (!button) {
      return;
    }
    const topic = button.dataset.topic;
    const firstPost = posts.find((post) => post.category === topic);
    if (firstPost) {
      window.location.hash = firstPost.slug;
      renderArticle(firstPost.slug);
      articleView.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  window.addEventListener("hashchange", () => {
    const slug = window.location.hash.replace("#", "");
    if (slug) {
      renderArticle(slug);
    }
  });
}

async function loadPosts() {
  const response = await fetch("./data/posts.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load posts: ${response.status}`);
  }
  const data = await response.json();
  posts = Array.isArray(data.posts) ? data.posts : [];
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
