import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const client = await Client.connect("DANIELNICHOLASDILLI/Test");

const chooseBtn = document.getElementById("chooseBtn");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

const predictBtn = document.getElementById("predictBtn");

const loading = document.getElementById("loading");

const results = document.getElementById("results");

const prediction = document.getElementById("prediction");

const confidence = document.getElementById("confidence");

const topPredictions = document.getElementById("topPredictions");

chooseBtn.onclick = ()=>imageInput.click();

let selectedFile;

imageInput.onchange = ()=>{

    selectedFile=imageInput.files[0];

    preview.src=URL.createObjectURL(selectedFile);

    preview.hidden=false;
};

predictBtn.onclick = async()=>{

    if(!selectedFile){

        alert("Please choose an image.");

        return;
    }

    loading.hidden=false;

    results.hidden=true;

    try{

        const result=await client.predict("/classify_image",{

            im:handle_file(selectedFile)

        });

        loading.hidden=true;

        results.hidden=false;

        const output=result.data[0];

        prediction.innerHTML=output.label;

        confidence.innerHTML=
            "Confidence: "+
            (output.confidences[0].confidence*100).toFixed(2)
            +"%";

        topPredictions.innerHTML="";

        output.confidences.forEach(item=>{

            topPredictions.innerHTML+=`

            <div class="prediction-row">

                <strong>${item.label}</strong>

                (${(item.confidence*100).toFixed(2)}%)

                <div class="bar">

                    <div
                    class="fill"
                    style="width:${item.confidence*100}%">
                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        loading.hidden=true;

        alert(error);
    }

};
