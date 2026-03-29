const API_URL = "https://photo-inspector-api-a0gqfdgecre5ahcg.centralindia-01.azurewebsites.net/api/AnalyzeImage";

let base64Image = "";

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = function () {
    base64Image = reader.result.split(",")[1];

    const preview = document.getElementById("preview");
    preview.src = reader.result;
    preview.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
});

async function analyzeImage() {
  const loader = document.getElementById("loader");
  const result = document.getElementById("result");

  if (!base64Image) {
    alert("Please upload an image");
    return;
  }

  loader.classList.remove("hidden");
  result.classList.add("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(base64Image)
    });

    const data = await response.json();

    document.getElementById("caption").innerText = data.caption;

    const tagsContainer = document.getElementById("tags");
    tagsContainer.innerHTML = "";

    if (data.tags && Array.isArray(data.tags)) {
    data.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "tag";
      span.innerText = tag;
      tagsContainer.appendChild(span);
    });
  }

    

    loader.classList.add("hidden");
    result.classList.remove("hidden");

  } catch (error) {
    loader.classList.add("hidden");
    alert("Error analyzing image");
    console.error(error);
  }
} 
