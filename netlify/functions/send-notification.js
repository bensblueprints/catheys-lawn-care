const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const lead = JSON.parse(event.body);
    const businessName = process.env.BUSINESS_NAME || "Cathey's Lawn Care";
    const siteUrl = process.env.SITE_URL || "";

    const notification = {
      id: `notif_${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      leadService: lead.service,
      leadMessage: lead.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Store notification in Blobs
    const store = getStore("notifications");
    await store.setJSON(notification.id, notification);

    console.log(`[${businessName}] New lead received:`);
    console.log(`  Name: ${lead.name}`);
    console.log(`  Email: ${lead.email}`);
    console.log(`  Phone: ${lead.phone}`);
    console.log(`  Service: ${lead.service}`);
    console.log(`  Message: ${lead.message}`);
    console.log(`  Admin Panel: ${siteUrl}/admin`);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Notification error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Notification failed" }) };
  }
};
