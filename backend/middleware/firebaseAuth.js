const admin = require("firebase-admin");
const path = require("path");
const { User } = require("../models");

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
    const firebaseUid = decodedToken.uid;

    const firebaseUser = await admin.auth().getUser(firebaseUid);

    // ⬇️ Buat atau update user di database lokal
    const [user] = await User.findOrCreate({
      where: { firebase_uid: firebaseUid },
      defaults: {
        name: firebaseUser.displayName || "-",
        email: firebaseUser.email || "-",
      },
    });

    // Jika user sudah ada tapi nama/email null, update
    if (
      (!user.name || !user.email) &&
      (firebaseUser.displayName || firebaseUser.email)
    ) {
      await user.update({
        name: firebaseUser.displayName || user.name,
        email: firebaseUser.email || user.email,
      });
    }

    req.firebase_uid = firebaseUid;
    next();
  } catch (error) {
    console.error("❌ Token tidak valid:", error);
    res.status(401).json({ error: "Token tidak valid" });
  }
};
