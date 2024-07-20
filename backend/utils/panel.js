const express = require("express");
const panel = express.Router();
const { getDocs, addPanelDoc, addDoc } = require("../crud");
const { createServer } = require("./dns");

panel.post("/getId", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const users = getDocs("users");
  const user = users.find((user) => user.uid === uid);

  if (user) {
    res.status(200).send({ id: user.panelId });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

panel.post("/get", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const registeredPanels = getDocs("registeredPanels");
  const panels = registeredPanels.filter((panel) => panel.userUid === uid);

  const panelData = panels.map((panel) => ({
    value: panel.panelId,
    label: panel.uid,
  }));

  res.status(200).send(panelData);
});

panel.post("/checkuser", async (req, res) => {
  const { uid, panelId } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const users = getDocs("users");
  const foundUser = users.some(
    (user) => user.uid === uid && user.panelId === parseInt(panelId)
  );

  if (foundUser) {
    res.status(200).send({ success: true });
  } else {
    res.status(200).send({ success: false });
  }
});

panel.post("/create", async (req, res) => {
  const { domain, panelId, uid } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  const lowerCaseDomain = domain.toLowerCase();
  let mainPanelId = panelId ? panelId : 0;

  if (!panelId) {
    const users = getDocs("users");
    const user = users.find((user) => user.uid === uid);

    if (user) {
      const panels = getDocs("users");
      const latestPanel = panels.sort((a, b) => b.panelId - a.panelId)[0];
      mainPanelId = latestPanel ? String(parseInt(latestPanel.id) + 1) : "1";

      const siteData = {
        uid: "site",
        title: "Panel",
        defaultCurrency: {
          label: "USD - United States Dollar",
          value: "1",
        },
      };
      const designData = {
        adminstyles: {
          "--adbasebgcolor": "#24003d",
          "--adbaseactcolor": "#2f0050",
          "--adbasehvcolor": "rgb(71, 3, 119)",
          "--addarkbgcolor": "#1a0029",
          "--adtextbgcolor": "rgb(163, 141, 179)",
          "--sitecolor": "#fb95ff",
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
        uid: "design",
      };
      addPanelDoc("general", siteData, parseInt(mainPanelId));
      addPanelDoc("design", designData, parseInt(mainPanelId));
    }
  }

  const registeredPanelData = {
    panelId: parseInt(mainPanelId),
    ssl: false,
    uid: lowerCaseDomain,
    userUid: uid,
    timestamp: new Date(),
  };
  addDoc("registeredPanels", registeredPanelData);
  createServer(lowerCaseDomain, mainPanelId, res);
});

module.exports = { panel };
