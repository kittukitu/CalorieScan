const express = require("express");
const multer = require("multer");
const path = require("path");
const { scanFoodImage } = require("../controllers/scanController");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// GET request to render scan.ejs page
router.get("/", (req, res) => {
    res.render("scan", { nutritionData: null });
});

// POST request to process image upload
router.post("/", upload.single("foodImage"), scanFoodImage);

module.exports = router;
