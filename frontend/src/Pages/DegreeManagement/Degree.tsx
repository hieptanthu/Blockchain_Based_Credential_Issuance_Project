import { useSuiClientQuery } from "@mysten/dapp-kit";
import { uint8ArrayToString } from "../../tool/stringAndUint8Array";

import { useParams, useNavigate } from "react-router-dom";
function Degree() {
  let { ojbID } = useParams();
  const navigate = useNavigate();
  if (!ojbID) {
    navigate("/");
    return null;
  }
  const { data } = useSuiClientQuery("getObject", {
    id: ojbID,
    options: {
      showContent: true,
    },
  }) as any;

  const School = useSuiClientQuery("getObject", {
    id: data?.data?.content?.fields.school_address,
    options: {
      showContent: true,
    },
  }) as any;

  if (!data?.data) {
    navigate("/");
  }

  return (
    <>
      <div>
        <div className="flex justify-around h-14 items-center ">
          <div>
            <h1 className="content-center">
              Code :{data?.data?.content?.fields.code}
            </h1>
          </div>
          <div className="flex m-2.5">
            <img
              className="h-11 m-1.5"
              src={
                import.meta.env.VITE_IPFS_GATEWAY +
                uint8ArrayToString(
                  School?.data?.data?.content?.fields.ipfs_url_bytes ??
                    new ArrayBuffer(),
                )
              }
              alt=""
            />
            <h1 className="content-center">
              {uint8ArrayToString(
                School?.data?.data?.content?.fields.code_bytes ??
                  new ArrayBuffer(),
              )}
            </h1>
          </div>
        </div>
        <div className="items-center justify-items-center-safe">
          <img
            src={
              import.meta.env.VITE_IPFS_GATEWAY +
              uint8ArrayToString(data?.data?.content?.fields.ipfs_url_bytes) +
              "/imgDegree"
            }
            alt=""
          />
          <div>
            <iframe
              src={
                import.meta.env.VITE_IPFS_GATEWAY +
                uint8ArrayToString(data?.data?.content?.fields.ipfs_url_bytes) +
                "/scoreboard"
              }
              width="100%"
              height="600px"
              title="Degree PDF"
            ></iframe>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Degree;
// Compare
