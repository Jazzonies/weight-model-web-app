// ======================================================
// Weight Classification AI
// script.js
// Chunk 1
// ======================================================

// -------------------------
// Configuration
// -------------------------

const API_URL =
    "https://danielnicholasdilli-weight-mdel.hf.space/predict";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

// -------------------------
// DOM
// -------------------------

const imageInput =
    document.getElementById("imageInput");

const dropArea =
    document.getElementById("dropArea");

const previewSection =
    document.getElementById("previewSection");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const imageSize =
    document.getElementById("imageSize");

const removeBtn =
    document.getElementById("removeBtn");

const loadingSection =
    document.getElementById("loadingSection");

const loadingText =
    document.getElementById("loadingText");

const progressBar =
    document.getElementById("progressBar");

const resultSection =
    document.getElementById("resultSection");

const prediction =
    document.getElementById("prediction");

const confidence =
    document.getElementById("confidence");

const confidenceContainer =
    document.getElementById("confidenceContainer");

const errorSection =
    document.getElementById("errorSection");

const errorMessage =
    document.getElementById("errorMessage");

const retryBtn =
    document.getElementById("retryBtn");

const copyBtn =
    document.getElementById("copyBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const newBtn =
    document.getElementById("newBtn");

// -------------------------
// Variables
// -------------------------

let selectedImage = null;

let latestResult = null;

let isRunning = false;

// -------------------------
// Initialization
// -------------------------

hideError();
hideLoading();
hideResults();

// -------------------------
// Upload Events
// -------------------------

imageInput.addEventListener(
    "change",
    (e) => {

        if (!e.target.files.length)
            return;

        processFile(
            e.target.files[0]
        );

    }
);

// -------------------------
// Drag Events
// -------------------------

dropArea.addEventListener(
    "dragover",
    (e) => {

        e.preventDefault();

        dropArea.classList.add(
            "dragging"
        );

    }
);

dropArea.addEventListener(
    "dragleave",
    () => {

        dropArea.classList.remove(
            "dragging"
        );

    }
);

dropArea.addEventListener(
    "drop",
    (e) => {

        e.preventDefault();

        dropArea.classList.remove(
            "dragging"
        );

        const file =
            e.dataTransfer.files[0];

        if (!file)
            return;

        processFile(file);

    }
);

// -------------------------
// Remove
// -------------------------

removeBtn.addEventListener(
    "click",
    resetApp
);

// -------------------------
// Retry
// -------------------------

retryBtn.addEventListener(
    "click",
    () => {

        hideError();

        if (selectedImage)
            predict();

    }
);

// -------------------------
// New Prediction
// -------------------------

newBtn.addEventListener(
    "click",
    resetApp
);

// -------------------------
// Process File
// -------------------------

function processFile(file) {

    if (isRunning)
        return;

    hideError();

    if (
        !ALLOWED_TYPES.includes(
            file.type
        )
    ) {

        showError(
            "Only JPG, PNG and WEBP files are supported."
        );

        return;

    }

    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        showError(
            "Maximum image size is 10 MB."
        );

        return;

    }

    selectedImage = file;

    showPreview(file);

}

// -------------------------
// Preview
// -------------------------

function showPreview(file) {

    const reader =
        new FileReader();

    reader.onload = e => {

        previewImage.src =
            e.target.result;

    };

    reader.readAsDataURL(file);

    previewSection.classList.remove(
        "hidden"
    );

    fileName.textContent =
        file.name;

    imageSize.textContent =
        formatFileSize(file.size);

    setTimeout(
        predict,
        300
    );

}

// -------------------------
// Helpers
// -------------------------

function formatFileSize(bytes) {

    if (bytes < 1024)
        return bytes + " Bytes";

    if (bytes < 1048576)
        return (
            bytes / 1024
        ).toFixed(2) + " KB";

    return (
        bytes / 1048576
    ).toFixed(2) + " MB";

}

function resetApp() {

    imageInput.value = "";

    selectedImage = null;

    latestResult = null;

    previewImage.src = "";

    previewSection.classList.add(
        "hidden"
    );

    hideLoading();

    hideResults();

    hideError();

}

function showLoading() {

    loadingSection.classList.remove(
        "hidden"
    );

}

function hideLoading() {

    loadingSection.classList.add(
        "hidden"
    );

}

function hideResults() {

    resultSection.classList.add(
        "hidden"
    );

}

function showResults() {

    resultSection.classList.remove(
        "hidden"
    );

}

function showError(message) {

    errorMessage.textContent =
        message;

    errorSection.classList.remove(
        "hidden"
    );

}

function hideError() {

    errorSection.classList.add(
        "hidden"
    );

}
