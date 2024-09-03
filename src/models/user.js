import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
        trim:true,

    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true

    },
    password:{
        type:String,
        trim:true,
        min:6,
    },
    role:{
        type: String,
        default: "user",
      }
      
},{timestamps:true})

userSchema.pre('save', function (next) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    next();
  });

// lets model our table
const userModel= mongoose.models.user || mongoose.model('user', userSchema)
export default userModel;