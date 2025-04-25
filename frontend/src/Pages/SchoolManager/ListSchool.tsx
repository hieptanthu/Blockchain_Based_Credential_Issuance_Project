import { ISchool } from "../../types/Ischool";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { ItemSchool } from "../../components/School";
import { Loading } from "../../components/Loading";
import { useParams } from "react-router-dom";
import { path } from "../../routers";
import { useNavigate } from "react-router-dom";

function ListMySchool() {
  let { _id } = useParams();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<ISchool[]>([]);
  const handleRowClick = (_school_address: string) => {
    navigate(
      `${path.DegreeManagement.replace(":_school_address", _school_address)}`,
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosClient.post<ISchool[]>("/school/search", {
          data: {
            address_manager: _id,
          },
        });
        if (Array.isArray(data)) {
          setSchools(data);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchData();
  }, []);
  if (schools.length === 0) {
    return <Loading />;
  }
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1>My Schools </h1>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Code
              </th>
              <th scope="col" className="px-6 py-3">
                Logo
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(school.objectId || "")}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <ItemSchool school={school} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListMySchool;
