import mongoose from "mongoose";

// Create a Mongoose schema for the product
const featuredSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    
  },
  image: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to capitalize product name
featuredSchema.pre('save', function (next) {
  this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
  next();
});

// Create the model if it doesn't already exist
const featuredModel = mongoose.models.featured || mongoose.model('featured', featuredSchema);

export default  featuredModel