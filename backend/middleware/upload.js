import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Direct configuration to ensure api_key is present
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME?.trim(),
    api_key: process.env.CLOUD_API_KEY?.trim(),
    api_secret: process.env.CLOUD_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log("Preparing upload for user:", req.user?._id);
        return {
            folder: "profile_pics",
            allowedFormats: ["jpg", "png", "jpeg"],
            resource_type: "auto",
            public_id: `profile-${req.user?._id}-${Date.now()}`,
        };
    },
});

const upload = multer({ storage });

export default upload;