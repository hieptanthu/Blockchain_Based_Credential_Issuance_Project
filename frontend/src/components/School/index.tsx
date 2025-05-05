import { ISchool } from "../../types/Ischool";
import { useTranslation } from "react-i18next";

interface ISchoolProps {
  school: ISchool;
}

export function ItemSchool({ school }: ISchoolProps) {
  const { t } = useTranslation();
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
        <img
          className="h-24 w-24"
          src={import.meta.env.VITE_IPFS_GATEWAY + school.ipfs_url}
          alt="Logo"
        />
      </td>
      <td className="px-6 py-4"> {school.address_school}</td>
      <td className="px-6 py-4"> {school.status ? t("open") : t("clone")}</td>
    </>
  );
}
