import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { createApiSchool, updateApiSchool } from "../../api/apiSchool";
import { ISchool } from "../../types/Ischool";
import { stringToUint8Array } from "../../tool/stringAndUint8Array";

// import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
function modal(props?: ISchool) {
  const [Loading, setLoading] = useState<number>(0);
  const [typeAction, setTypeAction] = useState<"create" | "update">("create");
  const [school, setSchool] = useState<ISchool>({
    code: "",
    fullname: "",
    address_school: "",
    address_manager: "",
    ipfs_url: "",
    status: false,
    objectId: "",
    digest: "",
    address_user_create: "",
  });

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
              const ISchool: ISchool = {
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
              await createApiSchool(ISchool);
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
              await updateApiSchool(school);
              setLoading(98);
            });
        },
        onError: (err) => {
          console.error("Transaction failed:", err);
        },
      },
    );
  };
  function send() {
    setLoading(10);
    if (typeAction === "create") {
      AddSchool(school);
    } else {
      updateSchool(school);
    }
    setLoading(100);
  }

  if (props) {
    setTypeAction("update");
    setSchool(props);
  }
  return (
    <div>
      loading: {Loading}
      <button onClick={send}></button>
    </div>
  );
}

export default modal;
