// Show a preview image as soon as the file is chosen
function onFileSelected(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Grab the first file object safely
    const imgElement = document.getElementById("myImage");
    imgElement.src = URL.createObjectURL(file);
    imgElement.style.display = "block";

    // Trigger the upload and prediction immediately
    uploadAndPredict(file);
}

async function uploadAndPredict(file) {
    const predictionEl = document.getElementById("prediction");
    const confidencesEl = document.getElementById("confidences");
    const statusEl = document.getElementById("status_msg");

    // Clear old layout elements
    predictionEl.innerText = "";
    confidencesEl.innerText = "";
    statusEl.innerText = "Processing image request with Hugging Face...";

    // Convert the image file into a Base64 string that the API expects
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64Data = reader.result; // This holds the base64 data URL string

        try {
            // Direct POST request to the official, CORS-friendly API pipeline route
            const response = await fetch("https://danielnicholasdilli-weight-mdel.hf.space/api/predict", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    data: [ base64Data ], // Pass image inside array data wrapper
                    fn_index: 0          // Point to your primary /classify_image function logic
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned status code: ${response.status}`);
            }

            const result = await response.json();
            statusEl.innerText = "Prediction complete!";

            // Render output depending on how your fastai/model structures data labels
            if (result.data) {
                predictionEl.innerText = `Result Data: ${JSON.stringify(result.data[0])}`;
            } else {
                predictionEl.innerText = `Result Data: ${JSON.stringify(result)}`;
            }

        } catch (error) {
            console.error("API error details:", error);
            statusEl.innerText = `Error: ${error.message}. Make sure your Hugging Face Space is active and running.`;
        }
    };
}

// Attach function names globally to window context so index.html can call them smoothly
window.onFileSelected = onFileSelected;
