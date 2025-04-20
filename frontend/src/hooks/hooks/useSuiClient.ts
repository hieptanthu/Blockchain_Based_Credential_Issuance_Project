import { SuiClient } from "@mysten/sui/client";
import { networkURL } from "../../comfig/networkConfig";

/**
 * Hook tùy chỉnh để lấy đối tượng SuiClient.
 * @returns {SuiClient} Đối tượng SuiClient để tương tác với blockchain Sui.
 */
export const useClient = () => {
  const client = new SuiClient({
    url: networkURL,
  });
  if (!client) {
    throw new Error(
      "SuiClient chưa được cung cấp. Hãy đảm bảo rằng bạn đã bọc ứng dụng của mình trong SuiClientProvider.",
    );
  }
  return client;
};
