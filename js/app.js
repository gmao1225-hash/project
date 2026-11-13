(() => {
  const FAV_KEY = "hankki-favorites";
  const MODE_TITLES = { all: "전체 식당", value: "가성비 식당", best: "맛집", fav: "찜 목록" };

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
  const isValue = (r) => r.value || r.price <= 10000;

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
    const list = RESTAURANTS.filter((r) => {
      if (state.mode === "value" && !isValue(r)) return false;
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

  // component: store-utility-card
  function cardHtml(r) {
    const fav = state.favorites.has(r.id);
    const label = [isValue(r) ? "가성비" : "", r.rating >= 4.5 ? "맛집" : ""].filter(Boolean).join(" · ");
    return `
      <article class="card" tabindex="0" data-id="${r.id}" aria-label="${escapeHtml(r.name)}">
        <div class="card-image"><span aria-hidden="true">${r.emoji}</span></div>
        <button class="btn-icon-circular fav" data-fav="${r.id}" aria-label="${fav ? "찜 해제" : "찜하기"}" aria-pressed="${fav}">${fav ? "♥" : "♡"}</button>
        ${label ? `<p class="caption-strong card-label">${label}</p>` : ""}
        <h3 class="body-strong card-name">${escapeHtml(r.name)}</h3>
        <p class="caption card-meta">${escapeHtml(r.category)} · ${escapeHtml(r.area)} · ★ ${r.rating.toFixed(1)} (${r.reviews})</p>
        <p class="body card-price">1인 약 ${won(r.price)}</p>
        <p class="caption card-desc">${escapeHtml(r.desc)}</p>
        <div class="card-foot">
          <span class="text-link body">자세히 보기 ›</span>
        </div>
      </article>`;
  }

  function render() {
    const list = filtered();
    grid.innerHTML = list.map(cardHtml).join("");
    $("#empty").hidden = list.length > 0;
    $("#result-count").textContent = `${list.length}곳`;
    $("#sub-nav-title").textContent = MODE_TITLES[state.mode];

    document.querySelectorAll(".nav-link").forEach((b) => {
      const on = b.dataset.mode === state.mode;
      b.classList.toggle("active", on);
      b.setAttribute("aria-current", on ? "page" : "false");
    });
    document.querySelectorAll(".chip").forEach((c) => {
      const on = c.dataset.cat === state.category;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on);
    });
    renderFeatured();
  }

  // component: product-tile-dark — 가성비 점수 1위
  function renderFeatured() {
    const top = [...RESTAURANTS].sort((a, b) => valueScore(b) - valueScore(a))[0];
    const fav = state.favorites.has(top.id);
    $("#featured-name").textContent = top.name;
    $("#featured-desc").textContent = `${top.area} · 1인 ${won(top.price)} · ★ ${top.rating.toFixed(1)}`;
    $("#featured-render").textContent = top.emoji;
    $("#featured-detail").dataset.id = top.id;
    const favBtn = $("#featured-fav");
    favBtn.dataset.id = top.id;
    favBtn.textContent = fav ? "찜 해제" : "찜하기";
    favBtn.setAttribute("aria-pressed", fav);
  }

  function renderChips() {
    const cats = [...new Set(RESTAURANTS.map((r) => r.category))];
    $("#category-chips").innerHTML = ["전체", ...cats]
      .map((c) => `<button class="chip" data-cat="${c}">${c}</button>`).join("");
    $("#footer-cats").innerHTML = cats
      .map((c) => `<li><button class="footer-link" data-cat="${c}">${c}</button></li>`).join("");
  }

  function openDetail(id) {
    const r = RESTAURANTS.find((x) => x.id === id);
    if (!r) return;
    const score = valueScore(r);
    const fav = state.favorites.has(r.id);
    $("#detail-body").innerHTML = `
      <div class="detail-render"><span aria-hidden="true">${r.emoji}</span></div>
      <div class="detail-content">
        <h2 class="display-md">${escapeHtml(r.name)}</h2>
        <p class="caption card-meta">${escapeHtml(r.category)} · ${escapeHtml(r.area)}</p>
        <p class="body">${escapeHtml(r.desc)}</p>
        <dl class="detail-specs body">
          <dt>평점</dt><dd>★ ${r.rating.toFixed(1)} · 리뷰 ${r.reviews}개</dd>
          <dt>가격</dt><dd>1인 약 ${won(r.price)}</dd>
          <dt>영업시간</dt><dd>${escapeHtml(r.hours)}</dd>
          <dt>가성비</dt><dd>${score}점<div class="score-bar"><span style="width:${score}%"></span></div></dd>
          <dt>태그</dt><dd>${r.tags.map((t) => "#" + escapeHtml(t)).join(" ")}</dd>
        </dl>
        <div class="cta-row" style="justify-content:flex-start">
          <button class="btn-primary" data-detail-fav="${r.id}">${fav ? "찜 해제" : "찜하기"}</button>
        </div>
      </div>`;
    const dlg = $("#detail");
    if (!dlg.open) dlg.showModal();
  }

  function toggleFav(id) {
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    saveFavorites();
    render();
  }

  function setMode(mode, scroll) {
    state.mode = mode;
    closeMenu();
    render();
    if (scroll) $("#list").scrollIntoView({ behavior: "smooth" });
  }

  // 모바일 햄버거 메뉴
  const toggle = $("#nav-toggle");
  const links = $("#global-links");
  function closeMenu() { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  // data-mode 버튼 (전역 메뉴, 서브내비, 히어로 CTA, 푸터)
  document.addEventListener("click", (e) => {
    const modeBtn = e.target.closest("[data-mode]");
    if (modeBtn) { setMode(modeBtn.dataset.mode, true); return; }
    const catBtn = e.target.closest("[data-cat]");
    if (catBtn) {
      state.category = catBtn.dataset.cat;
      render();
      if (catBtn.classList.contains("footer-link")) $("#list").scrollIntoView({ behavior: "smooth" });
    }
  });

  $("#search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
  $("#search").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#list").scrollIntoView({ behavior: "smooth" }); });
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

  $("#featured-detail").addEventListener("click", (e) => openDetail(Number(e.currentTarget.dataset.id)));
  $("#featured-fav").addEventListener("click", (e) => toggleFav(Number(e.currentTarget.dataset.id)));

  const dlg = $("#detail");
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) return dlg.close();
    const f = e.target.closest("[data-detail-fav]");
    if (f) { const id = Number(f.dataset.detailFav); toggleFav(id); openDetail(id); }
  });

  renderChips();
  render();
})();
