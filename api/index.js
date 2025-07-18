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

// Uncomment the following lines if you want to use nodejs server
// const server = app.listen(7003, () => {
//   console.log(`✅ API server listening on port 7003`);
// });

exports.api = functions.https.onRequest(app);
