export default async function handler(req, res) {
  const address =
    req.query.address ||
    (req.url.includes("?address=")
      ? req.url.split("?address=")[1]
      : "");

  if (!address) {
    res.status(400).json({ error: "address required" });
    return;
  }

  try {
    const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const r = await fetch(apiUrl);

    if (!r.ok) {
      res.status(r.status).json({ error: "dexscreener error" });
      return;
    }

    const data = await r.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
