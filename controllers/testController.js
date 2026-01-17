import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
const testController =(req, res) => {


    // Set a test secret
    const SECRET = "mytestsecret123";

    // ---------- Generate Token ----------
    const payload = { userId: 101, role: "admin" };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
    
    // ---------- Verify Token ----------
    jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
        console.error("JWT Verification Error:", err.message);
    } else {
        console.log("Decoded Token:", decoded);
    }
    });

}
const isAdmin = async (req, res, next) => {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user is an admin    
    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
}

export default { testController, isAdmin };