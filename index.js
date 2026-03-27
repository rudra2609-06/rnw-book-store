import express from "express";
import dbConnect from "./configs/db.js";
import bookRouter from "./routes/books.routes.js";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/uploads", express.static("./uploads"));

app.use("/book", bookRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error Occured");
  } else {
    console.log(`http://localhost:${PORT}`);
  }
});
