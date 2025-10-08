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
Fetch the latest OFFICIAL data for:
- Market Data (FX, indices, commodities, rates)
- Macro Indicators (GDP YoY, CPI YoY, Unemployment rate YoY)
- COT Data (Non-commercial net positions)
Use TradingEconomics.com, FRED, Eurostat, CFTC, or Yahoo Finance.
Return a valid JSON matching the schema, no text.
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
    console.log("✅ Data received from AI:", aiData);

    console.log("📡 Sending data to Base44 ingest function...");
    const res = await fetch(INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiData)
    });

    console.log("✅ Ingestion complete:", await res.json());
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
