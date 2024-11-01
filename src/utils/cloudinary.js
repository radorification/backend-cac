import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    })




    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath)  return null;

            // storing file on Cloudinary
            const response = await cloudinary.uploader.upload(
                localFilePath, {
                    resource_type: "auto"
                }
            )
            
            // when file is successfully uploaded on cloudinary
            console.log("File successfully uploaded on cloudinary", response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) //removes the locally stored temporary file as upload failed!
            return null;
        }
    }

    export {uploadOnCloudinary};

    // const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);