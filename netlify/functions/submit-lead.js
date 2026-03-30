const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const data = JSON.parse(event.body);

    // Honeypot spam check
    if (data.website) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: "ok" }) };
    }

    const { name, email, phone, service, message, preferredDate } = data;

    // Validate required fields
    if (!name || !email || !phone) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Name, email, and phone are required" }) };
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email address" }) };
    }

    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lead = {
      id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: service || "General Inquiry",
      preferredDate: preferredDate || "",
      message: (message || "").trim(),
      status: "new",
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const store = getStore("leads");
    await store.setJSON(id, lead);

    // Send notification
    try {
      const baseUrl = process.env.URL || "";
      await fetch(`${baseUrl}/.netlify/functions/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (e) {
      console.log("Notification send failed:", e.message);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id }) };
  } catch (err) {
    console.error("Submit lead error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};
