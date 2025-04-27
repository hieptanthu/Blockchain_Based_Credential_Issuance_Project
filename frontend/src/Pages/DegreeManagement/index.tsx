import { data, useParams } from "react-router-dom";
import { IDegree } from "../../types/IDeree";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { ModalCreateDegree, ModalUpdateDegree } from "./modal";

function DegreeManagement() {
  let { _school_address } = useParams();
  const [degrees, setDegrees] = useState<IDegree[]>([]);
  const [degree, setDegree] = useState<IDegree | undefined>(undefined);

  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

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
      {showModalCreate && (
        <ModalCreateDegree
          onClose={() => {
            setShowModalCreate(false);
          }}
        />
      )}
      {showModalUpdate && (
        <ModalUpdateDegree
          degree={degree}
          onClose={() => {
            setShowModalUpdate(false);
          }}
        />
      )}
      <div className="flex items-center justify-between pb-4">
        <h1>List Schools </h1>
        <button onClick={() => setShowModalCreate(!showModalCreate)}>
          create
        </button>
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
                  setShowModalUpdate(true);
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
