import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js'; // <-- correct import
import testcontroller from '../controllers/testController.js';

const { authRegisterController } = authController;
const { authLoginController } = authController;
const {verifyEmailController} = authController;
const { getAllUsersController } = authController;
const { getUserController } = authController;
const { deleteUserController } = authController;
const { updateUserController } = authController;

const { testController } = testcontroller;
// remove: const { isAdmin } = testcontroller;

const router = express.Router();

router.post('/register', authRegisterController);
router.post('/login', authLoginController);
router.get('/test', testController);
router.post('/forget-password', authController.forgetPasswordController);
router.get("/verify-email/:token", verifyEmailController);

// admin routes
router.get('/all-users', authMiddleware, isAdmin, getAllUsersController);
router.get('/get-user/:id', authMiddleware, isAdmin, getUserController);
router.delete('/delete-user/:id', authMiddleware, isAdmin, deleteUserController);
router.put('/update-user/:id', authMiddleware, isAdmin, updateUserController);

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