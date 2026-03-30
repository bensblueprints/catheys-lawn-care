const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Auth check
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || token !== adminPassword) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  try {
    const store = getStore("leads");
    const { blobs } = await store.list();
    const statusFilter = event.queryStringParameters?.status;

    const leads = [];
    for (const blob of blobs) {
      try {
        const lead = await store.get(blob.key, { type: "json" });
        if (lead) {
          if (statusFilter && lead.status !== statusFilter) continue;
          leads.push(lead);
        }
      } catch (e) {
        console.log(`Failed to read lead ${blob.key}:`, e.message);
      }
    }

    // Sort by createdAt descending (newest first)
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { statusCode: 200, headers, body: JSON.stringify({ leads }) };
  } catch (err) {
    console.error("Get leads error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};
