# 📁 FileKit JS

### Lightweight Client-Side File Validation & Processing Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](https://github.com/divyansh-x-codes/FileKit-JS)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite Demo](https://img.shields.io/badge/Demo-React%2019%20%2B%20Vite-646CFF.svg)](https://github.com/divyansh-x-codes/FileKit-JS)

**FileKit JS** is a zero-dependency, beginner-friendly JavaScript utility library designed to validate, sanitize, and inspect files directly in the user's browser before uploading them to a backend server.

---

## 🗂️ Project Structure

This monorepo contains both the library and an interactive live playground:

```text
FileKit-JS/
├── filekit-js/        # The core npm JavaScript library
│   ├── index.js       # Core validation functions
│   ├── filekit.test.js# Node.js native test suite
│   └── package.json
└── filekit-demo/      # React 19 + Vite interactive demo web app
    ├── src/
    │   ├── App.jsx    # Live File Validator playground UI
    │   ├── style.css  # Modern SaaS UI styling
    │   └── main.jsx
    └── package.json
```

---

## ✨ Key Features

- 📄 **File Type Validation**: Enforce allowed MIME types or extensions (`.pdf`, `image/*`, `.docx`).
- 📦 **File Size Limits**: Restrict file sizes in megabytes client-side to save server bandwidth.
- 🖼️ **Image Dimension Checking**: Fast browser-native `createImageBitmap` validation for max width & height without heavy canvas rendering.
- 🧹 **File Name Sanitization**: Convert messy, unsafe file names into clean, lowercase, URL-friendly strings (`my-safe-document.pdf`).
- 📊 **Readable Metadata**: Format raw byte sizes into human-readable strings (`KB`, `MB`) and extract file info objects.
- 📚 **Batch Validation**: Validate groups of files with limit constraints.
- 🔒 **100% Client-Side Privacy**: Files never leave user memory during validation.

---

## 🚀 Quickstart & Usage

### 1. Installation

```bash
npm install filekit-js
```

### 2. Import

```javascript
import FileKit from "filekit-js";
```

### 3. Examples

#### Validate Allowed File Types
```javascript
const isAllowed = FileKit.validateFileType(file, [
  "image/*",
  ".pdf",
  ".doc",
  ".docx"
]);

if (isAllowed === true) {
  console.log("File type accepted!");
} else {
  console.warn(isAllowed); // "File type is not allowed"
}
```

#### Validate Maximum File Size
```javascript
const isSizeValid = FileKit.validateFileSize(file, 5); // 5 MB limit

if (isSizeValid === true) {
  console.log("File size within limit.");
} else {
  console.warn(isSizeValid); // "File size must be less than 5 MB"
}
```

#### Validate Image Dimensions
```javascript
if (file.type.startsWith("image/")) {
  const isDimValid = await FileKit.validateImageDimensions(file, 1920, 1080);
  if (isDimValid === true) {
    console.log("Image fits dimensions!");
  } else {
    console.warn(isDimValid); // "Image width must not be more than 1920 pixels"
  }
}
```

#### Sanitize File Name
```javascript
const safeName = FileKit.formatFileName("My Unsafe Photo (Final)!.PNG");
console.log(safeName); // "my-unsafe-photo-final.png"
```

#### Format File Size
```javascript
console.log(FileKit.formatFileSize(1048576)); // "1.00 MB"
```

---

## 🧪 Running Tests

The core library uses Node.js native test runner:

```bash
cd filekit-js
npm test
```

---

## 💻 Running the Live Demo

To run the interactive React playground locally:

```bash
cd filekit-demo
npm install
npm run dev
```

Open the local Vite URL (e.g. `http://localhost:5173`) in your browser.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
Built by [Divyansh](https://github.com/divyansh-x-codes).
