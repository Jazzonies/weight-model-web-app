const form = new FormData();

form.append("file", selectedImage);

const response = await fetch(
  "https://danielnicholasdilli-weight-mdel.hf.space/predict",
  {
      method: "POST",
      body: formData
  }
)

const data = await response.json();
