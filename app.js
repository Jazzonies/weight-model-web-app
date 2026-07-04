import { Client } from "https://jsdelivr.net";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const resultDiv = document.getElementById("result");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
});

uploadBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) return alert("Please select an image first!");

    resultDiv.innerText = "Connecting to Hugging Face Space (This may take a moment if the Space is waking up)...";

    try {
        const client = await Client.connect("DANIELNICHOLASDILLI/Weight_Mdel");
        
        resultDiv.innerText = "Analyzing image...";
        
        const result = await client.predict("/classify_image", {
            img: file, 
        });

        resultDiv.innerText = JSON.stringify(result.data, null, 2);
    } catch (error) {
        if (error.message.includes("fetch") || error.toString().includes("timeout")) {
            resultDiv.innerText = "Error: Connection timed out. Please visit https://huggingface.co to verify if the Space is running or waking up.";
        } else {
            resultDiv.innerText = "Error: " + error.message;
        }
        console.error(error);
    }
});
