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

panel.post("/get", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }
  const panelsCollectionRef = db
    .collection("registeredPanels")
    .where("adminUid", "==", uid);
  const panelsQuerySnapshot = await panelsCollectionRef.get();
  const panelData = [];
  if (!panelsQuerySnapshot.empty) {
    for (const panelDoc of panelsQuerySnapshot.docs) {
      const domain = panelDoc.id;
      const panelId = panelDoc.data().panelId;
      panelData.push({ value: panelId, label: domain });
    }
    return res.status(200).send(panelData);
  } else {
    return res.status(200).send([]);
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

  if (!domain) {
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
        const siteDoc = db.collection(`panels/${panelId}/general`).doc("site");
        await siteDoc.set({
          backend_url: `https://${domain}:3001`,
          title: "Panel",
          adminStyles: {
            "--adbasebgcolor": "#24003d",
            "--adbaseactcolor": "#2f0050",
            "--adbasehvcolor": "rgb(71, 3, 119)",
            "--addarkbgcolor": "#1a0029",
            "--adtextbgcolor": "rgb(163, 141, 179)",
            "--sitecolor": "#fb95ff",
          },
          defaultCurrency: {
            label: "USD - United States Dollar",
            value: "1",
          },
          clientStyles: {
            "--bgdarkcolor": "#1c031a",
            "--bglightcolor": "#f6eff3",
            "--sitecolor": "#6a0083",
            "--stbaseactcolor": "#aa19d2",
            "--stbasebgcolor": "#b46bd6",
            "--stbasehvcolor": "#d123c3",
            "--sttextbgcolor": "#c58cc0",
            "--sitecolor": "#fb95ff",
          },
        });
        break;
      }
    }
  }

  const registeredPanelsCol = db.collection("registeredPanels");
  await registeredPanelsCol
    .doc(domain)
    .set({ panelId: parseInt(mainPanelId), ssl: false, adminUid: uid });
  createServer(domain, mainPanelId, res);
});

module.exports = { panel };
