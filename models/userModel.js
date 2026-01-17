import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {  
    type: String,
    required: true,
  },   
  address: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: String,
}, 
{timestamps: true});

const User = mongoose.model("user", userSchema);
export default User;