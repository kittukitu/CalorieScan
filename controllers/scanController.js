const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI("AIzaSyCJma1eptprRonuJX06IhyK1tyFz7BW-Qw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType,
        },
    };
}

const scanFoodImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const imagePart = fileToGenerativePart(filePath, mimeType);

        const prompt = `Analyze this food image and estimate its nutritional values. Provide ONLY JSON in this format: 
        {
            "calories": value,
            "carbohydrates": value,
            "fat": value
        }`;

        const result = await model.generateContent([prompt, imagePart]);
        const textResponse = await result.response.text();

        console.log("AI Response:", textResponse); // Debugging: Check raw AI response

        // Extract JSON from the response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/); // Finds the JSON object
        if (!jsonMatch) {
            throw new Error("No JSON found in AI response");
        }

        const nutritionData = JSON.parse(jsonMatch[0]); // Extract and parse JSON

        fs.unlinkSync(filePath); // Remove uploaded file

        res.render("scan", { nutritionData });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Internal server error", rawResponse: error.message });
    }
};

module.exports = { scanFoodImage };
