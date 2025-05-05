import { IDegree } from "../../types/IDeree";
import { useState, useEffect } from "react";
import ipfs from "../../api/updateIpfs";
import { path } from "../../routers";
import { useTranslation } from "react-i18next";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import axiosClient from "../../api/axiosClient";
import { Transaction } from "@mysten/sui/transactions";
import {
  stringsToUint8Arrays,
  uint8ArrayToString,
  stringToUint8Array,
} from "../../tool/stringAndUint8Array";

import { bcs } from "@mysten/sui/bcs";
import { Loading } from "../../components/Loading";

const PackageAddress = import.meta.env.VITE_ADDRESS_PACKAGE;

const ClockAddress = import.meta.env.VITE_CLOCK_ADDRESS;

interface ModalCreateDegreeProps {
  address_school: string;
  onClose?: () => void;
}
interface FilePair {
  name: string;
  degree: File;
  scoreboard: File;
}
interface DegreeData {
  code: string;
  objectId: string;
}

export function ModalCreateDegree(props: ModalCreateDegreeProps) {
  const { t } = useTranslation();
  const [fileDegrees, setFileDegrees] = useState<File[]>([]);
  const [fileScoreboard, setFileScoreboard] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const isImageFile = (file: File) => /\.(jpg|jpeg|png)$/i.test(file.name);
  const isDocumentFile = (file: File) =>
    /\.(doc|docx|pdf|jpg|jpeg|png)$/i.test(file.name);

  const handleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

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

  const degreeMap = mapByName(fileDegrees, isImageFile);
  const scoreboardMap = mapByName(fileScoreboard, isDocumentFile);

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

  const isFullyMatched =
    matchedFiles.length === fileDegrees.length &&
    matchedFiles.length === fileScoreboard.length;

  const handleSubmit = async () => {
    try {
      if (!currentAccount) {
        throw new Error("No wallet connected");
      }
      setLoading(true);
      const filesToUpload = matchedFiles.map((filePair) => ({
        code: filePair.name,
        imgDegree: filePair.degree,
        scoreboard: filePair.scoreboard,
      }));

      // Upload files to IPFS
      const { codes, ipfsHashes } = await ipfs.uploadsToIPFS(filesToUpload);

      if ((codes.length > 0, ipfsHashes.length > 0)) {
        const tx = new Transaction();
        const ipfsHashBytes = stringsToUint8Arrays(ipfsHashes);

        tx.setSender(currentAccount.address);
        const serializedIpfs = bcs
          .vector(bcs.vector(bcs.U8))
          .serialize(ipfsHashBytes);
        tx.moveCall({
          target: `${PackageAddress}::DegreeManagement::create_multiple_degrees`,
          arguments: [
            tx.object(props.address_school),
            tx.pure.vector("u64", codes),
            tx.pure(serializedIpfs),
            tx.object(ClockAddress),
          ],
        });

        signAndExecute(
          {
            transaction: tx,
          },
          {
            onSuccess: (tx) => {
              suiClient
                .waitForTransaction({
                  digest: tx.digest,
                  options: {
                    showObjectChanges: true,
                  },
                })
                .then(async (data: any) => {
                  const createdObjectIds = data.objectChanges
                    .filter((change: any) => change.type === "created") // Lọc các thay đổi có type là "created"
                    .map((change: any) => change.objectId) as string[];

                  if (createdObjectIds.length > 0) {
                    const fullObjectsData = await suiClient.multiGetObjects({
                      ids: createdObjectIds,
                      options: {
                        showContent: true, // Hiển thị nội dung object
                      },
                    });

                    const safeDegreesData: DegreeData[] = fullObjectsData
                      .map((element: any): DegreeData | null => {
                        const code = element.data?.content?.fields?.code;
                        const objectId = element.data?.content?.fields?.id?.id;

                        if (!code || !objectId) return null;

                        return {
                          code: String(code),
                          objectId: String(objectId),
                        };
                      })
                      .filter((item): item is DegreeData => item !== null);

                    await axiosClient
                      .post(
                        "/degree/",
                        {
                          data: safeDegreesData,
                          user_address: props.address_school,
                          urlClient:
                            import.meta.env.VITE_CLIENT_URL +
                            path.Degree.split("/").slice(0, 2).join("/") +
                            "/",
                        },
                        {
                          responseType: "blob",
                        },
                      )
                      .then((response: any) => {
                        if (response) {
                          const blob = new Blob([response], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", "degrees.xlsx");
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        } else {
                          alert("Không nhận được file từ server!");
                        }
                        setLoading(false);
                      });
                  } else {
                    console.warn("Không có objectId nào được tạo.");
                  }
                });
            },
            onError: (err) => {
              console.error("Transaction failed:", err);
            },
          },
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      // Show error message to user
      alert("Failed to create degrees: " + (error.message || "Unknown error"));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div
        id="default-modal"
        className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        aria-hidden="true"
      >
        <div
          style={{ margin: "auto" }}
          className="relative p-4 w-full max-w-2xl max-h-full m-auto "
        >
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700  text-gray-900">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("create_degree")}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={props.onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">{t("close")}</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <div className="mb-5">
                <label
                  htmlFor="degrees"
                  className="block mb-2 text-sm font-medium"
                >
                  {t("file_degrees")}
                </label>
                <input
                  type="file"
                  id="degrees"
                  onChange={(e) => handleFilesChange(e, setFileDegrees)}
                  multiple
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="scoreboard"
                  className="block mb-2 text-sm font-medium "
                >
                  {t("file_scoreboard")}
                </label>
                <input
                  type="file"
                  id="scoreboard"
                  onChange={(e) => handleFilesChange(e, setFileScoreboard)}
                  multiple
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                />
              </div>
              {isFullyMatched && (
                <div>
                  <h3 className="font-semibold mb-2 text-green-600">
                    {t("list_Degrees_Scoreboard")}
                  </h3>
                  <ul className="list-disc pl-5">
                    {matchedFiles.map((item, idx) => (
                      <li className=" text-gray-900" key={idx}>
                        <strong>
                          {t("profile_code")}:{item.name}
                        </strong>
                        ,{t("degree")} : {item.degree.name},{t("scoreboard")} :
                        {item.scoreboard.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Thông báo lỗi nếu không đủ cặp */}
              {!isFullyMatched &&
                (fileDegrees.length > 0 || fileScoreboard.length > 0) && (
                  <div className="mt-4 text-red-600 font-medium">
                    {t("degree_err")}
                  </div>
                )}
            </div>
            <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={props.onClose}
              >
                {t("close")}
              </button>
              <button
                onClick={handleSubmit}
                data-modal-hide="default-modal"
                type="button"
                disabled={!isFullyMatched}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {t("create")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface ModalUpdateDegreeProps {
  degree: IDegree;
  onClose?: () => void;
}

export function ModalUpdateDegree(props: ModalUpdateDegreeProps) {
  const { t } = useTranslation();
  const suiClient = useSuiClient();
  const [loading, setLoading] = useState<boolean>(true);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [data, setData] = useState<IDegree | undefined>(undefined);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = (await suiClient.getObject({
          id: props.degree?.objectId || "",
          options: {
            showContent: true,
          },
        })) as any;
        setData(result.data.content.fields);
      } catch (error) {
        console.error("Failed to fetch object:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (data == undefined || loading) {
    return <Loading />;
  }

  const send = async () => {
    if (!currentAccount) {
      alert("Current account is undefined");
      return;
    }
    setLoading(true);
    const tx = new Transaction();
    tx.setSender(currentAccount.address);
    tx.moveCall({
      target: `${PackageAddress}::DegreeManagement::update_degree`,
      arguments: [
        tx.object(data.school_address ?? ""),
        tx.object(props.degree.objectId ?? ""),
        tx.pure.vector("u8", data.ipfs_url_bytes ?? new Uint8Array()),
        tx.pure.bool(data.status),
        tx.object(ClockAddress),
      ],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient
            .waitForTransaction({
              digest: tx.digest,
            })
            .then(async () => {
              if (data.status != props.degree.status) {
                await axiosClient.put("/degree/" + props.degree._id, {
                  status: data.status,
                });
              }
              setLoading(false);
              props.onClose;
            });
        },
        onError: (err) => {
          console.error("Transaction failed:", err);
        },
      },
    );
  };
  return (
    <>
      <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div
          style={{ margin: "auto" }}
          className="relative p-4 w-full max-w-2xl max-h-full m-auto "
        >
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("update")}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={props.onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">{t("close")}</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-8">
              <div>
                <label
                  htmlFor="code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("code")}
                </label>
                <input
                  type="text"
                  id="code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Code"
                  value={data.code.toString()}
                  onChange={(e) => {
                    setData({ ...data, code: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("code")} Ipfs
                </label>
                <input
                  type="text"
                  id="code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Code"
                  value={uint8ArrayToString(
                    data.ipfs_url_bytes ?? new Uint8Array(),
                  )}
                  onChange={(e) => {
                    setData({
                      ...data,
                      ipfs_url_bytes: stringToUint8Array(e.target.value),
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("status")}
                </label>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    id="status"
                    type="checkbox"
                    className="sr-only peer"
                    checked={data.status}
                    onChange={(e) => {
                      setData({
                        ...data,
                        status: e.target.checked,
                      });
                    }}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600" />
                </label>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={props.onClose}
              >
                {t("close")}
              </button>
              <button
                onClick={send}
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {t("update")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
