const {
  Register,
  login,
  authenticate,
  forgotPassword,
  updatePassword,
} = require("../controllers/userController");
const { Router } = require("express");

const router = Router();

router.post("/register", Register);
router.post("/login", login);
router.put("/authenticate/:id/:token", authenticate);
router.post("/sendMail", forgotPassword);
router.put("/update-password/:id", updatePassword);

module.exports = router;
