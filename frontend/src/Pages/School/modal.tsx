import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { ISchool } from "../../types/Ischool";
import { stringToUint8Array } from "../../tool/stringAndUint8Array";
import axiosClient from "../../api/axiosClient";
import { Transaction } from "@mysten/sui/transactions";

interface ModalSchoolProps {
  schoolUpdate?: ISchool;
}
function ModalSchool({ schoolUpdate }: ModalSchoolProps) {
  const [Loading, setLoading] = useState<number>(0);
  const [typeAction, setTypeAction] = useState<"create" | "update">("create");
  const [school, setSchool] = useState<ISchool>({
    code: "",
    fullname: "",
    address_school: "",
    address_manager: "",
    ipfs_url: "",
    status: true,
    objectId: "",
    digest: "",
    address_user_create: "",
    updatedAt: "",
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
              setLoading(50);
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
              setLoading(98);
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
              setLoading(50);
              await axiosClient.put<ISchool[]>("/school/" + school._id, {
                data: school,
              });
              setLoading(98);
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
    let flag = false;
    if (typeAction === "create") {
      await AddSchool(school);
      flag = true;
    } else {
      await updateSchool(school);
      flag = true;
    }
    if (flag) {
      await setLoading(100);
    }
  }

  return (
    <div>
      loading: {Loading}
      <button onClick={send}>sdasdasd</button>
    </div>
  );
}

export default ModalSchool;
