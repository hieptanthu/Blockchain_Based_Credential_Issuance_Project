import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const network = (() => {
  switch (import.meta.env.VITE_NETWORK) {
    case "testnet":
      return "testnet";
    case "mainnet":
      return "mainnet";
    case "devnet":
    default:
      return "devnet"; // fallback nếu không có giá trị nào khớp
  }
})();

const networkURL = networkConfig[network].url;

export {
  useNetworkVariable,
  useNetworkVariables,
  networkConfig,
  network,
  networkURL,
};
