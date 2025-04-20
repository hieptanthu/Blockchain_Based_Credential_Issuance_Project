import { searchAoiSchool } from "../../api/apiSchool";
import { ISchool } from "../../types/Ischool";
import { useEffect, useState } from "react";
function School() {
  const [schools, setSchools] = useState<ISchool[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await searchAoiSchool();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>Danh sách trường học</h1>
      <ul>
        {schools.map((school, index) => (
          <li key={index}>
            <strong>Mã trường:</strong> {school.code}
            <br />
            <strong>Tên trường:</strong> {school.fullname}
            <br />
            <strong>Địa chỉ:</strong> {school.address_school}
            <br />
            <strong>Người quản lý:</strong> {school.address_manager}
            <br />
            <strong>Trạng thái:</strong>{" "}
            {school.status ? "Hoạt động" : "Không hoạt động"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default School;
