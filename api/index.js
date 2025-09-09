const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();

app.use(cors({ origin: true }));

app.get("/hello", (req, res) => {
  res.status(200).send({ message: "Hello from the API!" });
});

function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const m = hdr.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'missing_bearer' });

  admin.auth().verifyIdToken(m[1])
    .then((decoded) => { req.user = decoded; next(); })
    .catch(() => res.status(401).json({ error: 'invalid_token' }));
}

// after your /api/hello
app.get('/ping-secure', requireAuth, (req, res) => {
  res.json({ ok: true, uid: req.user.uid });
});

// Uncomment the following lines if you want to use nodejs server
// const server = app.listen(7003, () => {
//   console.log(`✅ API server listening on port 7003`);
// });

exports.api = functions.https.onRequest(app);
