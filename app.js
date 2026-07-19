let trends = [];
let youtubeWatchlist = [];
let aiSignals = [];
let tiktokSignals = [];
let githubSkills = [];
let sparkPool = [];
let valueFlows = [];
let arbitragePicks = [];
let weeklySop = [];
let contentFormats = [];
let summarySparks = [];
let radarMeta = {};

const grid = document.querySelector("#trendGrid");
const youtubeGrid = document.querySelector("#youtubeGrid");
const sparkGrid = document.querySelector("#sparkGrid");
const relatedPanel = document.querySelector("#relatedPanel");
const tiktokGrid = document.querySelector("#tiktokGrid");
const aiGrid = document.querySelector("#aiGrid");
const githubGrid = document.querySelector("#githubGrid");
const editionGrid = document.querySelector("#editionGrid");
const sparkSearch = document.querySelector("#sparkSearch");
const filterChips = document.querySelectorAll("[data-spark-filter]");
const arbitrageGrid = document.querySelector("#arbitrageGrid");
const sopGrid = document.querySelector("#sopGrid");

const sparkState = {
  query: sparkSearch?.value || "",
  filter: "all"
};

const editionDate = "2026-07-19-1055";
let editionSeed = 0;
let dailyLens = null;
let dailySpotlight = null;
let dailyReverse = null;
let dailyFormat = null;
let orderedSummarySparks = [];
let dailyEditionCards = [];







function hashSeed(input) {
  return Array.from(input).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function rotateItems(items, offset) {
  if (!items.length) return [];
  const index = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(index), ...items.slice(0, index)];
}

function pickItem(items, seed, shift = 0) {
  return items[(seed + shift) % items.length];
}

function youtubeThumb(url) {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  if (!match) return "";
  return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
}

function renderSocial() {
  grid.innerHTML = trends
    .map((item, index) => {
      const rank = String(index + 1).padStart(2, "0");
      const tags = item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
      const ideas = item.ideas.map((idea) => `<li>${idea}</li>`).join("");
      const sources = item.sources
        .map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`)
        .join("");
      const image = youtubeThumb(item.sources[0]?.[1] || "");

      return `
        <article class="trend-card" data-priority="${item.priority}">
          ${image ? `<img class="card-image" src="${image}" alt="${item.title} 缩略图" loading="lazy" />` : ""}
          <div class="card-top">
            <span class="rank">${rank}</span>
            <div class="meta">${tags}</div>
          </div>
          <h3>${item.title}</h3>
          <p><strong>${item.channel}</strong> · ${item.metrics}</p>
          <div class="metric-strip">${item.heat}</div>
          <p>${item.why}</p>
          <div class="signal">
            <b>信号</b>
            <span>${item.signal}</span>
          </div>
          <div class="signal discussion">
            <b>评论区</b>
            <span>${item.discussion}</span>
          </div>
          <ul class="ideas">${ideas}</ul>
          <div class="source-row">${sources}</div>
        </article>
      `;
    })
    .join("");
}

function renderHeroMeta() {
  const label = document.querySelector("#radarMetaLabel");
  const windowText = document.querySelector("#radarWindow");
  const summary = document.querySelector("#radarSummary");
  if (!label || !windowText || !summary) return;

  label.textContent = radarMeta.label || "本期窗口";
  windowText.textContent = radarMeta.contentWindow || "数据窗口待更新";
  summary.textContent =
    radarMeta.summary ||
    "先看 Summary Feed 和 Pop Culture 内容池，再下钻到 TikTok、AI、GitHub 与 Arbitrage Queue。";
}

function renderYoutube() {
  youtubeGrid.innerHTML = youtubeWatchlist
    .map((item) => `
      <article class="youtube-item">
        <span>${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.use}</p>
        <a href="${item.url}" target="_blank" rel="noreferrer">打开参考视频</a>
      </article>
    `)
    .join("");
}

function renderTikTok() {
  tiktokGrid.innerHTML = tiktokSignals
    .map((item, index) => {
      const tags = item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
      return `
        <article class="trend-card tiktok-card" data-priority="${item.priority}">
          <div class="tiktok-thumb">
            <span>${item.imageStatus || "TikTok thumbnail pending"}</span>
          </div>
          <div class="card-top">
            <span class="rank">${String(index + 1).padStart(2, "0")}</span>
            <div class="meta">${tags}</div>
          </div>
          <h3>${item.title}</h3>
          <span class="source-type">${item.sourceType || "TikTok sample"}</span>
          <p><strong>${item.channel}</strong> · ${item.metrics}</p>
          <div class="metric-strip">${item.heat}</div>
          <p>${item.signal}</p>
          <div class="signal discussion">
            <b>评论区</b>
            <span>${item.discussion}</span>
          </div>
          <div class="signal">
            <b>小红书</b>
            <span>${item.xhsTitle}</span>
          </div>
          <div class="signal">
            <b>切入点</b>
            <span>${item.angle}</span>
          </div>
          <div class="source-row"><a href="${item.url}" target="_blank" rel="noreferrer">${item.urlLabel || "打开 TikTok"}</a></div>
        </article>
      `;
    })
    .join("");
}

function renderSparks() {
  const query = sparkState.query.trim().toLowerCase();
  const visible = sparkPool.filter((item) => {
    const haystack = `${item.lane} ${item.source} ${item.heat} ${item.title} ${item.spark} ${item.use} ${item.value}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter = sparkState.filter === "all" || haystack.includes(sparkState.filter.toLowerCase());
    return matchesQuery && matchesFilter;
  });

  sparkGrid.innerHTML = visible
    .map((item) => `
      <article class="spark-item">
        <div class="spark-top">
          <span>${item.lane}</span>
          <b>${item.heat}</b>
        </div>
        <h3>${item.title}</h3>
        <p>${item.spark}</p>
        <div class="spark-use">${item.use}</div>
        <small>${item.source} · ${item.value}</small>
      </article>
    `)
    .join("");

  if (!visible.length) {
    sparkGrid.innerHTML = `
      <article class="empty-state">
        <h3>没有匹配的 Spark</h3>
        <p>换一个关键词，或者点“全部”重新扫一遍。这个库适合宽一点地搜，比如“信任”“控制感”“AI”“审美”。</p>
      </article>
    `;
  }
}

function renderGithubSkills() {
  githubGrid.innerHTML = githubSkills
    .map((item) => `
      <article class="github-item">
        <div class="card-top">
          <span class="rank">${item.rank}</span>
          <div class="meta"><span class="tag">GitHub</span><span class="tag">Skill</span></div>
        </div>
        <h3>${item.title || item.repo}</h3>
        <div class="metric-strip">${item.heat}</div>
        <p>${item.summary}</p>
        <div class="signal">
          <b>用途</b>
          <span>${item.use}</span>
        </div>
        <div class="signal discussion">
          <b>机会</b>
          <span>${item.idea}</span>
        </div>
        <div class="source-row"><a href="${item.url}" target="_blank" rel="noreferrer">${item.urlLabel || "打开 GitHub"}</a></div>
      </article>
    `)
    .join("");
}



const aiFeedItems = [
  ...aiSignals.map((item) => ({
    kind: item.type,
    title: item.title,
    source: item.source,
    metrics: item.metrics,
    heat: item.heat,
    summary: item.summary,
    comments: item.title.includes("deleted 95%")
      ? "评论区核心是：agent skill 不是越多越好，少量高频、边界清晰、可维护的技能更容易稳定产出。"
      : item.title.includes("open-source")
        ? "评论区核心是：开源 AI 项目是否真的能用，哪些场景适合普通人立刻试。"
        : "评论区核心是：高手如何把 AI 接进任务链，工作流、上下文和检查回路比单个提示词更重要。",
    xhsTitle: item.idea,
    trend: "热度评分：高；小红书适配：适合做 AI 产品人格、普通人工作流或信息焦虑解读。",
    url: item.url,
    image: youtubeThumb(item.url)
  })),
  {
    kind: "GitHub Skill",
    title: "awesome-llm-apps：AI 应用形态样本库",
    source: "Shubhamsaboo/awesome-llm-apps",
    metrics: "2026-07-09 复核 / 作为 AI app 样本库基线 / 不伪装成日涨榜",
    heat: "AI app、agent、RAG、voice、multimodal、workflow 的集中样本；本轮重点看应用形态迁移和工作流人格。",
    summary: "把它当成 AI 应用趋势池：不是看单个 repo，而是观察哪些 app 类型被反复实现，哪些场景已经有足够多开发者在试。",
    comments: "内容讨论点：AI 应用是否同质化、agent 是否真的有用、RAG/voice/multimodal 哪些场景最容易被普通用户感知。",
    xhsTitle: "最近 AI 应用到底在做什么？先看这个开源样本库",
    trend: "热度评分：中高；小红书适配：适合做工具观察、创业 idea、开源项目周报。",
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps"
  }
];

let activeSparkId = "";

function initializeDerivedData() {
  editionSeed = hashSeed(radarMeta.editionId || editionDate);
  dailyLens = pickItem(valueFlows, editionSeed);
  dailySpotlight = pickItem(summarySparks, editionSeed, 1);
  dailyReverse = pickItem(sparkPool, editionSeed, 3);
  dailyFormat = pickItem(contentFormats, editionSeed, 2);
  orderedSummarySparks = rotateItems(summarySparks, editionSeed + 1);

  dailyEditionCards = [
    {
      label: "今日主线",
      title: `${dailyLens.name}：本周先按这条线读`,
      body: dailyLens.thesis,
      detailA: `关键词：${dailyLens.sparks.join(" / ")}`,
      detailB: `追问：${dailyLens.prompt}`
    },
    {
      label: "本周先拍",
      title: dailySpotlight.title,
      body: dailySpotlight.spark,
      detailA: `建议标题：${dailySpotlight.xhsTitle}`,
      detailB: `评论区：${dailySpotlight.discussion}`
    },
    {
      label: "反着讲",
      title: dailyReverse.title,
      body: dailyReverse.spark,
      detailA: `反常识切口：别顺着热点讲，先拆“大家误会了什么”。`,
      detailB: dailyReverse.use
    },
    {
      label: "今日格式",
      title: "同一批信号，换个发法",
      body: dailyFormat,
      detailA: `推荐搜索词：${dailyLens.sparks[0]}`,
      detailB: `本周默认风格：先观点，后素材，再补评论区站队。`
    }
  ];

  activeSparkId = dailySpotlight.id;
}

function relatedCardsFor(spark) {
  return spark.related
    .map((title) => `<span>${title}</span>`)
    .join("");
}

function renderEdition() {
  if (sparkSearch) {
    sparkSearch.placeholder = `本周先搜：${dailyLens.sparks[0]}`;
  }

  editionGrid.innerHTML = dailyEditionCards
    .map((item) => `
      <article class="edition-card">
        <span>${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        <strong>${item.detailA}</strong>
        <strong>${item.detailB}</strong>
      </article>
    `)
    .join("");
}

function renderArbitrage() {
  if (!arbitrageGrid) return;

  arbitrageGrid.innerHTML = arbitragePicks
    .map((item) => `
      <article class="arbitrage-card">
        <div class="arbitrage-top">
          <span>${item.status}</span>
          <b>${item.score}</b>
        </div>
        <p class="related-kicker">${item.lane}</p>
        <h3>${item.title}</h3>
        <p class="hook">${item.hook}</p>
        <div class="check-grid">
          <section>
            <b>Lag</b>
            <p>${item.lag}</p>
          </section>
          <section>
            <b>可翻译性</b>
            <p>${item.translation}</p>
          </section>
          <section>
            <b>来源证据</b>
            <p>${item.proof}</p>
          </section>
          <section>
            <b>风险边界</b>
            <p>${item.risk}</p>
          </section>
        </div>
        <div class="publish-box">
          <strong>发布动作</strong>
          <span>${item.format}</span>
        </div>
        <div class="publish-box review">
          <strong>复盘指标</strong>
          <span>${item.review}</span>
        </div>
      </article>
    `)
    .join("");
}

function renderSop() {
  if (!sopGrid) return;

  sopGrid.innerHTML = weeklySop
    .map((item) => `
      <article class="sop-card">
        <span>${item.step}</span>
        <h3>${item.title}</h3>
        <p>${item.detail}</p>
      </article>
    `)
    .join("");
}

function renderRelatedPanel() {
  const item = summarySparks.find((spark) => spark.id === activeSparkId) || summarySparks[0];
  relatedPanel.innerHTML = `
    <div class="related-kicker">${item.lane} · 热度 ${item.heat}/100</div>
    <h3>${item.title}</h3>
    <p>${item.spark}</p>
    <div class="signal">
      <b>标题</b>
      <span>${item.xhsTitle}</span>
    </div>
    <div class="signal discussion">
      <b>评论区</b>
      <span>${item.discussion}</span>
    </div>
    <div class="signal">
      <b>引导</b>
      <span>${item.prompt}</span>
    </div>
    <div class="metric-strip">${item.tone}</div>
    <div class="related-tags">${relatedCardsFor(item)}</div>
  `;
}

function renderSparks() {
  const query = sparkState.query.trim().toLowerCase();
  const visible = orderedSummarySparks.filter((item) => {
    const haystack = `${item.tags.join(" ")} ${item.lane} ${item.title} ${item.spark} ${item.xhsTitle} ${item.discussion} ${item.tone}`.toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const matchesQuery = !tokens.length || tokens.some((token) => haystack.includes(token));
    const matchesFilter = sparkState.filter === "all" || item.tags.includes(sparkState.filter.toLowerCase());
    return matchesQuery && matchesFilter;
  });

  sparkGrid.innerHTML = visible
    .map((item) => `
      <button class="spark-item ${item.id === activeSparkId ? "is-selected" : ""}" data-spark-id="${item.id}" type="button">
        <div class="spark-top">
          <span>${item.lane}</span>
          <b>${item.heat}</b>
        </div>
        <h3>${item.title}</h3>
        <p>${item.spark}</p>
        <div class="spark-use">${item.xhsTitle}</div>
        <small>${item.tags.map((tag) => `#${tag}`).join(" ")}</small>
      </button>
    `)
    .join("");

  if (!visible.length) {
    sparkGrid.innerHTML = `
      <article class="empty-state">
        <h3>没有匹配的 Spark</h3>
        <p>换一个关键词，或者点“全部”。建议搜：AI、审美、创业、pop、github。</p>
      </article>
    `;
  }

  sparkGrid.querySelectorAll("[data-spark-id]").forEach((card) => {
    card.addEventListener("click", () => {
      activeSparkId = card.dataset.sparkId;
      renderSparks();
      renderRelatedPanel();
    });
  });
}

function renderAiSignals() {
  aiGrid.innerHTML = aiFeedItems
    .map((item, index) => `
      <article class="trend-card ai-card" data-priority="high">
        ${item.image ? `<img class="card-image" src="${item.image}" alt="${item.title} 缩略图" loading="lazy" />` : ""}
        <div class="card-top">
          <span class="rank">${String(index + 1).padStart(2, "0")}</span>
          <div class="meta"><span class="tag">AI</span><span class="tag">${item.kind}</span></div>
        </div>
        <h3>${item.title}</h3>
        <p><strong>${item.source}</strong> · ${item.metrics}</p>
        <div class="metric-strip">${item.heat}</div>
        <p>${item.summary}</p>
        <div class="signal discussion">
          <b>评论区</b>
          <span>${item.comments}</span>
        </div>
        <div class="signal">
          <b>小红书</b>
          <span>${item.xhsTitle}</span>
        </div>
        <div class="signal">
          <b>调性</b>
          <span>${item.trend}</span>
        </div>
        <div class="source-row"><a href="${item.url}" target="_blank" rel="noreferrer">打开来源</a></div>
      </article>
    `)
    .join("");
}

function renderGithubSkills() {
  githubGrid.innerHTML = githubSkills
    .map((item) => `
      <article class="github-item">
        <div class="card-top">
          <span class="rank">${item.rank}</span>
          <div class="meta"><span class="tag">GitHub</span><span class="tag">Skill</span></div>
        </div>
        <h3>${item.title || item.repo}</h3>
        <div class="metric-strip">${item.heat}</div>
        <p>${item.summary}</p>
        <div class="signal">
          <b>用途</b>
          <span>${item.use}</span>
        </div>
        <div class="signal discussion">
          <b>机会</b>
          <span>${item.idea}</span>
        </div>
        <div class="source-row"><a href="${item.url}" target="_blank" rel="noreferrer">${item.urlLabel || "打开 GitHub"}</a></div>
      </article>
    `)
    .join("");
}

async function loadRadarData() {
  try {
    const response = await fetch("./data/radar.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`radar.json returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (window.RADAR_DATA) {
      console.warn("Using embedded RADAR_DATA fallback.", error);
      return window.RADAR_DATA;
    }
    throw error;
  }
}

function applyRadarData(data) {
  radarMeta = data.meta || {};
  ({
    trends,
    youtubeWatchlist,
    aiSignals,
    tiktokSignals,
    githubSkills,
    sparkPool,
    valueFlows,
    arbitragePicks,
    weeklySop,
    contentFormats,
    summarySparks
  } = data);
}

function renderApp() {
  renderHeroMeta();
  initializeDerivedData();
  renderSocial();
  renderYoutube();
  renderTikTok();
  renderArbitrage();
  renderSop();
  renderEdition();
  renderSparks();
  renderRelatedPanel();
  renderAiSignals();
  renderGithubSkills();
}

function bindControls() {
  sparkSearch?.addEventListener("input", (event) => {
    sparkState.query = event.target.value;
    renderSparks();
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      sparkState.filter = chip.dataset.sparkFilter;
      renderSparks();
    });
  });
}

async function startApp() {
  try {
    const data = await loadRadarData();
    applyRadarData(data);
    renderApp();
    bindControls();
  } catch (error) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="app-error">页面数据加载失败：${error.message}</div>`
    );
    console.error(error);
  }
}

startApp();
