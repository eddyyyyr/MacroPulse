import fetch from "node-fetch";

const BASE_URL = "https://api.base44.com/v1/apps/68c96457d9c56fe1a4a78c96/integrations/Core/InvokeLLM";
const INGEST_URL = process.env.INGEST_URL;

const schema = {
  type: "object",
  properties: {
    marketData: { type: "object" },
    macroIndicators: { type: "object" },
    cotData: { type: "object" }
  },
  required: ["marketData", "macroIndicators", "cotData"]
};

const prompt = `
Act as a financial data aggregator.

Fetch the most recent official macroeconomic data for:
- Market Data (FX, Indices, Commodities, Bonds)
- Macro Indicators (GDP YoY, CPI YoY, Unemployment rate)
- COT Data (Non-commercial net positions)

Use ONLY:
- TradingEconomics.com
- FRED (Federal Reserve)
- Eurostat
- CFTC (Commitment of Traders)
- Yahoo Finance (for FX/Indices/Commodities)

Return a single valid JSON object matching the schema below.
No explanations, no text, only the raw JSON.
`;

(async () => {
  try {
    console.log("🌍 Fetching updated macro data via Base44 InvokeLLM...");

    const aiResponse = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        add_context_from_internet: true,
        response_json_schema: schema
      })
    });

    const aiData = await aiResponse.json();
    console.log("✅ Data received from Base44 IA");

    console.log("📡 Sending data to Base44 ingest function...");
    const res = await fetch(INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiData)
    });

    const result = await res.json();
    console.log("✅ Ingestion complete:", result);
  } catch (err) {
    console.error("❌ Error in workflow:", err);
    process.exit(1); // Force fail si erreur
  }
})();
