import userModel from "@/models/user";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import AdminModel from "@/models/admin";
import nodemailer from "nodemailer";

export const POST = async (req) => {
    
  const { email, password } = await req.json();

  try {
    // Connect to the database
    await connectDb();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user or admin exists
    const user = await userModel.findOne({ email: email });
    const admin = await AdminModel.findOne({ email: email });

    if (user) {
      // Update the user's password
      await userModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      await sendEmail(email);
      return new NextResponse(JSON.stringify({ msg: "Password updated successfully for user" }), { status: 200 });
    } else if (admin) {
      // Update the admin's password
      await AdminModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      await sendEmail(email);
      return new NextResponse(JSON.stringify({ msg: "Password updated successfully for admin" }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ msg: 'User not found' }), { status: 404 });
    }
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: 'Server Error' }), { status: 500 });
  }
};

// Function to send email
const sendEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS, 
      pass: process.env.EMAIL_APP_PASSWORD 
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Updated Successfully',
    text: 'Your password has been updated successfully. If you did not request this change, please contact support immediately.'
  };

  await transporter.sendMail(mailOptions);
};
