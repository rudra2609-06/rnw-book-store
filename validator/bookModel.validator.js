import { body } from "express-validator";

export const bookValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat().withMessage("Price must be a number greater than 0"),

  body("authorName")
    .notEmpty().withMessage("Author name is required")
    .isString().withMessage("Author name must be a string"),

  body("genre")
    .notEmpty().withMessage("Genre is required")
    .isIn(["Business", "Comic", "Academics"])
    .withMessage("Genre must be one of Business, Comic, Academics"),
];