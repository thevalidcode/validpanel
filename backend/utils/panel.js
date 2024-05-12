const express = require("express");
const panel = express.Router();
const { db } = require("../db");
const { createServer } = require("./dns");

panel.post("/getId", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }
  const panelsCollectionRef = db.collection("panels");
  const panelsQuerySnapshot = await panelsCollectionRef.get();
  let foundPanelId = null;

  for (const panelDoc of panelsQuerySnapshot.docs) {
    const adminsCollectionRef = panelDoc.ref.collection("admins");
    const adminsQuerySnapShot = await adminsCollectionRef
      .where("uid", "==", uid)
      .get();
    if (!adminsQuerySnapShot.empty) {
      const admin = adminsQuerySnapShot.docs[0].data();
      const { panelId } = admin;
      foundPanelId = panelId;
      break;
    }
  }

  if (foundPanelId) {
    res.status(200).send({ id: foundPanelId });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

panel.post("/checkuser", async (req, res) => {
  const { uid, panelId } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }
  const panelsCollectionRef = db.collection("panels");
  const panelsQuerySnapshot = await panelsCollectionRef.get();
  let foundUser = false;

  for (const panelDoc of panelsQuerySnapshot.docs) {
    const adminsCollectionRef = panelDoc.ref.collection("admins");
    const adminsQuerySnapShot = await adminsCollectionRef
      .where("uid", "==", uid)
      .get();
    if (!adminsQuerySnapShot.empty) {
      const adminData = adminsQuerySnapShot.docs[0].data();
      if (adminData.panelId === parseInt(panelId)) {
        foundUser = true;
        break;
      }
    }
  }

  if (foundUser) {
    res.status(200).send({ success: true });
  } else {
    res.status(200).send({ success: false });
  }
});

panel.post("/create", async (req, res) => {
  const { domain, panelId, uid } = req.body;

  if (!domain || !panelId) {
    return res.status(400).json({ error: "Missing body" });
  }

  let mainPanelId = panelId ? panelId : 0;
  if (panelId === null) {
    const panelsCollectionRef = db.collection("panels");
    const panelsQuerySnapshot = await panelsCollectionRef.get();
    for (const panelDoc of panelsQuerySnapshot.docs) {
      const adminsCollectionRef = panelDoc.ref.collection("admins");
      const adminsQuerySnapShot = await adminsCollectionRef
        .where("uid", "==", uid)
        .get();
      if (!adminsQuerySnapShot.empty) {
        const adminData = adminsQuerySnapShot.docs[0].data();
        const panelQuery = db
          .collection("panels")
          .orderBy("id", "desc")
          .limit(1);
        const panelDocs = await panelQuery.get();

        if (!panelDocs.empty) {
          const panelDoc = panelDocs.docs[0];
          mainPanelId = String(parseInt(panelDoc.data().id) + 1);
        } else {
          mainPanelId = "1";
        }

        const panelRef = db
          .collection("panels")
          .doc(mainPanelId)
          .collection("admins")
          .doc(uid);
        await panelRef.set(adminData);
        await panelRef.update({ panelId: parseInt(mainPanelId) });

        const panelDoc = await db.collection("panels").doc(mainPanelId).get();
        if (panelDoc.exists) {
          await db
            .collection("panels")
            .doc(mainPanelId)
            .update({ id: parseInt(mainPanelId) });
        } else {
          // Create the document if it doesn't exist
          await db
            .collection("panels")
            .doc(mainPanelId)
            .set({ id: parseInt(mainPanelId) });
        }
        break;
      }
    }
  }

  const registeredPanelsCol = db.collection("registeredPanels");
  await registeredPanelsCol
    .doc(domain)
    .set({ panelId: parseInt(mainPanelId), ssl: false });
  createServer(domain, mainPanelId, res);
});

module.exports = { panel };
