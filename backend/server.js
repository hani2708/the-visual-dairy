const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

// serve images
app.use("/uploads", express.static("uploads"));

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// upload API
app.post("/upload", upload.single("photo"), (req, res) => {
    res.json({
        imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
    });
});

// get images API
app.get("/photos", (req, res) => {
    fs.readdir("uploads", (err, files) => {
        if (err) return res.status(500).send("Error");

        const urls = files.map(file =>
            `http://localhost:5000/uploads/${file}`
        );

        res.json(urls);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));

// DELETE IMAGE API
app.delete("/delete/:name", (req, res) => {
    const fileName = req.params.name;
    const filePath = `uploads/${fileName}`;

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting file" });
        }
        res.json({ message: "Deleted successfully" });
    });
});