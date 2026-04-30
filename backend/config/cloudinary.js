import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log("Cloudinary Config Check:", {
    cloud_name: process.env.CLOUD_NAME ? "Found" : "Missing",
    api_key: process.env.CLOUD_API_KEY ? "Found" : "Missing",
    api_secret: process.env.CLOUD_API_SECRET ? "Found" : "Missing",
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;