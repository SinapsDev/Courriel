import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from "../pages/api/uploadthing/core";
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();