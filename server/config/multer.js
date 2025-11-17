import multer from "multer";

const storage = multer.memoryStorage();  // <— IMPORTANT

const upload = multer({ storage });

export default upload;
