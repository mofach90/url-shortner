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

    const links = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
      code: doc.id,
      longUrl: data.longUrl,
      shortUrl: data.shortUrl,
      createdAt: data.createdAt,
      clicks: data.clicks ?? 0,
      lastVisitedAt: data.lastVisitedAt ?? null,
    });
  } catch (err) {
    console.error("Error fetching link:", err);
    return res.status(500).json({ error: "internal_error" });
  }
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
