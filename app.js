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
    const file = imageInput.files[0]; // Extract the singular file object cleanly
    if (!file) {
        alert("Please select or upload an image file first!");
        return;
    }

    resultDiv.style.display = "block";
    resultDiv.innerText = "Connecting to backend framework...";

    try {
        // Direct instantiator avoids the pre-flight connection timeout blocks
        const client = await Client.from_model("DANIELNICHOLASDILLI/Weight_Mdel");
        
        // Pass the raw uploaded file directly under the 'img' property parameter
        const result = await client.predict("/classify_image", {
            img: file, 
        });

        resultDiv.innerText = `Prediction Result:\n${JSON.stringify(result.data, null, 2)}`;
    } catch (error) {
        console.error("API error details:", error);
        resultDiv.innerText = `Connection Failed: ${error.message}`;
    }
});
