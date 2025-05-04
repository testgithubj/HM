const express = require("express");
const user = require("./user");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.post("/admin", user.adminRegister);
router.get("/", auth, user.index);
router.post("/register", user.register);
router.post("/login", user.login);
router.post("/deleteMany", auth, user.deleteMany);
router.get("/view", auth, user.view);
router.patch("/delete/:id", auth, user.deleteData);
router.patch("/edit", auth, user.edit);
router.put("/change-roles/:id", auth, user.changeRoles);

module.exports = router;
