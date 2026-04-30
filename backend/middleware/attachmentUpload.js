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
        // Log to help debug
        console.log("Chat upload started for file:", file.originalname);
        
        return {
            folder: "chat_attachments",
            allowedFormats: ["jpg", "png", "jpeg", "pdf", "doc", "docx", "txt"],
            resource_type: "auto", // Crucial for non-image files
            public_id: `chat-${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

const attachmentUpload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default attachmentUpload;
