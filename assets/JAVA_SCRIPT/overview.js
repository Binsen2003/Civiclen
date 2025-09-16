
// Get final merged data from localStorage
const data = JSON.parse(localStorage.getItem("finalReport"));

if (data) {
    document.getElementById("issue-description").textContent = data.description;
    document.getElementById("issue-location").textContent = data.location;
    document.getElementById("issue-problem").textContent = data.problem;
    document.getElementById("issue-severity").textContent = data.severity;
    document.getElementById("issue-department").textContent = data.department;

    const preview = document.getElementById("preview-images");
    data.files.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "img-thumbnail";
        img.style.width = "150px";
        img.style.height = "auto";
        preview.appendChild(img);
    });
} else {
    document.querySelector(".container").innerHTML = `
        <div class="alert alert-warning">
          ⚠️ No report data found. Please submit a report first.
        </div>`;
}
