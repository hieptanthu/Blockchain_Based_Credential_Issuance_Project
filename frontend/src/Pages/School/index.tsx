import { ISchool } from "../../types/Ischool";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ModalSchool from "./modal";

function School() {
  const [schools, setSchools] = useState<ISchool[]>([]);
  console.log("schools", schools);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosClient.get<ISchool[]>("/school");
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
    return <div>Loading...</div>;
  }
  return (
    <div>
      {schools.length > 0 && <ModalSchool schoolUpdate={schools[0]} />}
      <h1>Danh sách trường học</h1>
      <ul>
        {schools.map((school, index) => (
          <li key={index}>
            <strong>Mã trường:</strong> {school.code}
            <br />
            <strong>ojbId:</strong> {school.objectId}
            <br />
            <strong>Tên trường:</strong> {school.fullname}
            <br />
            <strong>Địa chỉ:</strong> {school.address_school}
            <br />
            <strong>Người quản lý:</strong> {school.address_manager}
            <br />
            <strong>Trạng thái:</strong>{" "}
            {school.status ? "Hoạt động" : "Không hoạt động"}
            <br />
            <strong>IPFS URL:</strong> {school.ipfs_url}\
            <p>------------------------------</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default School;
