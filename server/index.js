import express from "express";
import cors from "cors";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "10mb" }));

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

app.get("/", (req, res) => {
  res.status(200).send("FarCloud backend is running...");
});

app.post("/upload", async (req, res) => {
  const { images } = req.body;
  const bucket = process.env.S3_BUCKET_NAME;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }
  if (images.length !== 4) {
    return res.status(400).json({ error: "Select exactly 4 images to upload" });
  }

  try {
    const existing = await s3.listObjectsV2({ Bucket: bucket }).promise();
    const existingCount = existing.Contents ? existing.Contents.length : 0;

    if (existingCount > 0) {
      return res.status(400).json({
        error: "You already have images in your bucket. Please delete them before uploading new ones."
      });
    }

    const newKeys = await Promise.all(
      images.map(async (imageUrl) => {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const fileName = `picsum_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const uploadParams = {
          Bucket: bucket,
          Key: fileName,
          Body: response.data,
          ContentType: "image/jpeg",
        };
        await s3.upload(uploadParams).promise();
        return fileName;
      })
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      uploaded: newKeys,
    });
  } catch (err) {
    console.error("Error during upload:", err.message);
    res.status(500).json({ error: "S3 upload failed", details: err.message });
  }
});

app.get("/s3", async (req, res) => {
  try {
    const data = await s3.listObjectsV2({ Bucket: process.env.S3_BUCKET_NAME }).promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(200).json([]);
    }

    const urls = data.Contents.map(
      (obj) => `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`
    );

    res.status(200).json(urls);
  } catch (err) {
    console.error("Error fetching S3 images:", err.message);
    res.status(500).json({ error: "Failed to fetch S3 images", details: err.message });
  }
});


app.delete("/delete", async (req, res) => {
  try {
    const { keys } = req.body;
    const bucket = process.env.S3_BUCKET_NAME;

    if (!keys || keys.length === 0) {
      return res.status(400).json({ error: "No keys provided for deletion" });
    }

    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    };

    const response = await s3.deleteObjects(deleteParams).promise();

    res.status(200).json({
      message: "Deleted successfully!",
      deleted: response.Deleted.map((obj) => obj.Key),
    });
  } catch (err) {
    console.error("Error deleting from S3:", err.message);
    res.status(500).json({ error: "Failed to delete images", details: err.message });
  }
});


app.listen(5001, () => console.log("FarCloud backend running on port 5001"));
