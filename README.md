# RNW Book Store API

Minimal Express + MongoDB service for storing book metadata with cover uploads. The current codebase focuses on two endpoints (create and list) plus basic validation and static serving of uploaded files.

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
- [Limitations & Next Steps](#limitations--next-steps)

## Features
- Create books with `multipart/form-data` payloads that include title, price, author, genre, and a `coverPage` file saved under `/uploads`.
- Retrieve books with optional `search`, `page`, and `limit` query parameters; results are sorted alphabetically (descending) by title.
- Centralized schema/validation rules via Mongoose models and `express-validator` to keep controller logic lean.
- Static serving of uploaded files so clients can immediately render cover images returned from Create responses.
- Modular layout with dedicated folders for configs, controllers, middlewares, models, routes, and validators.

## Tech Stack
- Node.js 18+
- Express 5.2
- Mongoose 9.3
- Multer 2.1
- express-validator 7.3
- MongoDB 6+ (local instance assumed)

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
├── validator/
│   └── bookModel.validator.js
├── uploads/                # runtime-generated cover images
├── index.js
├── package.json
└── README.md
```

## Getting Started
1. **Clone**: `git clone https://github.com/rudra2609-06/rnw-book-store.git && cd rnw-book-store`
2. **Install**: `npm install`
3. **Run MongoDB locally** on the default URI `mongodb://localhost:27017/booktbl`.
4. **Boot the API**: `node index.js`
5. Visit `http://localhost:8000` (logged once the server is ready). All routes are mounted beneath `/book`.

> `package.json` only ships with the placeholder `npm test`. Add `dev` or `start` scripts if you prefer `npm run dev` instead of invoking `node index.js` directly.

## Configuration
- **Database**: `configs/db.js` connects immediately on import using `mongoose.connect("mongodb://localhost:27017/booktbl")`. Update the string if you run Mongo elsewhere.
- **Port**: hard-coded to `8000` in `index.js`. Replace with `process.env.PORT || 8000` if you need configurability.
- **Environment variables**: not yet wired. To externalize secrets, introduce a `.env` file and load it before calling `mongoose.connect`.

## Running the Server
```bash
npm install
node index.js
# => db Connected
# => http://localhost:8000
```

## File Uploads
- Multer storage (see `middlewares/uploads.js`) stores files under `uploads/` with the pattern `<timestamp>-<original-name>`.
- Controllers expect the multipart field to be named `coverPage`.
- Express statically serves `/uploads`, so a stored file can be fetched at `http://localhost:8000/uploads/<filename>`.

## API Reference
Base URL: `http://localhost:8000`

### Create Book
- **Endpoint**: `POST /book/create`
- **Content-Type**: `multipart/form-data`
- **Body fields**
  - `title` – string
  - `price` – numeric (handled as float)
  - `authorName` – string
  - `genre` – enum (`Business | Comic | Academics`)
  - `coverPage` – single file upload
- **Sample**
  ```bash
  curl -X POST http://localhost:8000/book/create \
       -F "title=The Lean Startup" \
       -F "price=24.99" \
       -F "authorName=Eric Ries" \
       -F "genre=Business" \
       -F "coverPage=@./cover.jpg"
  ```
- **Responses**
  - `201 Created` with `{ message, data }`
  - `400 Bad Request` when validation fails or `coverPage` is missing
  - `409 Conflict` when Mongo reports a duplicate key violation
  - `500 Internal Server Error` for everything else

### List Books
- **Endpoint**: `GET /book/get`
- **Query params**
  - `search` – optional substring filter matched against `title` (case-insensitive regex)
  - `page` – page number (defaults to `1`)
  - `limit` – number of docs per page (defaults to `5`)
- **Behavior**: applies regex filter, sorts by `title` descending, then paginates with `skip`/`limit`.
- **Response**: `200 OK` with `{ message, data: { books, limit, page } }`

## Validation & Error Handling
- `validator/bookModel.validator.js` enforces non-empty strings for `title` and `authorName`, float validation for `price`, and restricts `genre` to the defined enum.
- Controllers call `validationResult` before touching Mongo; failures return `{ errors: [...] }` with status `400`.
- `req.file?.path` is injected into the body so the schema requirement `coverPage: String` is satisfied when Multer runs.
- Duplicate key errors (`error.code === 11000`) emit `409 Conflict` with a helpful message. All other thrown errors bubble up to a 500 with `error.message` if present.

## Limitations & Next Steps
- Only `POST /book/create` and `GET /book/get` exist; there are no `GET /:id`, `PATCH`, or `DELETE` routes yet.
- `dbConnect` executes as soon as `configs/db.js` is imported, so you cannot defer connection logic or handle retries at the call site.
- `price` validation ensures numeric input but does not enforce a positive minimum.
- Configuration is hard-coded (Mongo URI, port). Introducing environment variables and a config loader would make deployments safer.
- Uploaded files are never cleaned up; consider background jobs or a lifecycle policy if storage is a concern.
