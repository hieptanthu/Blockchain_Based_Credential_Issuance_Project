import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Loading } from "../../components/Loading";
import { ISchool } from "../../types/Ischool";
import { stringToUint8Array } from "../../tool/stringAndUint8Array";
import axiosClient from "../../api/axiosClient";
import { Transaction } from "@mysten/sui/transactions";
import ipfs from "../../api/updateIpfs";

interface ModalSchoolProps {
  schoolUpdate?: ISchool;
  onClose?: () => void;
}
function ModalSchool({ schoolUpdate, onClose }: ModalSchoolProps) {
  const [loading, setLoading] = useState<number>(0);
  const [typeAction, setTypeAction] = useState<"create" | "update">("create");
  const [school, setSchool] = useState<ISchool>({
    code: "",
    fullname: "",
    address_school: "",
    address_manager: "",
    ipfs_url: "",
    status: true,
  });

  if (schoolUpdate && schoolUpdate._id && !school._id) {
    setTypeAction("update");
    setSchool(schoolUpdate);
  }

  const PackageAddress = import.meta.env.VITE_ADDRESS_PACKAGE;
  const ManageAddress = import.meta.env.VITE_ADDRESS_ADMIN;
  const ClockAddress = import.meta.env.VITE_CLOCK_ADDRESS;

  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const AddSchool = (school: ISchool) => {
    if (!currentAccount) {
      alert("Current account is undefined");
      return;
    }
    const tx = new Transaction();
    tx.setSender(currentAccount.address);
    tx.moveCall({
      arguments: [
        tx.object(ManageAddress),
        tx.pure.vector("u8", stringToUint8Array(school.code)),
        tx.pure.address(school.address_manager),
        tx.pure.vector("u8", stringToUint8Array(school.ipfs_url)),
        tx.pure.bool(school.status),
        tx.object(ClockAddress),
      ],
      target: `${PackageAddress}::SchoolManager::create_school`,
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
              const createdObjects = data.objectChanges.filter(
                (change: any) => change.type === "created",
              );
              setLoading(80);
              const SchoolOut: ISchool = {
                code: school.code,
                fullname: school.fullname,
                address_school: school.address_school,
                address_manager: school.address_manager,
                ipfs_url: school.ipfs_url,
                status: school.status,
                objectId: createdObjects[0].objectId,
                digest: tx.digest,
                address_user_create: currentAccount.address,
              };
              await axiosClient.post<ISchool[]>("/school", { data: SchoolOut });
              setLoading(100);
            });
        },
        onError: (err) => {
          console.error("Transaction failed:", err);
        },
      },
    );
  };

  const updateSchool = async (school: ISchool) => {
    if (!currentAccount) {
      alert("Current account is undefined");
      return;
    }
    if (!school.objectId) {
      alert("School objectId is undefined");
      return;
    }

    if (!school._id) {
      alert("School objectId is undefined");
      return;
    }

    const tx = new Transaction();
    tx.setSender(currentAccount.address);
    tx.moveCall({
      arguments: [
        tx.object(ManageAddress),
        tx.object(school.objectId),
        tx.pure.vector("u8", stringToUint8Array(school.code)),
        tx.pure.address(school.address_manager),
        tx.pure.vector("u8", stringToUint8Array(school.ipfs_url)),
        tx.pure.bool(school.status),
        tx.object(ClockAddress),
      ],
      target: `${PackageAddress}::SchoolManager::update_school`,
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
            .then(async () => {
              setLoading(80);
              await axiosClient.put<ISchool[]>("/school/" + school._id, {
                data: school,
              });
              setLoading(100);
            });
        },
        onError: (err) => {
          console.error("Transaction failed:", err);
        },
      },
    );
  };

  async function send() {
    setLoading(10);
    if (typeAction === "create") {
      await AddSchool(school);
    } else {
      await updateSchool(school);
    }
  }

  if (loading === 100) {
    setLoading(0);
    onClose && onClose();
  }

  if (loading > 0) {
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
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {typeAction === "create" ? "Create School" : "Update School"}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={onClose}
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Code"
                  value={school.code}
                  onChange={(e) => {
                    setSchool({ ...school, code: e.target.value });
                  }}
                  disabled={typeAction !== "create"}
                />
              </div>
              <div>
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(5); // Optional loading state
                      try {
                        const ipfsUrl = await ipfs.uploadToIPFS(file);
                        console.log("IPFS URL:", ipfsUrl);
                        setSchool({ ...school, ipfs_url: ipfsUrl });
                      } catch (error) {
                        alert("Upload ảnh thất bại!");
                        console.error(error);
                      }
                      setLoading(0);
                    }
                  }}
                />
                {school.ipfs_url && (
                  <img
                    src={school.ipfs_url}
                    alt="Uploaded"
                    className="mt-2 w-32 h-32 object-cover"
                    style={{ borderRadius: "8px" }}
                  ></img>
                )}
              </div>
              <div>
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Fullname
                </label>
                <input
                  type="text"
                  id="fullname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Fullname"
                  value={school.fullname}
                  onChange={(e) => {
                    setSchool({ ...school, fullname: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address School
                </label>
                <input
                  type="text"
                  id="address_school"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="address_school"
                  value={school.address_school}
                  onChange={(e) => {
                    setSchool({ ...school, address_school: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="address_manager"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address Manager
                </label>
                <input
                  type="text"
                  id="address_manager"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Address Manager"
                  value={school.address_manager}
                  onChange={(e) => {
                    setSchool({
                      ...school,
                      address_manager: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
                <input
                  checked={school.status} // Bind to the state
                  id="bordered-checkbox-2"
                  type="checkbox"
                  name="bordered-checkbox"
                  onChange={(e) => {
                    setSchool({ ...school, status: e.target.checked }); // Update state with the checkbox's checked status
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="bordered-checkbox-2"
                  className="w-full py-4 ms-2 m-3.5 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  status
                </label>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onClose}
              >
                Close
              </button>
              <button
                onClick={send}
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {typeAction === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalSchool;
