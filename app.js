// Browser-safe import method matching the @gradio/client package functionality
import { Client } from "https://jsdelivr.net";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const resultDiv = document.getElementById("result");

// Show preview when a file is selected
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
});

// Send file to Hugging Face space API on click
uploadBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) return alert("Please select an image first!");

    resultDiv.innerText = "Analyzing...";

    try {
        // Connect directly to your space
        const client = await Client.connect("DANIELNICHOLASDILLI/Weight_Mdel");
        
        // Matches your space guide: /classify_image endpoint and { img: blob } format
        const result = await client.predict("/classify_image", {
            img: file, 
        });

        // Output raw data response to screen
        resultDiv.innerText = JSON.stringify(result.data, null, 2);
    } catch (error) {
        resultDiv.innerText = "Error: " + error.message;
        console.error(error);
    }
});
