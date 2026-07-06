const SPACE_URL = "https://danielnicholasdilli-test.hf.space";

const imageInput = document.getElementById("imageInput");
const predictBtn = document.getElementById("predictBtn");

const status = document.getElementById("status");
const prediction = document.getElementById("prediction");

predictBtn.onclick = async () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please choose an image.");
        return;
    }

    prediction.innerHTML = "";
    status.innerHTML = "Uploading image...";

    try {

        // STEP 1 - Upload image
        const formData = new FormData();
        formData.append("files", file);

        const uploadResponse = await fetch(
            `${SPACE_URL}/gradio_api/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const uploadResult = await uploadResponse.json();

        console.log("Upload:", uploadResult);

        const uploadedPath = uploadResult[0];

        // STEP 2 - Start prediction

        status.innerHTML = "Running prediction...";

        const predictResponse = await fetch(
            `${SPACE_URL}/gradio_api/call/v2/classify_image`,
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    im:{
                        path: uploadedPath,
                        meta:{
                            _type:"gradio.FileData"
                        }
                    }
                })
            }
        );

        const predictResult = await predictResponse.json();

        console.log("Predict:", predictResult);

        const eventID = predictResult.event_id;

        status.innerHTML = "Waiting for model...";

        // STEP 3 - Read SSE result

        const eventSource = new EventSource(
            `${SPACE_URL}/gradio_api/call/classify_image/${eventID}`
        );

        eventSource.onmessage = function(event){

            console.log(event.data);

        };

        eventSource.addEventListener("complete",(event)=>{

            const output = JSON.parse(event.data)[0];

            console.log(output);

            prediction.innerHTML =
                output.label +
                "<br><br>" +
                (output.confidences[0].confidence*100).toFixed(2)+"%";

            status.innerHTML = "Done";

            eventSource.close();

        });

    }
    catch(err){

        console.error(err);

        status.innerHTML = "Error";

    }

};
