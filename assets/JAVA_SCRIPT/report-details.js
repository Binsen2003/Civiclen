const data = JSON.parse(localStorage.getItem("reportData"));

if (data) {
    document.getElementById("issue-description").textContent = data.description;
    document.getElementById("issue-location").textContent = data.location;

    const preview = document.getElementById("preview-images");
    data.files.forEach(src => {
        const img = document.createElement("img");
        img.src = src; // Base64 works directly
        preview.appendChild(img);
    });
}

// Handle submit button → go to overview page
document.querySelector(".btn-success").addEventListener("click", () => {
    const reportData = JSON.parse(localStorage.getItem("reportData"));

    const finalData = {
        ...reportData,
        problem: document.querySelectorAll(".form-select")[0].value,
        severity: document.querySelectorAll(".form-select")[1].value,
        department: document.querySelectorAll(".form-select")[2].value,
    };

    localStorage.setItem("finalReport", JSON.stringify(finalData));
    window.location.href = "overview.html"; // redirect to overview
});
