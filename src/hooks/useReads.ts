import { CONFIG_CONTRACTS } from "@/config";
import { useStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { ReadsResult, createReads } from "./configReads";
import { useCurrentChainId } from "./useCurrentChainId";
import { useEffect } from "react";

export function useReads() {
  const { address } = useAccount();
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const pc = usePublicClient();

  const { data, refetch } = useQuery({
    queryKey: ["reads", address, chainId, !!pc],
    retry: true,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      // console.log("useReads", reads);
      if (!pc || !cc) return undefined;
      const reads = createReads(pc, cc, address);
      const results: any = {};
      await Promise.all(
        Object.keys(reads).map(async (k) => {
          results[k] = await reads[k as keyof typeof reads]();
        })
      );
      const data = results as ReadsResult;
      return data;
    },
  });
  const { set } = useStore();
  useEffect(() => {
    data && set({ ...data, refetchReads: refetch });
  }, [data]);
}
