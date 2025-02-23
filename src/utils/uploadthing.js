'use client';
import { createUploadthing } from "uploadthing/next";
import { generateReactHelpers } from "@uploadthing/react";

// Configuration du routeur de fichiers
const f = createUploadthing();

export const ourFileRouter = {
  stockDocumentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "8MB", maxFileCount: 10 }
  })
    .middleware(async ({ req }) => {
      return { user: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.user, url: file.url };
    }),
};

// Helpers React pour l'upload
export const { useUploadThing, uploadFiles } = generateReactHelpers(ourFileRouter);