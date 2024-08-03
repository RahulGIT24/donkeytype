import mongoose from "mongoose";

interface User extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  profilePic: string;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter an id"],
    },
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

export const User = mongoose.model<User>("User", schema);
