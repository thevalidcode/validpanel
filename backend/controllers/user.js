const { getDocs, addDoc, addPanelDoc } = require("../crud");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.userAuth = async (req, res) => {
  const { email, password } = req.body;
  const allUsers = getDocs("users");
  const userData = allUsers.find((user) => user.email === email);
  if (userData) {
    const isMatch = await bcrypt.compare(password, userData.password);
    if (isMatch) {
      return res.status(200).send(userData);
    } else {
      return res.status(400).send({ error: "Invalid Login Details" });
    }
  } else {
    return res.status(400).send({ error: "Invalid Login Details" });
  }
};

exports.userData = async (req, res) => {
  const { uid } = req.body;
  const allUsers = getDocs("users");
  const userData = allUsers.find((user) => user.uid === uid);
  if (userData) {
    return res.status(200).send(userData);
  } else {
    return res.status(400).send({ error: "Invalid Login Details" });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const uuid = uuidv4();
    const userData = {
      uid: uuid,
      email: email,
      name: name,
      timestamp: new Date(),
      password: password,
      apiKey: uuid,
      panelIds: [],
    };

    const usersDocs = getDocs("users");
    const emailExist = usersDocs.some((user) => user.email === email);
    if (emailExist) {
      return res.status(400).send({ error: "Email already exists" });
    }

    let userId;
    if (usersDocs.length === 0) {
      userId = 1;
    } else {
      const sortedUsers = usersDocs.sort((a, b) => b.id - a.id);
      userId = parseInt(sortedUsers[0].id) + 1;
    }
    userData.id = userId;

    const panelsDocs = getDocs("registeredPanels");
    let panelId;
    if (panelsDocs.length === 0) {
      panelId = 1;
    } else {
      const sortedPanels = panelsDocs.sort((a, b) => b.panelId - a.panelId);
      panelId = parseInt(sortedPanels[0].panelId) + 1;
    }
    userData.panelIds.push(panelId);

    addPanelDoc("admins", userData, panelId);
    addDoc("users", userData);

    return res
      .status(200)
      .send({ user: userData, success: "User Created Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error creating user" });
  }
};
