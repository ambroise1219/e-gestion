import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/utils/uploadthing";

// Export des routes pour le gestionnaire de fichiers
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});