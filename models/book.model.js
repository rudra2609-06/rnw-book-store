import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverPage: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: ["Business", "Comic", "Academics"],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("booktbl", BookSchema);

export default BookModel;
