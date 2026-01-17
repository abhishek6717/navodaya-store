import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { 
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true,   
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32   
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number,
        required: true  
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        required: false
    },
    rating: {
        type: Number,
        default: 0
    }
    
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);