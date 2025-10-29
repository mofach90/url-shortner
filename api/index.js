const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const generateCode = require("./utils/generateCode");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp();
const db = admin.firestore();

const app = express();

app.use(cors({ origin: true }));

app.get("/hello", (req, res) => {
  res.status(200).send({ message: "Hello from the API!" });
});

function requireAuth(req, res, next) {
  console.log("Authenticating request...");
  const hdr = req.headers.authorization || "";
  const m = hdr.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "missing_bearer" });

  admin
    .auth()
    .verifyIdToken(m[1])
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch(() => res.status(401).json({ error: "invalid_token" }));
}

app.post("/shorten", requireAuth, async (req, res) => {
  try {
    const { longUrl } = req.body;
    console.log("Received longUrl:", longUrl);
    if (!longUrl) {
      return res.status(400).json({ error: "missing_longUrl" });
    }
    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: "invalid_url" });
    }

    const urls = db.collection("urls");
    const ownerUid = req.user.uid;
    const BASE_URL = process.env.BASE_URL || "https://gdgurl.web.app"; // fallback

    let code;
    let docRef;
    while (true) {
      code = generateCode(7);
      docRef = urls.doc(code);
      const doc = await docRef.get();

      if (!doc.exists) break;
    }

    const data = {
      code,
      longUrl,
      shortUrl: `${BASE_URL}/r/${code}`,
      ownerUid,
      createdAt: Timestamp.now(),
      lastVisitedAt: null,
      clicks: 0,
    };
    console.log("Storing shortened URL:", data);

    const result = await docRef.set(data);
    console.log("Stored document result:", result);

    return res.status(201).json({
      code: data.code,
      longUrl: data.longUrl,
      shortUrl: data.shortUrl,
      createdAt: data.createdAt,
    });
  } catch (err) {
    console.error("shorten error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

// Redirect route: GET /r/:code
app.get("/r/:code", async (req, res) => {
  const { code } = req.params;
  console.log(`Redirect request for code: ${code}`);
  try {
    const docRef = admin.firestore().collection("urls").doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn(`❌ No URL found for code: ${code}`);
      // redirect to landing page (or a 404 page)
      return res.redirect(302, "/");
    }

    const data = doc.data();

    // increment click count asynchronously (don’t block redirect)
    await docRef
      .update({
        clicks: FieldValue.increment(1),
        lastVisitedAt: Timestamp.now(),
      })
      .catch((err) => console.error("Failed to update click count:", err));
    await docRef.collection("clicks").add({
      timestamp: Timestamp.now(),
      userAgent: req.get("user-agent") || null,
      ip: req.headers["x-forwarded-for"] || req.ip || null,
    });

    console.log(`🔁 Redirecting ${code} → ${data.longUrl}`);
    return res.redirect(302, data.longUrl);
  } catch (err) {
    console.error("redirect error:", err);
    return res.redirect(302, "/");
  }
});

// List all URLs for the authenticated user
app.get("/links", requireAuth, async (req, res) => {
  try {
    const urlsRef = admin.firestore().collection("urls");
    const snapshot = await urlsRef
      .where("ownerUid", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();

    const links = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        code: data.code,
        longUrl: data.longUrl,
        shortUrl: data.shortUrl,
        clicks: data.clicks || 0,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        lastVisitedAt: data.lastVisitedAt?.toDate().toISOString() || null,
      };
    });

    return res.status(200).json({ links });
  } catch (err) {
    console.error("Error listing URLs:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

// Get details for a specific short link
app.get("/links/:code", requireAuth, async (req, res) => {
  const { code } = req.params;
  try {
    const docRef = admin.firestore().collection("urls").doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "not_found" });
    }

    const data = doc.data();

    // Only the owner can view details
    if (data.ownerUid !== req.user.uid) {
      return res.status(403).json({ error: "forbidden" });
    }

    return res.status(200).json({
      id: doc.id,
      code: data.code,
      longUrl: data.longUrl,
      shortUrl: data.shortUrl,
      clicks: data.clicks || 0,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      lastVisitedAt: data.lastVisitedAt?.toDate().toISOString() || null,
    });
  } catch (err) {
    console.error("Error fetching link:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

// DELETE /api/links/:code
app.delete("/links/:code", requireAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const urls = admin.firestore().collection("urls");

    const docRef = urls.doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "not_found" });
    }

    // Check ownership
    const data = doc.data();
    if (data.ownerUid !== req.user.uid) {
      return res.status(403).json({ error: "forbidden" });
    }

    await docRef.delete();

    return res.status(200).json({ success: true, code });
  } catch (err) {
    console.error("delete link error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.patch("/links/:code", requireAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const { longUrl } = req.body;
    console.log("Update request for code:", code, "with longUrl:", longUrl);

    if (!longUrl) {
      return res.status(400).json({ error: "missing_longUrl" });
    }

    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: "invalid_url" });
    }

    const docRef = admin.firestore().collection("urls").doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "not_found" });
    }

    const data = doc.data();
    if (data.ownerUid !== req.user.uid) {
      return res.status(403).json({ error: "forbidden" });
    }

    await docRef.update({ longUrl });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("update link error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.get("/links/:code/analytics", requireAuth, async (req, res) => {
  console.log("Analytics request for code:", req.params.code);
  const { code } = req.params;
  const uid = req.user.uid;

  const urlRef = admin.firestore().collection("urls").doc(code);
  const urlDoc = await urlRef.get();
  console.log("Fetched URL doc:", urlDoc.id, urlDoc.exists, urlDoc.data());

  if (!urlDoc.exists) return res.status(404).json({ error: "not_found" });
  if (urlDoc.data().ownerUid !== uid)
    return res.status(403).json({ error: "forbidden" });

  // Fetch recent 50 clicks (or all)
  const snap = await urlRef
    .collection("clicks")
    .orderBy("timestamp", "desc")
    .limit(50)
    .get();

  console.log("Fetched clicks snapshot:", snap.docs.length);

  const clicks = snap.docs.map((d) => {
    console.log("Click data doc:", d.id, d.data());
    return {
      id: d.id,
      timestamp: d.data().timestamp?.toDate().toISOString(),
      userAgent: d.data().userAgent,
      ip: d.data().ip,
    };
  });
  console.log("Mapped clicks data:", clicks);

  res.json({ code, total: clicks.length, clicks });
});

// after your /api/hello
app.get("/ping-secure", requireAuth, (req, res) => {
  res.json({ ok: true, uid: req.user.uid });
});

// Uncomment the following lines if you want to use nodejs server
// const server = app.listen(7003, () => {
//   console.log(`✅ API server listening on port 7003`);
// });

exports.api = functions.https.onRequest(app);
