export default async function handler(req, res) {
  // 1. Enable CORS so your Ani3Lix frontend is allowed to read this data
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests from the browser
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing video URL parameter" });
  }

  try {
    // 2. Fetch the video using the custom bypass headers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://animekai.to/", // Bypasses the referer block
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://animekai.to"
      }
    });

    // 3. Get the raw video playlist data
    const data = await response.text();

    // 4. Send the video data back to your player.html
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(data);

  } catch (error) {
    console.error("Scrape Error:", error);
    res.status(500).json({ error: "Failed to scrape the video stream" });
  }
}
