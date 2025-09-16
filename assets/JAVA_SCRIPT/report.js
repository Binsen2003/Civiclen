
const inputFile = document.getElementById("input-file");
const fileList = document.getElementById("file-list");
const dropArea = document.getElementById("drop-area");
const reportForm = document.getElementById("reportForm");
let selectedFiles = [];

// File input change
inputFile.addEventListener("change", () => {
    handleFiles(inputFile.files);
    inputFile.value = "";
});

// Drag & Drop
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
});

// Handle files
function handleFiles(files) {
    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    selectedFiles = [...selectedFiles, ...newFiles];
    renderFileList();
}

// Show files
function renderFileList() {
    fileList.innerHTML = "";
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        const name = document.createElement("span");
        name.textContent = file.name;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖";
        removeBtn.className = "remove-btn";
        removeBtn.type = "button";
        removeBtn.onclick = () => {
            selectedFiles.splice(index, 1);
            renderFileList();
        };

        fileItem.appendChild(img);
        fileItem.appendChild(name);
        fileItem.appendChild(removeBtn);
        fileList.appendChild(fileItem);
    });
}

// Convert file → Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Form submit
reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("issue-description").value;
    const location = document.getElementById("location").value;

    if (!description.trim()) {
        alert("⚠️ Please describe the issue");
        return;
    }

    // Convert all images to Base64
    const filesData = await Promise.all(selectedFiles.map(file => fileToBase64(file)));

    const reportData = {
        description,
        location,
        files: filesData
    };

    localStorage.setItem("reportData", JSON.stringify(reportData));

    // Redirect to details page
    window.location.href = "report-details.html";
});

// Get Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("❌ Geolocation not supported");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("location").value = data.display_name;
        })
        .catch(() => {
            alert("⚠️ Failed to fetch location name.");
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("❌ User denied location request.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("❌ Location unavailable.");
            break;
        case error.TIMEOUT:
            alert("⏳ Location request timed out.");
            break;
        default:
            alert("⚠️ Unknown error.");
    }
}