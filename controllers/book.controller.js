import { validationResult } from "express-validator";
import BookModel from "../models/book.model.js";

export const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = { ...req.body, coverPage: req.file?.path };
    const book = await BookModel.create(req.body);
    return res
      .status(201)
      .json({ message: "Book Created Successfully", data: book });
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Book already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Cover page is required" });
    }
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const searchParams = req.query.search || "";
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const skipformula = (page - 1) * limit;
    const books = await BookModel.find({
      title: { $regex: searchParams, $options: "i" },
    })
      .sort({ title: -1 })
      .skip(skipformula)
      .limit(limit);

    return res
      .status(200)
      .json({
        message: "Successfully Fetched Books",
        data: { books, limit, page },
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};


