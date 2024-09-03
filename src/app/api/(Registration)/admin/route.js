import adminModel from "@/models/admin";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import connectDb from "@/utils/db";

const sendWelcomeEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Welcome to ShopMall',
      text: `You're welcome to ShopMall, you can now buy and sell products from us at shopMall.com`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const POST = async (request) => {
  const { fullname, email, password,} = await request.json();

  try {
    await connectDb();

    const userEmailExists = await adminModel.findOne({ email });

    if (userEmailExists) {
      return new NextResponse(JSON.stringify({ message: "User already exists" }), { status: 400 });
      
    }

    const salt = bcrypt.genSaltSync(16);
    const hashPassword = bcrypt.hashSync(password, salt);

    const admin = new adminModel({
      name: fullname,
      email: email,
      password: hashPassword,
      role: "admin",
    });

    await admin.save();
    console.log(admin);

    if (admin) {
      await sendWelcomeEmail(email);
      return new NextResponse(JSON.stringify({ message: "Registration successful" }), { status: 200 });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
};
