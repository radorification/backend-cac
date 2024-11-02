import multer from "multer";

 const storage = multer.diskStorage({
    destination: "../../public/temp",
     filename: function (req, file, cb) {
       cb(null, Date.now() + "-" + file.originalname)
     }
  })

export const upload = multer({
  storage,
});
