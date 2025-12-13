export const extractMetadata = (file: File): Promise<{ coverUrl?: string; artist?: string; title?: string }> => {
  return new Promise((resolve) => {
    const jsmediatags = (window as any).jsmediatags;

    if (!jsmediatags) {
      console.warn("jsmediatags library not loaded");
      resolve({});
      return;
    }

    jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        try {
          const { tags } = tag;
          let coverUrl = undefined;

          if (tags.picture) {
            const { data, format } = tags.picture;
            // Convert data array to Uint8Array for Blob creation
            const byteArray = new Uint8Array(data);
            const blob = new Blob([byteArray], { type: format });
            coverUrl = URL.createObjectURL(blob);
          }

          resolve({
            coverUrl,
            artist: tags.artist,
            title: tags.title
          });
        } catch (e) {
          console.warn("Error processing metadata tags", e);
          resolve({});
        }
      },
      onError: (error: any) => {
        // Log detailed error info instead of [object Object]
        // Common errors are type: "tag_not_found"
        console.warn("Metadata extraction info:", error.type ? error.type : error);
        resolve({});
      }
    });
  });
};