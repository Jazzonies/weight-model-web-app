// ==========================================================
// Weight Classification AI
// Part 3A.1
// ==========================================================

import { Client } from "https://esm.sh/@gradio/client";

//============================================================
// DOM Elements
//============================================================

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");

const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");

const fileName = document.getElementById("fileName");
const imageSize = document.getElementById("imageSize");

const removeImage = document.getElementById("removeImage");

const loadingSection = document.getElementById("loadingSection");

const loadingText = document.getElementById("loadingText");

const progressBar = document.getElementById("progressBar");

const resultSection = document.getElementById("resultSection");

const prediction = document.getElementById("prediction");

const confidence = document.getElementById("confidence");

const allPredictions = document.getElementById("allPredictions");

const errorSection = document.getElementById("errorSection");

const errorMessage = document.getElementById("errorMessage");

const retryBtn = document.getElementById("retryBtn");

const copyBtn = document.getElementById("copyBtn");

const downloadBtn = document.getElementById("downloadBtn");

const newPrediction = document.getElementById("newPrediction");

//============================================================
// Global Variables
//============================================================

let client = null;

let selectedImage = null;

let latestPrediction = null;

let isPredicting = false;

//============================================================
// Configuration
//============================================================

const HF_SPACE = "DANIELNICHOLASDILLI/Weight_Mdel";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [

    "image/jpeg",

    "image/png",

    "image/webp"

];

//============================================================
// Initialize App
//============================================================

window.addEventListener("DOMContentLoaded", async () => {

    await initializeClient();

});

//============================================================
// Connect to HuggingFace
//============================================================

async function initializeClient() {

    try {

        loadingText.textContent = "Connecting to AI model...";

        client = await Client.connect(HF_SPACE);

        console.log("Connected.");

    }

    catch (err) {

        console.error(err);

        showError(
            "Unable to connect to the AI model."
        );

    }

}

//============================================================
// Browse Button
//============================================================

browseBtn.addEventListener("click", () => {

    imageInput.click();

});

//============================================================
// File Selected
//============================================================

imageInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    processFile(file);

});

//============================================================
// Drag Events
//============================================================

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.style.borderColor = "#3b82f6";

    dropArea.style.background =
        "rgba(59,130,246,.15)";

});

dropArea.addEventListener("dragleave", () => {

    dropArea.style.borderColor =
        "rgba(255,255,255,.25)";

    dropArea.style.background =
        "transparent";

});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.style.borderColor =
        "rgba(255,255,255,.25)";

    dropArea.style.background =
        "transparent";

    const file = e.dataTransfer.files[0];

    if (!file) return;

    processFile(file);

});

//============================================================
// Validate File
//============================================================

function processFile(file) {

    hideError();

    if (!ALLOWED_TYPES.includes(file.type)) {

        showError(
            "Only JPG, PNG and WEBP images are allowed."
        );

        return;

    }

    if (file.size > MAX_FILE_SIZE) {

        showError(
            "Maximum image size is 10MB."
        );

        return;

    }

    selectedImage = file;

    showPreview(file);

}

//============================================================
// Preview Image
//============================================================

function showPreview(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

    };

    reader.readAsDataURL(file);

    previewSection.classList.remove("hidden");

    fileName.textContent = file.name;

    imageSize.textContent =
        formatFileSize(file.size);

}

//============================================================
// Remove Image
//============================================================

removeImage.addEventListener("click", () => {

    selectedImage = null;

    imageInput.value = "";

    previewImage.src = "";

    previewSection.classList.add("hidden");

    loadingSection.classList.add("hidden");

    resultSection.classList.add("hidden");

    hideError();

});

//============================================================
// Retry
//============================================================

retryBtn.addEventListener("click", () => {

    hideError();

    if (selectedImage) {

        predictImage();

    }

});

//============================================================
// Helpers
//============================================================

function formatFileSize(bytes) {

    if (bytes < 1024)

        return bytes + " Bytes";

    if (bytes < 1048576)

        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / 1048576).toFixed(2) + " MB";

}

function showError(message) {

    errorMessage.textContent = message;

    errorSection.classList.remove("hidden");

}

function hideError() {

    errorSection.classList.add("hidden");

}

function resetResults() {

    prediction.textContent = "-";

    confidence.textContent = "-";

    allPredictions.innerHTML = "";

    resultSection.classList.add("hidden");

}

function showLoading() {

    loadingSection.classList.remove("hidden");

}

function hideLoading() {

    loadingSection.classList.add("hidden");

}
//============================================================
// Loading Messages
//============================================================

const loadingMessages = [

    "Uploading image...",

    "Preparing model...",

    "Running inference...",

    "Analyzing features...",

    "Calculating confidence...",

    "Finalizing prediction..."

];

let loadingInterval = null;

//============================================================
// Start Prediction Automatically
//============================================================

previewImage.onload = () => {

    predictImage();

};

//============================================================
// Predict Image
//============================================================

async function predictImage() {

    if (!selectedImage) return;

    if (isPredicting) return;

    if (!client) {

        showError("AI model is not connected.");

        return;

    }

    isPredicting = true;

    resetResults();

    showLoading();

    startLoadingAnimation();

    try {

        const result = await client.predict(
            "/classify_image",
            {
                img: selectedImage
            }
        );

        stopLoadingAnimation();

        hideLoading();

        if (!result || !result.data) {

            throw new Error(
                "Empty response received."
            );

        }

        const predictions =
            parsePrediction(result.data);

        latestPrediction = predictions;

        renderPrediction(predictions);

    }

    catch (err) {

        console.error(err);

        stopLoadingAnimation();

        hideLoading();

        showError(

            err.message ||

            "Prediction failed."

        );

    }

    finally {

        isPredicting = false;

    }

}

//============================================================
// Parse Gradio Label Output
//============================================================

function parsePrediction(data) {

    /*
        Your Gradio Label normally returns

        data[0] = {

            Healthy : 0.91,

            Overweight : 0.05,

            ...

        }

    */

    let labels = data[0];

    if (!labels)

        throw new Error(

            "Invalid prediction format."

        );

    const list = [];

    Object.entries(labels)

        .forEach(([label, score]) => {

            list.push({

                label,

                confidence:

                    Number(score)

            });

        });

    list.sort(

        (a, b) =>

        b.confidence -

        a.confidence

    );

    return list;

}

//============================================================
// Loading Animation
//============================================================

function startLoadingAnimation() {

    progressBar.style.width = "0%";

    let width = 0;

    let index = 0;

    loadingText.textContent =
        loadingMessages[0];

    loadingInterval = setInterval(() => {

        width += 2;

        if (width > 92)

            width = 92;

        progressBar.style.width =
            width + "%";

        index++;

        loadingText.textContent =

            loadingMessages[

                index %

                loadingMessages.length

            ];

    }, 350);

}

//============================================================
// Stop Loading
//============================================================

function stopLoadingAnimation() {

    clearInterval(

        loadingInterval

    );

    progressBar.style.width = "100%";

}
