import axios from "axios";
const url = import.meta.env.VITE_UPDATE_URL;
const pinata_api_key = import.meta.env.VITE_PINATA_API_KEY;
const pinata_secret_api_key = import.meta.env.VITE_SECRET_PINATA_API_KEY;

const ipfs = {
  uploadToIPFS: async (fileData: any) => {
    const formData = new FormData();
    formData.append("file", fileData);

    try {
      const response = await axios({
        method: "post",
        url: url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinata_api_key,
          pinata_secret_api_key: pinata_secret_api_key,
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return ImgHash;
    } catch (error) {
      console.error("Upload to IPFS failed:", error);
      throw error;
    }
  },
  uploadsToIPFS: async (
    files: {
      code: string;
      imgDegree: File;
      scoreboard: File;
    }[],
  ) => {
    const uploadPromises = files.map(async (fileData) => {
      const formData = new FormData();
      formData.append("file", fileData.imgDegree); // Add imgDegree file
      formData.append("file", fileData.scoreboard); // Add scoreboard file

      try {
        const response = await axios({
          method: "post",
          url: url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinata_api_key,
            pinata_secret_api_key: pinata_secret_api_key,
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        // Returning an object containing the name, maHoSo, and the image hash
        return {
          code: fileData.code,
          imgDegreeHash: ImgHash, // Store the imgDegree file IPFS hash
          scoreboardHash: ImgHash, // Store the scoreboard file IPFS hash (if separate)
        };
      } catch (error) {
        console.error(`Upload for  failed:`, error);
        throw error;
      }
    });

    try {
      const uploadResults = await Promise.all(uploadPromises);
      return uploadResults; // Return an array of results
    } catch (error) {
      console.error("One or more uploads failed:", error);
      throw error;
    }
  },
};

export default ipfs;
