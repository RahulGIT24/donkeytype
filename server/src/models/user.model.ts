import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  profilePic: string;
  verifyToken: string;
  verifyTokenExpiry: Date | "";
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  refreshToken: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  passwordCompare: (password:string) => boolean;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    username: {
      type: String,
      unique: [true, "Username already taken"],
      required: [true, "Please enter your username"],
    },
    email: {
      type: String,
      unique: [true, "Email already registered"],
      required: [true, "Please enter your username"],
    },
    password: {
      type: String,
      required: [true, "Please enter your username"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    profilePic: {
      type: String,
      default:
        "https://imgs.search.brave.com/g0-Hfj3-TW9Xz1aHsaW5ENDHDrmssNkyyXeigI4Rr14/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iZWZv/cmVpZ29zb2x1dGlv/bnMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEyL2R1/bW15LXByb2ZpbGUt/cGljLTMwMHgzMDAt/MS5wbmc",
    },
  },
  {
    timestamps: true,
  }
);

schema.methods.passwordCompare = function (password: string) {
  return bcrypt.compare(password, this.password);
};

schema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

schema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model<User>("User", schema);
