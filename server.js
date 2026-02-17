const express = require("express");

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function createApp() {
  const app = express();
  app.use(express.static("public"));

  app.get("/api/search", async (req, res) => {
    const q = (req.query.q || "").toString().trim();
    if (!q) return res.status(400).json({ error: "q is required" });

    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=koreana&cc=KR`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "steam-spec-finder/1.0"
        }
      });
      if (!response.ok) {
        return res.status(502).json({ error: "Steam search request failed" });
      }
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];

      const result = items.map((item) => ({
        id: item.id,
        name: item.name,
        tiny_image: item.tiny_image,
        price: item.price ? item.price.final / 100 : null,
        is_free: item.is_free_game === true
      }));

      res.json({ total: data.total || result.length, items: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Steam search data" });
    }
  });

  app.get("/api/specs/:appId", async (req, res) => {
    const appId = req.params.appId;
    if (!/^\d+$/.test(appId)) {
      return res.status(400).json({ error: "Invalid appId" });
    }

    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=koreana&cc=KR`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "steam-spec-finder/1.0"
        }
      });
      if (!response.ok) {
        return res.status(502).json({ error: "Steam appdetails request failed" });
      }

      const data = await response.json();
      const entry = data[appId];

      if (!entry || !entry.success || !entry.data) {
        return res.status(404).json({ error: "Game detail not found" });
      }

      const game = entry.data;
      const pcReq = game.pc_requirements || {};
      const minRaw = pcReq.minimum || "";
      const recRaw = pcReq.recommended || "";

      res.json({
        appid: game.steam_appid,
        name: game.name,
        header_image: game.header_image,
        minimum: stripHtml(minRaw) || "최소 사양 정보가 없습니다.",
        recommended: stripHtml(recRaw) || "권장 사양 정보가 없습니다."
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Steam specs" });
    }
  });

  return app;
}

function startServer(port = Number(process.env.PORT || 3000)) {
  const app = createApp();
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      resolve(server);
    });
    server.on("error", reject);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

module.exports = { createApp, startServer };
