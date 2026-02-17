const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
const resultsEl = document.getElementById("results");

function renderResults(items) {
  resultsEl.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "검색 결과가 없습니다.";
    resultsEl.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "result-item";

    const link = document.createElement("a");
    link.className = "result-link";
    link.href = `/detail.html?appid=${encodeURIComponent(item.id)}`;
    link.innerHTML = `
      <img src="${item.tiny_image || ""}" alt="" />
      <span>${item.name}</span>
    `;

    li.appendChild(link);
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
