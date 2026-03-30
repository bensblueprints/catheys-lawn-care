const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "DELETE") {
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
    const data = JSON.parse(event.body);
    const { id } = data;

    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Lead ID is required" }) };
    }

    const store = getStore("leads");
    const lead = await store.get(id, { type: "json" });

    if (!lead) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };
    }

    // Soft delete - mark as archived
    lead.status = "archived";
    lead.updatedAt = new Date().toISOString();
    await store.setJSON(id, lead);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Delete lead error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};
