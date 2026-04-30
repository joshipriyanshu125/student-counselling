import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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