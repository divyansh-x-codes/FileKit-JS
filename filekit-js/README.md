# 📁 FileKit JS

### A Lightweight JavaScript File Processing & Validation Toolkit

[![npm version](https://img.shields.io/npm/v/filekit-js.svg)](https://www.npmjs.com/package/filekit-js)
[![npm downloads](https://img.shields.io/npm/dm/filekit-js.svg)](https://www.npmjs.com/package/filekit-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](https://www.npmjs.com/package/filekit-js)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🚀 Overview

**FileKit JS** is a lightweight, beginner-friendly JavaScript library designed to simplify file validation and file processing in web applications.

It provides reusable functions to validate file types, check file sizes, verify image dimensions, format file names, and retrieve file information.

FileKit helps developers build safer and more organized file upload experiences without depending on large external libraries.

## ✨ Features

- 📄 **File Type Validation** – Check whether uploaded files match the allowed file formats.
- 📦 **File Size Validation** – Set maximum file size limits in MB.
- 🖼️ **Image Dimension Checking** – Validate image width and height.
- 📝 **File Name Formatting** – Clean and format file names.
- 📊 **File Information** – Retrieve file name, type, and size.
- 📁 **Multiple File Support** – Validate multiple selected files.
- ⚡ **Lightweight** – Designed to work without unnecessary dependencies.
- ⚛️ **React Compatible** – Easily integrate with React applications.

## 📦 Installation

Install FileKit JS using npm:

```bash
npm install filekit-js
```

## 🛠️ Importing FileKit

Import the library into your JavaScript project:

```javascript
import FileKit from "filekit-js";
```

You can now use its validation and file processing functions.

## 📚 Available Functions

| Function | Description |
|---|---|
| `validateFileType()` | Validates file formats |
| `validateFileSize()` | Checks maximum file size |
| `validateImageDimensions()` | Checks image dimensions |
| `formatFileName()` | Formats file names |
| `formatFileSize()` | Converts bytes into readable sizes |
| `getFileInfo()` | Returns basic file information |

---

## 💻 Usage Examples

### 1. File Type Validation

Check whether a file belongs to an allowed file type.

```javascript
const fileInput = document.querySelector("#file");
const file = fileInput.files[0];

const result = FileKit.validateFileType(
  file,
  ["image/*", ".pdf", ".doc", ".docx"]
);

if (result === true) {
  console.log("Valid file type");
} else {
  console.log(result);
}
```

### 2. File Size Validation

Set a maximum file size limit.

```javascript
const result = FileKit.validateFileSize(file, 5);

if (result === true) {
  console.log("File size is valid");
} else {
  console.log(result);
}
```

The example above checks whether the file is within 5 MB.

### 3. Image Dimension Validation

Check the maximum width and height of an image.

```javascript
const result = await FileKit.validateImageDimensions(
  file,
  2000,
  2000
);

if (result === true) {
  console.log("Image dimensions are valid");
} else {
  console.log(result);
}
```

This function is asynchronous because the browser needs to load the image before checking its dimensions.

### 4. File Name Formatting

Convert a file name into a clean and readable format.

```javascript
const cleanName = FileKit.formatFileName(
  "My Profile Image.png"
);

console.log(cleanName);
```

### 5. File Size Formatting

Convert file size from bytes into a readable format.

```javascript
const readableSize = FileKit.formatFileSize(
  file.size
);

console.log(readableSize);
```

Example output:

```text
2.5 MB
```

### 6. Get File Information

Retrieve basic information about a selected file.

```javascript
const information = FileKit.getFileInfo(file);

console.log(information);
```

Example output:

```javascript
{
  name: "profile.png",
  type: "image/png",
  size: "2.5 MB"
}
```

---

## ⚛️ React Integration

FileKit JS can be used inside React applications.

### Step 1: Install the package

```bash
npm install filekit-js
```

### Step 2: Import FileKit

```javascript
import FileKit from "filekit-js";
```

### Step 3: Use it in your component

```jsx
import { useState } from "react";
import FileKit from "filekit-js";

function App() {
  const [message, setMessage] = useState("");

  function handleFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const result = FileKit.validateFileSize(file, 5);

    if (result === true) {
      setMessage("File is valid!");
    } else {
      setMessage(result);
    }
  }

  return (
    <div>
      <h1>FileKit Demo</h1>

      <input type="file" onChange={handleFile} />

      <p>{message}</p>
    </div>
  );
}

export default App;
```

---

## 🧪 Testing

FileKit JS uses Node.js's built-in testing tools.

Run the tests using:

```bash
npm test
```

## 📂 Project Structure

```text
filekit-js/
│
├── index.js
├── package.json
├── README.md
└── validation.test.js
```

| File | Purpose |
|---|---|
| `index.js` | Main library logic |
| `package.json` | Package configuration |
| `README.md` | Documentation |
| `validation.test.js` | Test cases |

## 🌐 Browser Compatibility

FileKit JS is designed for browser-based file handling using the JavaScript File API.

It is suitable for applications built with:

- React
- JavaScript
- Vite
- HTML and CSS
- Other browser-based JavaScript frameworks

## 🔒 Important Note

FileKit JS provides client-side file validation to improve the file upload experience.

Client-side validation should not replace server-side validation. Always validate file types, sizes, and uploaded content on your backend before storing or processing user files.

## 🗺️ Future Improvements

Planned improvements may include:

- Drag-and-drop file utilities
- Multiple file validation helpers
- More image processing utilities
- Additional file metadata extraction
- More file format support

## 👨‍💻 Author

**Vishal Maurya**

- GitHub: [@divyansh-x-codes](https://github.com/vishal02011)
- npm: [@divyansh-x-codes](https://github.com/vishal02011)

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using JavaScript
</p>

<p align="center">
  <strong>FileKit JS – Simplifying File Validation.</strong>
</p>