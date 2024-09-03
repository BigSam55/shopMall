import mongoose from "mongoose";

// Create a Mongoose schema for the product
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    trim: true,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    trim: true,
    required: [true, 'Price is required'],
  },
  quantity: {
    type: Number,
    trim: true,
    required: [true, 'Quantity is required'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'category is required'],
  },
  image: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to capitalize product name
productSchema.pre('save', function (next) {
  this.productName = this.productName.charAt(0).toUpperCase() + this.productName.slice(1).toLowerCase();
  next();
});

// Create the model if it doesn't already exist
const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
