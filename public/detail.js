const gameTitle = document.getElementById("gameTitle");
const gameImage = document.getElementById("gameImage");
const minSpec = document.getElementById("minSpec");
const recSpec = document.getElementById("recSpec");

function getAppId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("appid");
}

async function loadSpecs(appId) {
  try {
    const response = await fetch(`/api/specs/${encodeURIComponent(appId)}`);
    if (!response.ok) {
      throw new Error("사양 요청 실패");
    }

    const data = await response.json();
    gameTitle.textContent = data.name || "게임 상세";
    gameImage.src = data.header_image || "";
    minSpec.textContent = data.minimum || "최소 사양 정보가 없습니다.";
    recSpec.textContent = data.recommended || "권장 사양 정보가 없습니다.";
  } catch (error) {
    gameTitle.textContent = "오류";
    minSpec.textContent = "사양 정보를 불러오지 못했습니다.";
    recSpec.textContent = "";
  }
}

const appId = getAppId();
if (!appId || !/^\d+$/.test(appId)) {
  gameTitle.textContent = "잘못된 접근";
  minSpec.textContent = "게임 ID가 올바르지 않습니다.";
  recSpec.textContent = "";
} else {
  loadSpecs(appId);
}
