const admin = require("firebase-admin");
const path = require("path");

// Inisialisasi hanya sekali
if (!admin.apps.length) {
  const serviceAccount = require(path.join(
    __dirname,
    "../serviceAccountKey.json"
  ));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebase_uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid" });
  }
};
