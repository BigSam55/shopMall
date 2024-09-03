import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, "Password must be at least 6 characters long"],
    required: [true, "Password is required"],
  },
  role:{
    type: String,
    default: 'admin',
  }
}, { timestamps: true });

adminSchema.pre('save', function (next) {
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

// Let's model our table
const AdminModel = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default AdminModel;
