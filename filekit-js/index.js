// FileKit JS - beginner-friendly file utilities

function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes < 0) return "Invalid file size";
  if (bytes < 1024) return bytes + " Bytes";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function validateFileType(file, allowedTypes) {
  if (!file) return "Please select a file";
  if (!allowedTypes || allowedTypes.length === 0) return "Please provide allowed file types";

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  for (let i = 0; i < allowedTypes.length; i++) {
    const allowed = allowedTypes[i].toLowerCase();

    if (allowed.startsWith(".") && name.endsWith(allowed)) return true;

    if (allowed.endsWith("/*")) {
      const mainType = allowed.slice(0, allowed.indexOf("/"));
      if (type.startsWith(mainType + "/")) return true;
    }

    if (type === allowed) return true;
  }

  return "File type is not allowed";
}

function validateFileSize(file, maxSizeMB) {
  if (!file) return "Please select a file";
  if (typeof maxSizeMB !== "number" || maxSizeMB <= 0) {
    return "Maximum size must be a number greater than 0";
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) return "File size must be less than " + maxSizeMB + " MB";
  return true;
}

async function validateImageDimensions(file, maxWidth, maxHeight) {
  if (!file) return "Please select an image";
  if (!file.type || !file.type.startsWith("image/")) return "Selected file is not an image";
  if (typeof createImageBitmap !== "function") {
    return "Image dimension checking is not supported in this browser";
  }

  try {
    const image = await createImageBitmap(file);
    const width = image.width;
    const height = image.height;
    image.close();

    if (maxWidth && width > maxWidth) return "Image width must not be more than " + maxWidth + " pixels";
    if (maxHeight && height > maxHeight) return "Image height must not be more than " + maxHeight + " pixels";
    return true;
  } catch {
    return "Could not read image dimensions";
  }
}

function formatFileName(fileName) {
  if (!fileName || typeof fileName !== "string") return "";
  return fileName.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
}

function validateMultipleFiles(files, allowedTypes, maxSizeMB, maxFiles) {
  const errors = [];
  if (!files || files.length === 0) {
    return { valid: false, errors: ["Please select at least one file"] };
  }

  if (maxFiles && files.length > maxFiles) {
    errors.push("You can select a maximum of " + maxFiles + " files");
  }

  for (let i = 0; i < files.length; i++) {
    const typeResult = validateFileType(files[i], allowedTypes);
    const sizeResult = validateFileSize(files[i], maxSizeMB);
    if (typeResult !== true) errors.push(files[i].name + ": " + typeResult);
    if (sizeResult !== true) errors.push(files[i].name + ": " + sizeResult);
  }

  return { valid: errors.length === 0, errors: errors };
}

function getFileInfo(file) {
  if (!file) return null;
  return {
    name: file.name,
    type: file.type || "Unknown",
    size: formatFileSize(file.size),
    sizeInBytes: file.size
  };
}

const FileKit = {
  formatFileSize,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  formatFileName,
  validateMultipleFiles,
  getFileInfo
};

export default FileKit;
export {
  formatFileSize,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  formatFileName,
  validateMultipleFiles,
  getFileInfo
};
