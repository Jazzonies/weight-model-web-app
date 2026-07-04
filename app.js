// Import the Gradio client directly from CDN for browser compatibility
import { client } from "https://jsdelivr.net";

const predictBtn = document.getElementById("predictBtn");
const modelInput = document.getElementById("modelInput");
const resultDiv = document.getElementById("result");

predictBtn.addEventListener("click", async () => {
    const inputValue = modelInput.value.trim();
    if (!inputValue) {
        alert("Please enter a valid value first!");
        return;
    }

    resultDiv.style.display = "block";
    resultDiv.innerText = "Processing prediction...";

    try {
        // Establish connection to your Hugging Face Space repository
        const app = await client("https://huggingface.co/spaces/DANIELNICHOLASDILLI/Weight_Mdel");
        
        // Match the payload array structure exactly with your model's expected inputs
        const response = await app.predict("/predict", [ inputValue ]);

        // Render response data inside the container 
        resultDiv.innerText = `Prediction Result: ${JSON.stringify(response.data)}`;
    } catch (error) {
        console.error(error);
        resultDiv.innerText = "Error completing prediction. Check console logs.";
    }
});
