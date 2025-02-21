import express from "express";
import fs from "fs";
import cors from "cors";
import shortid from "shortid";

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// ✅ Ensure data file exists & load URLs safely
const loadUrls = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]"); // Create empty array if file doesn't exist
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8") || "[]";
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
};

// ✅ Save URLs to file safely
const saveUrls = (urls) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
};

// ✅ API to shorten a URL
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  const urls = loadUrls();
  const shortUrl = shortid.generate();
  const newEntry = { originalUrl, shortUrl };

  urls.push(newEntry);
  saveUrls(urls);

  res.json(newEntry);
});

// ✅ API to retrieve the original URL
app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const urls = loadUrls();
  const found = urls.find((url) => url.shortUrl === shortUrl);

  if (found) {
    res.redirect(found.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
