import { useParams } from "react-router-dom";
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
  }, [showModalUpdate, showModalCreate]);

  return (
    <>
      {showModalCreate && _school_address && (
        <ModalCreateDegree
          address_school={_school_address}
          onClose={() => {
            setShowModalCreate(false);
          }}
        />
      )}
      {showModalUpdate && degree && (
        <ModalUpdateDegree
          degree={degree}
          onClose={() => {
            setShowModalUpdate(false);
          }}
        />
      )}
      <div className="flex items-center justify-between pb-4">
        <h1>List Schools </h1>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setShowModalCreate(!showModalCreate)}
        >
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
                  setShowModalUpdate(!showModalUpdate);
                  setDegree(degree);
                }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">{degree.code}</td>
                <td className="px-6 py-4">
                  {degree.status ? "open" : "clone"}
                </td>
                <td className="px-6 py-4">{degree.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DegreeManagement;
