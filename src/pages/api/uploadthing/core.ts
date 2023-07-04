import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  fileUploader: f({ "application/pdf": { maxFileSize: "32MB", maxFileCount: 99 } })
    .onUploadComplete(({ file }) => {
      console.log("Upload complete for userId:");
 
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;