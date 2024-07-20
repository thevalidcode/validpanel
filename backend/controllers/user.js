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
    };

    let panelId;
    let userId;
    const usersDocs = getDocs("users");
    const emailExist = usersDocs.some((user) => user.email === email);
    if (emailExist) {
      return res.status(400).send({ error: "Email already exist" });
    }
    const sortedUsersId = [...usersDocs].sort((a, b) => b.id - a.id)[0];
    const sortedUsers = usersDocs.sort((a, b) => b.panelId - a.panelId);

    if (sortedUsers.length !== 0) {
      const userDoc = sortedUsers[0];
      panelId = String(parseInt(userDoc.panelId) + 1);
      userId = parseInt(sortedUsersId.id) + 1;
    } else {
      panelId = "1";
      userId = 1;
    }
    userData.panelId = parseInt(panelId);
    userData.id = userId;
    addPanelDoc("admins", userData, panelId);
    addDoc("users", userData);
    return res
      .status(200)
      .send({ user: userData, success: "User Created Successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error creating user" });
  }
};
