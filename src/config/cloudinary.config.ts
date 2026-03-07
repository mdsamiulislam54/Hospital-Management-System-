/* eslint-disable no-useless-escape */
import { v2 as cloudinary ,UploadApiResponse } from "cloudinary"
import { envConfig } from "./envConfig"
import { AppError } from "../app/middleware/AppError";
import status from "http-status";

cloudinary.config({
    api_key: envConfig.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY.CLOUDINARY_API_SECRET,
    cloud_name: envConfig.CLOUDINARY.CLOUDINARY_CLOUD_NAME
})
export const uploadFileToCloudinary = async (
    buffer : Buffer,
    fileName: string,
) : Promise<UploadApiResponse> =>{

    if(!buffer || !fileName) {
        throw new AppError(status.BAD_REQUEST, "File buffer and file name are required for upload");
    }

    const extension = fileName.split(".").pop()?.toLocaleLowerCase();

    const fileNameWithoutExtension = fileName
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g, "-")
       
        .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileNameWithoutExtension;

    const folder = extension === "pdf" ? "pdfs" : "images";


    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                public_id: `ph-healthcare/${folder}/${uniqueName}`,
                folder : `ph-healthcare/${folder}`,
            },
            (error, result) => {
                if(error){
                    return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
                }
                resolve(result as UploadApiResponse);
            }
        ).end(buffer);
    })


}
export const deleteFileFromCloudinary = async (url: string) => {
    try {
        const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
        if (!match) {
            console.log("Invalid URL for Cloudinary delete:", url);
            return;
        }

        const public_id = match[1];

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: "image"
        });

        console.log(`File deleted from Cloudinary: ${public_id}`, result);

    } catch (error) {
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Cloudinary Image Delete failed");
    }
};

export const cloudinaryUpload = cloudinary