import { IDegree } from "../../types/IDeree";
import { useState } from "react";
import ipfs from "../../api/updateIpfs";
interface ModalCreateDegreeProps {
  onClose?: () => void;
}
interface FilePair {
  name: string;
  degree: File;
  scoreboard: File;
}

export function ModalCreateDegree({ onClose }: ModalCreateDegreeProps) {
  const [fileDegrees, setFileDegrees] = useState<File[]>([]);
  const [fileScoreboard, setFileScoreboard] = useState<File[]>([]);
  console.log("fileDegrees", fileDegrees);
  console.log("fileScoreboard", fileScoreboard);

  // Lọc file ảnh (degree) và tài liệu (scoreboard)
  const isImageFile = (file: File) => /\.(jpg|jpeg|png)$/i.test(file.name);
  const isDocumentFile = (file: File) => /\.(doc|docx|pdf)$/i.test(file.name);

  // Xử lý khi người dùng chọn file
  const handleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Map tên file (không có phần mở rộng) với các file đúng loại (ảnh cho Degree, tài liệu cho Scoreboard)
  const mapByName = (files: File[], typeCheck: (file: File) => boolean) => {
    const map = new Map<string, File>();
    files.forEach((file) => {
      if (typeCheck(file)) {
        const name = file.name.replace(/\.[^/.]+$/, ""); // Lấy tên file không có đuôi
        map.set(name, file);
      }
    });
    return map;
  };

  // Tạo map cho Degree (ảnh) và Scoreboard (tài liệu)
  const degreeMap = mapByName(fileDegrees, isImageFile);
  const scoreboardMap = mapByName(fileScoreboard, isDocumentFile);

  // Ghép các file Degree và Scoreboard cùng tên
  const matchedFiles: FilePair[] = [];

  degreeMap.forEach((degreeFile, name) => {
    const scoreboardFile = scoreboardMap.get(name);
    if (scoreboardFile) {
      matchedFiles.push({
        name,
        degree: degreeFile,
        scoreboard: scoreboardFile,
      });
    }
  });

  // Kiểm tra xem tất cả các file có ghép đúng với nhau không
  const isFullyMatched =
    matchedFiles.length === fileDegrees.length &&
    matchedFiles.length === fileScoreboard.length;

  // Truyền danh sách file vào smart contract thông qua hàm onSubmit
  const handleSubmit = async () => {
    try {
      // Chuẩn bị đúng data để upload
      const filesToUpload = matchedFiles.map((filePair) => ({
        code: filePair.name,
        imgDegree: filePair.degree,
        scoreboard: filePair.scoreboard,
      }));
      console.log("dang update", matchedFiles);
      // Gọi API uploadsToIPFS từng cái một
      const { names, ipfsHashes } = await ipfs.uploadsToIPFS(filesToUpload);

      console.log("Upload thành công:");
      console.log("Names:", names);
      console.log("IPFS Hashes:", ipfsHashes);

      // TODO: Gửi names + ipfsHashes lên Smart Contract nếu cần
      // Ví dụ: await contract.addDegrees(names, ipfsHashes);
    } catch (error) {
      console.error("Có lỗi khi upload:", error);
      // Hiển thị thông báo lỗi nếu cần
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded shadow-md w-[600px] max-h-[80vh] overflow-auto">
          {/* Input để tải lên file Degree */}
          <div className="mb-5">
            <label
              htmlFor="degrees"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              File Degrees (Ảnh)
            </label>
            <input
              type="file"
              id="degrees"
              onChange={(e) => handleFilesChange(e, setFileDegrees)}
              multiple
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          {/* Input để tải lên file Scoreboard */}
          <div className="mb-5">
            <label
              htmlFor="scoreboard"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              File Scoreboard (Tài liệu)
            </label>
            <input
              type="file"
              id="scoreboard"
              onChange={(e) => handleFilesChange(e, setFileScoreboard)}
              multiple
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          {/* Hiển thị danh sách các cặp file khi ghép đúng */}
          {isFullyMatched && (
            <div>
              <h3 className="font-semibold mb-2 text-green-600">
                Danh sách ghép đúng:
              </h3>
              <ul className="list-disc pl-5">
                {matchedFiles.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.name}</strong>: Degree = {item.degree.name},
                    Scoreboard = {item.scoreboard.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Thông báo lỗi nếu không đủ cặp */}
          {!isFullyMatched &&
            (fileDegrees.length > 0 || fileScoreboard.length > 0) && (
              <div className="mt-4 text-red-600 font-medium">
                ❌ Các file không khớp hoàn toàn — hãy đảm bảo tất cả tên file
                (không đuôi) phải giống nhau và đúng loại!
              </div>
            )}

          {/* Nút submit để gửi lên hợp đồng thông minh */}
          {isFullyMatched && (
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Xác nhận và Gửi lên Smart Contract
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface ModalUpdateDegreeProps {
  degree?: IDegree;
  onClose?: () => void;
}

export function ModalUpdateDegree(data: ModalUpdateDegreeProps) {
  return (
    <>
      <div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            File Degrees
          </label>
          <input
            type="files"
            id="degrees"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            multiple
          />
        </div>
      </div>
    </>
  );
}
