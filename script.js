import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const button = document.getElementById("predictBtn");
const output = document.getElementById("output");

button.onclick = async () => {

    const fileInput = document.getElementById("imageInput");

    if (fileInput.files.length === 0) {
        alert("Choose an image first.");
        return;
    }

    const image = fileInput.files[0];

    output.textContent = "Loading...";

    try {

        const client = await Client.connect(
            "DANIELNICHOLASDILLI/Weight_Mdel"
        );

        const result = await client.predict("/classify_image", {
            img: image,
        });

        console.log(result);

        output.textContent = JSON.stringify(result.data, null, 2);

    } catch (err) {

        console.error(err);

        output.textContent = err;

    }

};
