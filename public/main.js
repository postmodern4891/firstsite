const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
const resultsEl = document.getElementById("results");
const detailSection = document.getElementById("detailSection");
const gameTitle = document.getElementById("gameTitle");
const gameImage = document.getElementById("gameImage");
const minSpec = document.getElementById("minSpec");
const recSpec = document.getElementById("recSpec");

function renderResults(items) {
  resultsEl.innerHTML = "";
  detailSection.classList.add("hidden");

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "검색 결과가 없습니다.";
    resultsEl.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "result-item";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "result-btn";
    btn.innerHTML = `
      <img src="${item.tiny_image || ""}" alt="" />
      <span>${item.name}</span>
    `;
    btn.addEventListener("click", () => loadSpecs(item.id));

    li.appendChild(btn);
    resultsEl.appendChild(li);
  });
}

async function searchGames(query) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("검색 요청 실패");
  }
  return response.json();
}

async function loadSpecs(appId) {
  gameTitle.textContent = "불러오는 중...";
  minSpec.textContent = "";
  recSpec.textContent = "";
  detailSection.classList.remove("hidden");

  try {
    const response = await fetch(`/api/specs/${appId}`);
    if (!response.ok) {
      throw new Error("사양 요청 실패");
    }
    const data = await response.json();

    gameTitle.textContent = data.name;
    gameImage.src = data.header_image || "";
    minSpec.textContent = data.minimum;
    recSpec.textContent = data.recommended;
  } catch (error) {
    gameTitle.textContent = "오류";
    minSpec.textContent = "사양 정보를 불러오지 못했습니다.";
    recSpec.textContent = "";
  }
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;

  resultsEl.innerHTML = "<li>검색 중...</li>";
  try {
    const data = await searchGames(query);
    renderResults(data.items || []);
  } catch (error) {
    resultsEl.innerHTML = "<li>검색 중 오류가 발생했습니다.</li>";
  }
});
