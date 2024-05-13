import { create } from "zustand";
import { ReadsResult } from "./hooks/configReads";

export type Store = ReadsResult & {
  refetchReads: () => void;
  isFetchingReads: boolean;
  set: (data: Partial<Omit<Store, "set">>) => void;
};

export type ReadContractsConfig = {
  [k: string]: () => Promise<unknown>;
};

export const useStore = create<Store>((set) => {
  return {
    // datas,
    bzkBalance: 0n,
    bzkInOperator: 0n,
    bzkInProposal: 0n,
    bzkInBonding: 0n,
    voBzkBalance: 0n,
    voBzkInDelegation: 0n,
    votes: 0n,
    isOperator: false,
    isCandidate: false,
    delegates: [],
    delegatesBribe: [],
    refetchReads: () => {},
    isFetchingReads: false,
    set,
  };
});

export const selectVotingPower = (s: Store) => ({
  voteOfVoBZK: s.voBzkBalance - s.voBzkInDelegation,
  voteReceived: s.votes - (s.voBzkBalance - s.voBzkInDelegation),
  voteTotal: s.votes,
});
