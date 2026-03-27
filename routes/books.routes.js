import express from "express";
import {
  createBook,
  getBooks,
  deleteBooks,
  getBookById,
  editBookById,
} from "../controllers/book.controller.js";
import { uploadFile } from "../middlewares/uploads.js";

const router = express.Router();

router.post("/create", uploadFile, createBook);

router.get("/get", getBooks);

router.get("/getBookById/:id", getBookById);

router.patch("/editBookById/:id", uploadFile, editBookById);

router.delete("/delete/:id", deleteBooks);

export default router;
