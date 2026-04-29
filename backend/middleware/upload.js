import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "profile_pics",
            allowed_formats: ["jpg", "png", "jpeg"],
            resource_type: "image",
            public_id: `profile-${req.user._id}-${Date.now()}`,
        };
    },
});

const upload = multer({ storage });

export default upload;