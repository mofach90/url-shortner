

const admin = require("firebase-admin");


async function requireAuth(req, res, next) {
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

export default requireAuth;