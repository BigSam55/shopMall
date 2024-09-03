import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    productCategory: {
    type: String,
    trim: true,
    required: [true, 'category is required'],
  },
}, { timestamps: true });

const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema);

export default categoryModel;
