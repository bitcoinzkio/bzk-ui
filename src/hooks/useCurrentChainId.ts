import { SUPPORT_CHAINS } from "@/config";

import { useChainId } from "wagmi";

const refChainId: { chainId: number } = {
  chainId: SUPPORT_CHAINS[0].id,
};

export function getCurrentChainId() {
  return refChainId.chainId;
}
export function setCurrentChainId(chainId: number) {
  const chain = SUPPORT_CHAINS.find((item) => item.id == chainId);
  if (chain) refChainId.chainId = chainId;
}

export function useCurrentChainId() {
  const chainId = useChainId();
  setCurrentChainId(chainId);
  return getCurrentChainId();
}
