import { useParams } from "react-router-dom";
import { IDegree } from "../../types/IDeree";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import ipfs from "../../api/updateIpfs";

function DegreeManagement() {
  let { _school_address } = useParams();
  const [degrees, setDegrees] = useState<IDegree[]>([]);
  const [degree, setDegree] = useState<IDegree | undefined>(undefined);
  const [updates, setUpdates] =
    useState<{ code: string; imgDegree: File; scoreboard: File }[]>();
  const [fileDegree, setFileDegree] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      setFileDegree(Array.from(selectedFiles));
      console.log("Selected files:", selectedFiles);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosClient.post<IDegree[]>("/Degree/search", {
          data: {
            school_address: _school_address,
          },
        });
        if (Array.isArray(data)) {
          setDegrees(data);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h1>List Schools </h1>
        <input
          type="file"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Code
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {degrees.map((degree, index) => (
              <tr
                key={index}
                onClick={() => {
                  setShowModal(true);
                  setDegree(degree);
                }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">{degree.code}</td>
                <td className="px-6 py-4">{degree.ipfs_url_bytes}</td>
                <td className="px-6 py-4">{degree.status}</td>
                <td className="px-6 py-4">{degree.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DegreeManagement;
