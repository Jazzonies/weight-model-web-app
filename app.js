// Import the Client constructor using the standardized browser web CDN
import { Client } from "https://jsdelivr.net";

const imageInput = document.getElementById("imageInput");
const previewImg = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const resultDiv = document.getElementById("result");

// Optional: Show a quick visual preview when a user selects an image file
imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
    }
});

predictBtn.addEventListener("click", async () => {
    // 1. Verify a file was actually uploaded
    const file = imageInput.files[0];
    if (!file) {
        alert("Please select or upload an image file first!");
        return;
    }

    resultDiv.style.display = "block";
    resultDiv.innerText = "Connecting to Hugging Face and processing image...";

    try {
        // 2. Initialize connection using the exact syntax your API page requested
        const client = await Client.connect("DANIELNICHOLASDILLI/Weight_Mdel");
        
        // 3. Send the image file object to the exact endpoint name: '/classify_image'
        const result = await client.predict("/classify_image", {
            img: file, // JavaScript files match the required Blob/File parameter interface
        });

        // 4. Render the incoming structured response data cleanly 
        resultDiv.innerText = `Prediction Result:\n${JSON.stringify(result.data, null, 2)}`;
    } catch (error) {
        console.error("API error details:", error);
        resultDiv.innerText = `Error completing prediction. ${error.message || 'Check your browser console logs.'}`;
    }
});
