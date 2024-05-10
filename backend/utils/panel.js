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
  const { uid } = req.body;

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
      foundUser = true;
      break; // Exit the loop once a match is found
    }
  }

  if (foundUser) {
    res.status(200).send({ success: true });
  } else {
    res.status(200).send({ success: false });
  }
});

panel.post("/create", async (req, res) => {
  const { domain, panelId } = req.body;

  if (!domain || !panelId) {
    return res.status(400).json({ error: "Missing body" });
  }

  const registeredPanelsCol = db.collection("registeredPanels");
  await registeredPanelsCol.doc(domain).set({ panelId: parseInt(panelId) });
  createServer(domain, res);
});

module.exports = { panel };
