import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "Email already exist"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, , "Password length should be greather then 6 char"],
    },
    address: { type: String, required: [true, "address is required"] },
    city: { type: String, required: [true, "city is required"] },
    country: { type: String, required: [true, "country is required"] },
    //phone: { type: String, required: [true, "Phone No is required"] },
    profilePic: {
      public_id: { type: String },
      url: { type: String },
    },
    answer: { type: String, required: [true, "answer is required"] },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

//function
//hash function
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};
//JWT Token
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const userModel = mongoose.model("Users", userSchema);
export default userModel;
