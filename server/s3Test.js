import AWS from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const testUpload = async () => {
  try {
    fs.writeFileSync("test.txt", "This is a test file uploaded by Gideon");

    const result = await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `test-${Date.now()}.txt`,
        Body: fs.createReadStream("test.txt"),
        ContentType: "text/plain",
      })
      .promise();

    console.log("Upload successful! File URL:");
    console.log(result.Location);
  } catch (err) {
    console.error("Error uploading to S3:", err);
  }
};

testUpload();
