import express from "express";
import { createBook, getBooks } from "../controllers/book.controller.js";
import { uploadFile } from "../middlewares/uploads.js";
import { bookValidator } from "../validator/bookModel.validator.js";

const router = express.Router();

router.post("/create", uploadFile, bookValidator, createBook);

router.get("/get", getBooks);

export default router;
