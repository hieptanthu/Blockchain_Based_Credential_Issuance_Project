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

      return response.data.IpfsHash;
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
    console.log("Uploading files to IPFS...", files);
    const codes = [];
    const ipfsHashes = [];

    for (const fileData of files) {
      const formData = new FormData();

      // Đảm bảo mỗi tệp được đưa vào đúng cấu trúc folder
      formData.append("file", fileData.imgDegree, `${fileData.code}/imgDegree`);
      formData.append(
        "file",
        fileData.scoreboard,
        `${fileData.code}/scoreboard`,
      );

      try {
        const response = await axios({
          method: "post",
          url: url, // URL API của Pinata
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY, // API Key của Pinata
            pinata_secret_api_key: import.meta.env.VITE_SECRET_PINATA_API_KEY, // Secret API Key của Pinata
          },
        });

        // Kiểm tra kết quả từ API và lưu trữ thông tin IPFS hash
        if (response.data && response.data.IpfsHash) {
          console.log(
            "Uploaded files for",
            fileData.code,
            "to IPFS:",
            response.data.IpfsHash,
          );

          codes.push(fileData.code);
          ipfsHashes.push(response.data.IpfsHash);
        } else {
          console.error(`Error: No IpfsHash returned for ${fileData.code}`);
          throw new Error(`No IpfsHash returned for ${fileData.code}`);
        }
      } catch (error: any) {
        console.error(
          `Upload for ${fileData.code} failed:`,
          error.response ? error.response.data : error.message,
        );
        throw error; // Nếu một file thất bại, dừng luôn
      }
    }

    return { codes, ipfsHashes };
  },
};
export default ipfs;
