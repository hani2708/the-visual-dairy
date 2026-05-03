// LOGIN
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "gptcmy" && pass === "1234") {
        localStorage.setItem("user", user);
        window.location.href = "gallery.html";
    } else {
        document.getElementById("msg").innerText = "Wrong credentials";
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// UPLOAD IMAGE
function uploadPhoto() {
    let file = document.getElementById("fileInput").files[0];

    let formData = new FormData();
    formData.append("photo", file);

    fetch("https://the-visual-dairy-1.onrender.com/upload", {
        method: "POST",
        body: formData
    }).then(() => loadGallery());
}

// 🖼️ LOAD GALLERY (UPDATED)
function loadGallery() {
    fetch("https://the-visual-dairy-1.onrender.com/photos")
        .then(res => res.json())
        .then(data => {
            let gallery = document.getElementById("gallery");
            gallery.innerHTML = "";

            data.forEach(url => {
                let div = document.createElement("div");

                let img = document.createElement("img");
                img.src = url;
                img.onclick = () => previewImage(url);

                let btn = document.createElement("button");
                btn.innerText = "Delete";
                btn.onclick = () => deleteImage(url);

                div.appendChild(img);
                div.appendChild(btn);

                gallery.appendChild(div);
            });
        });
}

// 🗑️ 👉 ADD THIS FUNCTION HERE (ANYWHERE BELOW loadGallery)
function deleteImage(url) {
    let fileName = url.split("/").pop();

    fetch(`https://the-visual-dairy-1.onrender.com/delete/${fileName}`, {
        method: "DELETE"
    })
    .then(() => {
        loadGallery();
    });
}

// PAGE LOAD
if (window.location.pathname.includes("gallery.html")) {
    loadGallery();
}

function previewImage(src) {
    document.getElementById("previewModal").style.display = "block";
    document.getElementById("previewImg").src = src;
}

function closePreview() {
    document.getElementById("previewModal").style.display = "none";
}
