import BookModel from "../models/book.model.js";

export const createBook = async (req, res) => {
  try {
    console.log(req.body);
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
    const books = await BookModel.find({});
    return res
      .status(200)
      .json({ message: "Successfully Fetched Books", data: books });
  } catch (error) {
    console.log(error.message);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Required Book Id" });
    }
    const bookById = await BookModel.findById(id).select(
      "-createdAt -updatedAt"
    );
    return res
      .status(200)
      .json({ message: "Book Found Successfully", data: bookById });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const editBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;
    if (!id) {
      return res.status(400).json({ message: "Required Book Id" });
    }
    const updatedBook = await BookModel.findByIdAndUpdate(
      id,
      {
        $set: dataToUpdate,
      },
      { after: true }
    );
    return res
      .status(200)
      .json({ message: "Book Updated Successfully", data: updatedBook });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteBooks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Required Book Id" });
    }
    const bookDeleted = await BookModel.findByIdAndDelete(id).select(
      "-createdAt -updatedAt"
    );
    return res
      .status(200)
      .json({ message: "Book Deleted Successfully", data: bookDeleted });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
