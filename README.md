# RNW Book Store API

RESTful service for managing a lightweight catalog of books, built with Express 5, Mongoose 9, and Multer for cover image uploads. Use it to create, read, update, and delete book records while persisting metadata in MongoDB and storing cover images on disk.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [File Uploads](#file-uploads)
- [API Reference](#api-reference)
- [Validation & Error Handling](#validation--error-handling)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

## Features
- CRUD endpoints for book metadata (title, author, genre, price) with server-side validation.
- Cover image uploads handled through Multer and served back via `/uploads`.
- MongoDB integration via Mongoose, including automatic timestamps and duplicate key handling.
- Modular structure with isolated configs, models, controllers, routes, and middlewares.
- Helpful JSON responses with appropriate HTTP status codes (201 for creates, 409 for conflicts, etc.).

## Tech Stack
- Node.js 18+ and npm
- Express 5.2
- Mongoose 9.3
- Multer 2.1
- MongoDB 6+ (local instance by default)

## Project Structure
```
rnw-book-store/
├── configs/
│   └── db.js
├── controllers/
│   └── book.controller.js
├── middlewares/
│   └── uploads.js
├── models/
│   └── book.model.js
├── routes/
│   └── books.routes.js
├── uploads/                # runtime-generated cover images
├── index.js
├── package.json
└── README.md
```

## Getting Started
1. **Clone**: `git clone https://github.com/rudra2609-06/rnw-book-store.git && cd rnw-book-store`
2. **Install** dependencies: `npm install`
3. **Ensure MongoDB is running** locally (defaults to `mongodb://localhost:27017/booktbl`).
4. **Start** the API: `node index.js`
5. The server listens on `http://localhost:8000` and immediately exposes `/book` endpoints plus static `/uploads`.

> Current `package.json` only defines the placeholder `npm test`. Add scripts such as `dev` or `start` as needed for your workflow.

## Configuration
Database connectivity lives in `configs/db.js` and is executed on import. Update the connection string to match your environment:

```js
await mongoose.connect("mongodb://localhost:27017/booktbl");
```

For environment-based configuration, consider replacing the literal string with `process.env.MONGO_URL`. Example:

```js
await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/booktbl");
```

Then create a `.env` file and load it with tools like `dotenv` (not yet included).

## Running the Server
```bash
npm install
node index.js
# open http://localhost:8000
```

Logs:
- `db Connected` indicates MongoDB connectivity.
- `http://localhost:8000` confirms the Express server is listening.

## File Uploads
- Middleware: `middlewares/uploads.js` uses Multer's disk storage.
- Request field: `coverPage` (single file). Files are saved to the `uploads/` folder with the pattern `<timestamp>-<original-name>`.
- Static access: Express serves `/uploads` so you can retrieve a stored image via `http://localhost:8000/uploads/<filename>`.

## API Reference
Base URL: `http://localhost:8000`

### Create Book
- **Endpoint**: `POST /book/create`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title` (string, required)
  - `price` (number, required)
  - `authorName` (string, required)
  - `genre` (enum: `Business | Comic | Academics`, required)
  - `coverPage` (file, required image/pdf/etc.)
- **Sample**:
  ```bash
  curl -X POST http://localhost:8000/book/create \
       -F "title=The Lean Startup" \
       -F "price=24.99" \
       -F "authorName=Eric Ries" \
       -F "genre=Business" \
       -F "coverPage=@./cover.jpg"
  ```
- **Responses**:
  - `201 Created` with `{ message, data }`
  - `409 Conflict` when a book with the same unique fields already exists.
  - `400 Bad Request` when validation fails or the cover image is missing.

### List Books
- **Endpoint**: `GET /book/get`
- **Description**: Returns all stored books.
- **Response**: `200 OK` with `{ message, data: Book[] }`

### Get Book by ID
- **Endpoint**: `GET /book/getBookById/:id`
- **Params**: `id` (MongoDB ObjectId)
- **Response**: `200 OK` with the book document (timestamps excluded). `400` if the `id` param is missing, `404` if not found.

### Update Book
- **Endpoint**: `PATCH /book/editBookById/:id`
- **Content-Type**: `application/json` (route currently wires Multer, but controller updates fields from `req.body`)
- **Behavior**: Partially updates supplied fields and returns the updated document.
- **Response**: `200 OK` with `{ message, data }`

### Delete Book
- **Endpoint**: `DELETE /book/delete/:id`
- **Response**: `200 OK` with the deleted document payload.

### Serve Uploaded Files
- **Endpoint**: `GET /uploads/:filename`
- **Description**: Streams the stored cover image back to clients.

## Validation & Error Handling
- Schema-level validation enforces required fields and genre enum values.
- Duplicate titles/authors (as defined in Mongo indexes) trigger a `409 Conflict`.
- Missing file uploads respond with `400 Bad Request`.
- All other errors fall back to `500 Internal Server Error` with a descriptive message when available.

## Development Notes
- **Database schema**: defined in `models/book.model.js` with `timestamps: true`.
- **Controller flow**: controllers/book.controller.js orchestrates CRUD operations, logs errors, and shapes responses.
- **Routing**: routes/books.routes.js mounts on `/book` (see `index.js`), keeping express app lean.
- **Static assets**: `app.use("/uploads", express.static("./uploads"));` exposes saved cover images.
- **Future ideas**:
  1. Add `.env` support and configurable port/connection strings.
  2. Replace `console.log` with a structured logger (pino/winston).
  3. Add request validation middleware (e.g., Joi/Zod) to provide earlier feedback.
  4. Introduce pagination & filtering for `GET /book/get`.
  5. Replace `findByIdAndUpdate` options with `{ new: true }` to ensure the latest document is returned.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/amazing-feature`.
3. Commit your changes: `git commit -m "feat: add amazing feature"`.
4. Push to the branch: `git push origin feat/amazing-feature`.
5. Open a Pull Request describing the motivation and testing steps.

## License
Distributed under the ISC License. See `package.json` for details.
