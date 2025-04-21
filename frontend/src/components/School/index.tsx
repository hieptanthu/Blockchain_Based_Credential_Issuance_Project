import { ISchool } from "../../types/Ischool";
interface ISchoolProps {
  school: ISchool;
}

export function ItemSchool({ school }: ISchoolProps) {
  return (
    <>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {school.fullname}
      </th>
      <td className="px-6 py-4"> {school.code}</td>
      <td className="px-6 py-4">
        {" "}
        <img className="h-24 w-24" src={school.ipfs_url} alt="Logo" />
      </td>
      <td className="px-6 py-4"> {school.address_school}</td>
      <td className="px-6 py-4"> {school.status ? "True" : "False"}</td>
    </>
  );
}
