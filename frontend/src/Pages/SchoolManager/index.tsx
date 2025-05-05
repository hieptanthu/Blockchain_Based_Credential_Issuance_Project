import { ISchool } from "../../types/Ischool";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ModalSchool from "./modal";
import { ItemSchool } from "../../components/School";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/Loading";

function SchoolManager() {
  const { t } = useTranslation();

  const [schools, setSchools] = useState<ISchool[] | undefined>(undefined);
  const [school, setSchool] = useState<ISchool | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosClient.post<ISchool[]>("/school/search", {});
        if (Array.isArray(data)) {
          setSchools(data);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchData();
  }, []);
  if (!schools) {
    return <Loading />;
  }
  return (
    <div>
      {showModal && (
        <ModalSchool
          schoolUpdate={school}
          onClose={() => setShowModal(!showModal)}
        />
      )}
      <div className="flex items-center justify-between pb-4">
        <h1>{t("list_schools")} </h1>
        <button
          data-modal-hide="default-modal"
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            setShowModal(!showModal);
            setSchool(undefined);
          }}
        >
          {t("create")}
        </button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("full_name")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("code")}
              </th>
              <th scope="col" className="px-6 py-3">
                Logo
              </th>
              <th scope="col" className="px-6 py-3">
                {t("address")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(schools) && (schools as ISchool[])?.length > 0 ? (
              (schools as ISchool[]).map((school: any, index: any) => (
                <tr
                  key={index}
                  onClick={() => {
                    setShowModal(true);
                    setSchool(school);
                  }}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <ItemSchool school={school} />
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4 text-gray-500">
                  {t("school.no_school_found") || "No school found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchoolManager;
