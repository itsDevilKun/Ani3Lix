export default async function handler(req, res) {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json"
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `API Error: ${response.status}` });
        }

        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
