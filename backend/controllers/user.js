const admin = require("firebase-admin");
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
const { db } = require("../db");

exports.createUser = async (req, res) => {
  const { name, email, uid, password } = req.body;
  try {
    const userData = {
      uid: uid,
      email: email,
      name: name,
      timestamp: serverTimestamp,
      password: password,
      apiKey: uid,
    };

    let panelId;
    const panelQuery = db.collection("panels").orderBy("id", "desc").limit(1);
    const panelDocs = await panelQuery.get();

    if (!panelDocs.empty) {
      const panelDoc = panelDocs.docs[0];
      panelId = String(parseInt(panelDoc.data().id) + 1);
    } else {
      panelId = "1";
    }

    const panelRef = db
      .collection("panels")
      .doc(panelId)
      .collection("admins")
      .doc(uid);
    await panelRef.set(userData);
    await panelRef.update({ panelId: parseInt(panelId) });

    const panelDoc = await db.collection("panels").doc(panelId).get();
    if (panelDoc.exists) {
      await db
        .collection("panels")
        .doc(panelId)
        .update({ id: parseInt(panelId) });
    } else {
      // Create the document if it doesn't exist
      await db
        .collection("panels")
        .doc(panelId)
        .set({ id: parseInt(panelId) });
    }
    res
      .status(200)
      .send({ id: parseInt(panelId), success: "User Created Successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error creating user" });
    console.log(error);
  }
};
