import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js'; // <-- correct import
import testcontroller from '../controllers/testController.js';

const { authRegisterController } = authController;
const { authLoginController } = authController;
const {verifyEmailController} = authController;
const { testController } = testcontroller;
// remove: const { isAdmin } = testcontroller;

const router = express.Router();

router.post('/register', authRegisterController);
router.post('/login', authLoginController);
router.get('/test', testController);
router.post('/forget-password', authController.forgetPasswordController);
router.get("/verify-email/:token", verifyEmailController);

// update profile (protected)
router.put('/update-profile', authMiddleware, authController.updateProfileController);

// Protected route
router.get('/user-auth', authMiddleware, (req, res) => {
  res.status(200).send({ ok: true });
});

// Admin route — uses middleware's isAdmin
router.get('/admin-auth', authMiddleware, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;