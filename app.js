// Import Gradio Client from CDN for the browser
import { Client } from "https://jsdelivr.net";

const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const resultDiv = document.getElementById("result");

uploadBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) return alert("Please select an image first!");

    resultDiv.innerText = "Analyzing...";

    try {
        const client = await Client.connect("DANIELNICHOLASDILLI/Weight_Mdel");
        const result = await client.predict("/classify_image", {
            img: file, 
        });

        resultDiv.innerText = JSON.stringify(result.data, null, 2);
    } catch (error) {
        resultDiv.innerText = "Error: " + error.message;
        console.error(error);
    }
});
