// Show a preview image as soon as the file is chosen
function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

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

    // Reset old text labels
    predictionEl.innerText = "";
    confidencesEl.innerText = "";
    statusEl.innerText = "Processing image request with Hugging Face...";

    // 1. Convert your file into a base64 Data URL string which Hugging Face's API accepts natively
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64Data = reader.result;

        try {
            // 2. Direct HTTP Fetch POST request to your exact Hugging Face Space api route
            const response = await fetch("https://hf.space", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: [ base64Data ] // Wrap the image payload inside the array container
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned status code: ${response.status}`);
            }

            const initialResult = await response.json();
            const eventId = initialResult.event_id;

            // 3. Gradio v4+ endpoints stream responses. Let's fetch the final prediction event data stream
            const streamResponse = await fetch(`https://hf.space/${eventId}`);
            const streamText = await streamResponse.text();

            // 4. Parse out the data payload string from the text stream response
            const dataLine = streamText.split('\n').find(line => line.startsWith('data:'));
            
            if (dataLine) {
                const parsedData = JSON.parse(dataLine.replace('data: ', ''));
                
                statusEl.innerText = "Prediction complete!";
                // Output raw array results cleanly or display specific nested data values
                predictionEl.innerText = `Result Data: ${JSON.stringify(parsedData[0])}`;
            } else {
                statusEl.innerText = "Could not parse prediction stream.";
            }

        } catch (error) {
            console.error("API error:", error);
            statusEl.innerText = `Error: ${error.message}`;
        }
    };
}

// Attach the file input function directly to the window context so index.html can call it
window.onFileSelected = onFileSelected;
