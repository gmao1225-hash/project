(() => {
  const FAV_KEY = "hankki-favorites";

  const state = {
    mode: "all",        // all | value | best | fav
    category: "전체",
    query: "",
    maxPrice: Infinity,
    sort: "score",
    favorites: loadFavorites(),
  };

  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");

  // 가성비 점수: 평점이 높고 가격이 낮을수록 높음 (0~100)
  function valueScore(r) {
    const ratingPart = (r.rating - 3) / 2;                         // 3.0~5.0 → 0~1
    const pricePart = 1 - Math.min(r.price, 30000) / 30000;        // 0원~3만원 → 1~0
    return Math.round(Math.max(0, Math.min(1, ratingPart * 0.6 + pricePart * 0.4)) * 100);
  }

  function loadFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); }
    catch { return new Set(); }
  }
  function saveFavorites() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...state.favorites])); } catch {}
  }

  const won = (n) => n.toLocaleString("ko-KR") + "원";
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function filtered() {
    const q = state.query.trim().toLowerCase();
    let list = RESTAURANTS.filter((r) => {
      if (state.mode === "value" && !(r.value || r.price <= 10000)) return false;
      if (state.mode === "best" && r.rating < 4.5) return false;
      if (state.mode === "fav" && !state.favorites.has(r.id)) return false;
      if (state.category !== "전체" && r.category !== state.category) return false;
      if (r.price > state.maxPrice) return false;
      if (q) {
        const hay = [r.name, r.area, r.category, r.desc, ...r.tags].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorters = {
      score: (a, b) => valueScore(b) - valueScore(a),
      rating: (a, b) => b.rating - a.rating,
      price: (a, b) => a.price - b.price,
      reviews: (a, b) => b.reviews - a.reviews,
    };
    return list.sort(sorters[state.sort]);
  }

  function cardHtml(r) {
    const fav = state.favorites.has(r.id);
    const isValue = r.value || r.price <= 10000;
    return `
      <article class="card" tabindex="0" data-id="${r.id}">
        ${isValue ? `<span class="badge value">💰 가성비</span>` : ""}
        <button class="fav-btn" data-fav="${r.id}" aria-label="${fav ? "찜 해제" : "찜하기"}" aria-pressed="${fav}">${fav ? "❤️" : "🤍"}</button>
        <div class="card-thumb">${r.emoji}</div>
        <div class="card-body">
          <div class="card-title">
            <h3>${escapeHtml(r.name)}</h3>
            <span class="rating">★ ${r.rating.toFixed(1)}</span>
          </div>
          <div class="meta">${escapeHtml(r.category)} · ${escapeHtml(r.area)} · 리뷰 ${r.reviews}</div>
          <div class="price">1인 약 ${won(r.price)}</div>
          <p class="desc">${escapeHtml(r.desc)}</p>
          <div class="tags">${r.tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join("")}</div>
        </div>
      </article>`;
  }

  function render() {
    const list = filtered();
    grid.innerHTML = list.map(cardHtml).join("");
    $("#empty").hidden = list.length > 0;
    $("#result-count").textContent = `${list.length}곳의 식당`;

    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === state.category));
  }

  function renderChips() {
    const cats = ["전체", ...new Set(RESTAURANTS.map((r) => r.category))];
    $("#category-chips").innerHTML = cats.map((c) => `<button class="chip" data-cat="${c}">${c}</button>`).join("");
  }

  function openDetail(id) {
    const r = RESTAURANTS.find((x) => x.id === id);
    if (!r) return;
    const score = valueScore(r);
    $("#detail-body").innerHTML = `
      <div class="card-thumb">${r.emoji}</div>
      <div class="detail-content">
        <h2>${escapeHtml(r.name)}</h2>
        <div class="meta">${escapeHtml(r.category)} · ${escapeHtml(r.area)}</div>
        <p>${escapeHtml(r.desc)}</p>
        <dl>
          <dt>평점</dt><dd class="rating">★ ${r.rating.toFixed(1)} <span class="meta">(${r.reviews}개 리뷰)</span></dd>
          <dt>가격</dt><dd>1인 약 ${won(r.price)}</dd>
          <dt>영업시간</dt><dd>${escapeHtml(r.hours)}</dd>
          <dt>가성비</dt><dd>${score}점<div class="score-bar"><span style="width:${score}%"></span></div></dd>
        </dl>
        <div class="tags">${r.tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join("")}</div>
      </div>`;
    $("#detail").showModal();
  }

  function toggleFav(id) {
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    saveFavorites();
    render();
  }

  // Events
  document.querySelector(".nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (!btn) return;
    state.mode = btn.dataset.mode;
    render();
  });

  $("#category-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.category = chip.dataset.cat;
    render();
  });

  $("#search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
  $("#max-price").addEventListener("change", (e) => { state.maxPrice = Number(e.target.value); render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  grid.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) { e.stopPropagation(); toggleFav(Number(favBtn.dataset.fav)); return; }
    const card = e.target.closest(".card");
    if (card) openDetail(Number(card.dataset.id));
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.closest("[data-fav]")) return;
    const card = e.target.closest(".card");
    if (card) openDetail(Number(card.dataset.id));
  });

  $("#detail").addEventListener("click", (e) => { if (e.target.id === "detail") e.target.close(); });

  renderChips();
  render();
})();
