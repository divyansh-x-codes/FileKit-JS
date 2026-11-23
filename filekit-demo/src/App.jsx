import { useState } from "react";
import FileKit from "filekit-js";

function App() {
  const [files, setFiles] = useState([]);
  const [report, setReport] = useState([]);
  const [maxSizeMB, setMaxSizeMB] = useState(5);
  const [maxWidth, setMaxWidth] = useState(2000);
  const [maxHeight, setMaxHeight] = useState(2000);
  const [isValidating, setIsValidating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Select files
  function handleFileSelection(event) {
    const selectedFiles = Array.from(event.target.files);

    setFiles((previousFiles) => {
      return [...previousFiles, ...selectedFiles];
    });

    setReport([]);
    event.target.value = "";
  }

  // Drag and drop helper (adds to files using same logic)
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((previousFiles) => [...previousFiles, ...droppedFiles]);
      setReport([]);
    }
  }

  // Remove one file
  function removeFile(index) {
    const updatedFiles = files.filter((file, i) => i !== index);

    setFiles(updatedFiles);
    setReport([]);
  }

  // Remove all files
  function clearAll() {
    setFiles([]);
    setReport([]);
  }

  // Validate all files
  async function validateFiles() {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    setIsValidating(true);

    const allowedTypes = [
      "image/*",
      ".pdf",
      ".doc",
      ".docx"
    ];

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      const typeResult = FileKit.validateFileType(
        file,
        allowedTypes
      );

      // Check file size
      const sizeResult = FileKit.validateFileSize(
        file,
        maxSizeMB
      );

      // Check image dimensions and capture actual dimensions
      let dimensionResult = "Not an image";
      let actualDimensions = null;

      if (file.type.startsWith("image/")) {
        try {
          if (typeof createImageBitmap === "function") {
            const bmp = await createImageBitmap(file);
            actualDimensions = `${bmp.width} × ${bmp.height} px`;
            bmp.close();
          }
        } catch (e) {
          // ignore bitmap error
        }

        try {
          dimensionResult = await FileKit.validateImageDimensions(
            file,
            maxWidth ? Number(maxWidth) : null,
            maxHeight ? Number(maxHeight) : null
          );
        } catch (error) {
          dimensionResult = "Could not read image dimensions";
        }
      }

      // Check overall result
      let isValid = false;

      if (
        typeResult === true &&
        sizeResult === true &&
        (
          dimensionResult === true ||
          dimensionResult === "Not an image"
        )
      ) {
        isValid = true;
      }

      // Get file information
      const fileInfo = FileKit.getFileInfo(file);

      // Clean file name
      const cleanName = FileKit.formatFileName(file.name);

      const actualType = file.type || (file.name.includes(".") ? `.${file.name.split(".").pop()}` : "Unknown");
      const actualSize = FileKit.formatFileSize(file.size);

      // Count checks passed for this item
      let itemPassedChecks = 0;
      let itemTotalChecks = 2; // Type and Size

      if (typeResult === true) itemPassedChecks++;
      if (sizeResult === true) itemPassedChecks++;

      if (file.type.startsWith("image/")) {
        itemTotalChecks = 3;
        if (dimensionResult === true) itemPassedChecks++;
      }

      const itemFailedChecks = itemTotalChecks - itemPassedChecks;

      results.push({
        file: file,
        info: fileInfo,
        type: typeResult,
        size: sizeResult,
        dimensions: dimensionResult,
        cleanName: cleanName,
        isValid: isValid,
        actualType: actualType,
        actualSize: actualSize,
        actualDimensions: actualDimensions,
        passedChecks: itemPassedChecks,
        failedChecks: itemFailedChecks,
        totalChecks: itemTotalChecks
      });
    }

    setReport(results);
    setIsValidating(false);
  }

  function copyCleanName(text, index) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  }

  // Count total checks passed and failed across all files
  const totalPassedChecks = report.reduce(
    (total, item) => total + (item.passedChecks || 0),
    0
  );

  const totalFailedChecks = report.reduce(
    (total, item) => total + (item.failedChecks || 0),
    0
  );

  const totalChecks = report.reduce(
    (total, item) => total + (item.totalChecks || 0),
    0
  );

  // Count fully passed files
  const passedFilesCount = report.filter(
    (item) => item.isValid === true
  ).length;

  const failedFilesCount = report.length - passedFilesCount;

  // Calculate total file size
  const totalBytes = files.reduce(
    (total, file) => total + file.size,
    0
  );

  return (
    <div className="page-wrapper">

      {/* Navbar */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="brand-group">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2 className="brand-title">
              FileKit <span>JS</span>
            </h2>
          </div>

          <div className="nav-actions">
            <a href="#features" className="nav-link">Features</a>
            <a href="#demo" className="nav-btn-primary">Try Demo</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-container">

          <div className="hero-pill">
            <span className="pulse-dot"></span>
            <span>LIGHTWEIGHT FILE PROCESSING TOOLKIT</span>
          </div>

          <h1 className="hero-title">
            Validate files effortlessly.
            <br />
            <span className="gradient-text">
              Upload with confidence.
            </span>
          </h1>

          <p className="hero-subtitle">
            Validate file types, check file sizes,
            verify image dimensions and clean file names.
          </p>

          <div className="hero-badges">
            <span className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              File Type Validation
            </span>
            <span className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              Size Validation
            </span>
            <span className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Image Checking
            </span>
            <span className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Zero Dependencies
            </span>
          </div>

        </div>
      </header>

      {/* Main Section */}
      <main className="main-content" id="demo">

        <div className="section-head">
          <div>
            <span className="section-badge">
              INTERACTIVE PLAYGROUND
            </span>

            <h2 className="section-title">
              Live File Validator
            </h2>

            <p className="section-desc">
              Select your files and validate them using FileKit JS.
            </p>
          </div>

          <div className="stats-cluster">
            <div className="stat-card">
              <span className="stat-number">
                {files.length}
              </span>
              <span className="stat-label">
                Files Selected
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-number">
                {FileKit.formatFileSize(totalBytes)}
              </span>
              <span className="stat-label">
                Total Size
              </span>
            </div>
          </div>
        </div>

        {/* Validation Rules */}
        <div className="rules-bar">
          <div className="rules-label">
            <span className="rule-dot"></span>
            <strong>Allowed:</strong>
            <span>Images, PDF, DOC and DOCX</span>
          </div>

          <div className="rule-select-group">
            <label htmlFor="maxSize">
              Maximum Size:
            </label>

            <select
              id="maxSize"
              value={maxSizeMB}
              onChange={(event) => {
                setMaxSizeMB(Number(event.target.value));
                setReport([]);
              }}
            >
              <option value="2">2 MB</option>
              <option value="5">5 MB</option>
              <option value="10">10 MB</option>
              <option value="25">25 MB</option>
            </select>
          </div>

          <div className="rule-dimensions-group">
            <label htmlFor="maxWidthInput">Max Dimensions:</label>
            <div className="dim-inputs">
              <div className="dim-input-wrapper">
                <span className="dim-prefix">W</span>
                <input
                  id="maxWidthInput"
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={maxWidth}
                  onChange={(event) => {
                    setMaxWidth(Number(event.target.value));
                    setReport([]);
                  }}
                  className="dim-input"
                  title="Max Width in pixels"
                />
                <span className="dim-suffix">px</span>
              </div>
              <span className="dim-cross">×</span>
              <div className="dim-input-wrapper">
                <span className="dim-prefix">H</span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={maxHeight}
                  onChange={(event) => {
                    setMaxHeight(Number(event.target.value));
                    setReport([]);
                  }}
                  className="dim-input"
                  title="Max Height in pixels"
                />
                <span className="dim-suffix">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Dropzone */}
        <section
          className={`dropzone-panel ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("files")?.click()}
        >

          <div className="dropzone-icon-ring">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <h3 className="dropzone-title">
            Choose files to upload
          </h3>

          <p className="dropzone-desc">
            Select multiple images or documents.
            Maximum {maxSizeMB} MB &middot; Max {maxWidth} × {maxHeight} px for images.
          </p>

          <div className="dropzone-btn-wrapper" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="files" className="btn-choose">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Choose Files
            </label>
            <input
              type="file"
              id="files"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelection}
              style={{ display: "none" }}
            />
          </div>

          <p className="dropzone-privacy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Your files are checked in your browser. They are not uploaded to any server.
          </p>

        </section>

        {/* Selected Files */}
        {files.length > 0 && (
          <section className="panel-card queue-card">

            <div className="card-header">
              <div>
                <h3 className="card-heading">
                  Selected Files ({files.length})
                </h3>

                <span className="card-sub">
                  {FileKit.formatFileSize(totalBytes)} selected
                </span>
              </div>

              <button
                className="btn-text-danger"
                onClick={clearAll}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Clear All
              </button>
            </div>

            <div className="file-items-list">

              {files.map((file, index) => {
                const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
                return (
                  <div
                    className="file-row"
                    key={file.name + index}
                  >
                    <div className={`file-badge-ext ext-${ext.toLowerCase()}`}>
                      {ext.slice(0, 4)}
                    </div>

                    <div className="file-meta">
                      <div className="file-top-meta">
                        <span className="file-name" title={file.name}>
                          {file.name}
                        </span>
                        <span className="file-tag-size">
                          {FileKit.formatFileSize(file.size)}
                        </span>
                      </div>

                      <div className="file-sub-meta">
                        <span className="file-type-label">
                          {file.type || "Unknown file type"}
                        </span>
                        <span className="file-clean-preview">
                          Clean name: <code>{FileKit.formatFileName(file.name)}</code>
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-remove-file"
                      onClick={() => removeFile(index)}
                      title="Remove file"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>Remove</span>
                    </button>
                  </div>
                );
              })}

            </div>

            <div className="card-actions-footer">
              <button
                className="btn-validate"
                onClick={validateFiles}
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <span className="spinner"></span>
                    Validating Files...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Run File Validation
                  </>
                )}
              </button>
            </div>

          </section>
        )}

        {/* Validation Report */}
        {report.length > 0 && (
          <section className="panel-card report-card">

            <div className="report-summary-banner">
              <div className="summary-info">
                <div className={`summary-orb ${failedFilesCount === 0 ? "orb-success" : "orb-warning"}`}>
                  {failedFilesCount === 0 ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1"/></svg>
                  )}
                </div>

                <div>
                  <h3 className="summary-title">
                    Validation Summary
                  </h3>

                  <p className="summary-desc">
                    {failedFilesCount === 0
                      ? `All files passed validation (${totalPassedChecks} of ${totalChecks} checks passed).`
                      : `${totalPassedChecks} of ${totalChecks} checks passed across ${report.length} ${report.length === 1 ? "file" : "files"}.`}
                  </p>
                </div>
              </div>

              <div className="summary-pills">
                <span className="count-badge badge-passed">
                  {totalPassedChecks} Passed
                </span>

                {totalFailedChecks > 0 && (
                  <span className="count-badge badge-failed">
                    {totalFailedChecks} Failed
                  </span>
                )}
              </div>

            </div>

            <div className="report-list">

              {report.map((item, index) => (
                <div
                  className={`report-item-card ${item.isValid ? "item-valid" : "item-invalid"}`}
                  key={item.info.name + index}
                >

                  <div className="report-item-top">
                    <div>
                      <h4 className="report-name">
                        {item.info.name}
                      </h4>

                      <span className="report-meta">
                        {item.info.type} · {item.info.size}
                      </span>
                    </div>

                    <span
                      className={
                        item.isValid
                          ? "badge badge-success"
                          : "badge badge-danger"
                      }
                    >
                      {item.isValid ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Verified ({item.passedChecks}/{item.totalChecks} Passed)
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Check Required ({item.passedChecks}/{item.totalChecks} Passed)
                        </>
                      )}
                    </span>
                  </div>

                  <div className="checks-grid">

                    <div className={`check-card ${item.type === true ? "check-pass" : "check-fail"}`}>
                      <div className="check-card-head">
                        <span className="check-icon">{item.type === true ? "✓" : "✗"}</span>
                        <h4>File Type</h4>
                      </div>

                      <p>
                        {item.type === true
                          ? "Passed (Allowed type)"
                          : item.type}
                      </p>
                      <div className="check-current-val">
                        <span>Current:</span>
                        <code>{item.actualType}</code>
                      </div>
                    </div>

                    <div className={`check-card ${item.size === true ? "check-pass" : "check-fail"}`}>
                      <div className="check-card-head">
                        <span className="check-icon">{item.size === true ? "✓" : "✗"}</span>
                        <h4>File Size</h4>
                      </div>

                      <p>
                        {item.size === true
                          ? `Passed (Under ${maxSizeMB} MB)`
                          : item.size}
                      </p>
                      <div className="check-current-val">
                        <span>Current:</span>
                        <code>{item.actualSize}</code>
                        <span className="val-target">(Max: {maxSizeMB} MB)</span>
                      </div>
                    </div>

                    <div className={`check-card ${item.dimensions === true || item.dimensions === "Not an image" ? "check-pass" : "check-fail"}`}>
                      <div className="check-card-head">
                        <span className="check-icon">{item.dimensions === true || item.dimensions === "Not an image" ? "✓" : "✗"}</span>
                        <h4>Image Dimensions</h4>
                      </div>

                      <p>
                        {item.dimensions === true
                          ? `Passed (Within ${maxWidth} × ${maxHeight} px)`
                          : item.dimensions === "Not an image"
                          ? "N/A (Document file)"
                          : item.dimensions}
                      </p>
                      {item.actualDimensions && (
                        <div className="check-current-val">
                          <span>Current:</span>
                          <code>{item.actualDimensions}</code>
                          <span className="val-target">(Max: {maxWidth} × {maxHeight} px)</span>
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="clean-name-box">
                    <div className="clean-name-text">
                      <span>Clean File Name:</span>
                      <code>{item.cleanName}</code>
                    </div>
                    <button
                      className="btn-copy-clean"
                      onClick={() => copyCleanName(item.cleanName, index)}
                      title="Copy clean name"
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </section>
        )}

        {/* Features */}
        <section className="features-section" id="features">

          <div className="section-meta center-meta">
            <span className="section-badge">
              FILEKIT UTILITIES
            </span>

            <h2 className="section-title">
              Everything you need to validate files
            </h2>
            <p className="section-desc">
              Lightweight browser utilities designed for zero server-overhead file processing.
            </p>
          </div>

          <div className="features-grid">

            <FeatureCard
              title="File Type Validation"
              desc="Check whether a file has an allowed format like images, PDF, and Word docs."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              }
            />

            <FeatureCard
              title="File Size Validation"
              desc="Check whether a file is within the maximum size limit before uploading."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              }
            />

            <FeatureCard
              title="Image Dimensions"
              desc="Check image width and height directly using browser-native image decoding."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              }
            />

            <FeatureCard
              title="Multiple File Validation"
              desc="Validate a list of files together and set a maximum allowed file count."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              }
            />

            <FeatureCard
              title="Name Sanitization"
              desc="Convert raw file names into a clean, lowercased, URL-safe format."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              }
            />

            <FeatureCard
              title="File Information"
              desc="Get human-readable file sizes, mime types, and detailed metadata."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              }
            />

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with <strong>FileKit JS</strong> &middot; Client-Side Browser Utilities
        </p>
      </footer>

    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="feature-card">
      {icon && <div className="feature-card-icon">{icon}</div>}
      <h3 className="feature-title">
        {title}
      </h3>

      <p className="feature-desc">
        {desc}
      </p>
    </div>
  );
}

export default App;
