import mongoose, { Mongoose } from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/booktbl");
    console.log("db Connected");
  } catch (error) {
    console.log(error.message || error);
  }
};

export default dbConnect();
