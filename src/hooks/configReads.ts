import { abiOperator, abiVoBZK } from "@/abis";
import { ConfigContract } from "@/config";
import { UnwrapPromise } from "next/dist/lib/coalesced-function";
import {
  Abi,
  Address,
  ContractFunctionName,
  ContractFunctionReturnType,
  PublicClient,
  erc20Abi
} from "viem";

export function createReadOfUser<TAbi extends Abi, Tfn extends ContractFunctionName<TAbi, "pure" | "view">, RES = bigint>(
  pc: PublicClient,
  account: Address | undefined,
  address: Address,
  abi: TAbi,
  fn: Tfn,
  def: RES = 0n as RES,
  convert?: (res: ContractFunctionReturnType<TAbi, "pure" | "view", Tfn>) => RES
) {
  return async () => {
    if (!account) return def;
    const result = await pc.readContract({ abi, address, functionName: fn, args: [account] as any });
    return (convert ? convert(result) : result) as RES;
  };
}

export function createReads(pc: PublicClient, cc: ConfigContract, account: Address | undefined) {
  const reads = {
    // bzk
    bzkBalance: createReadOfUser(pc, account, cc.bzk, erc20Abi, "balanceOf"),
    bzkInOperator: createReadOfUser(pc, account, cc.Operator, erc20Abi, "balanceOf"),
    bzkInProposal: createReadOfUser(pc, account, cc.governor, erc20Abi, "balanceOf"),
    bzkInBonding: createReadOfUser(pc, account, cc.voBZK, abiVoBZK, "bondOf"),
    // voBzk
    voBzkBalance: createReadOfUser(pc, account, cc.voBZK, erc20Abi, "balanceOf"),
    voBzkInDelegation: createReadOfUser(pc, account, cc.voBZK, abiVoBZK, "delegateBalanceAll"),
    // vote
    votes: createReadOfUser(pc, account, cc.voBZK, abiVoBZK, "getVotes"),

    isOperator: createReadOfUser(pc, account, cc.Operator, abiOperator, "isOperator", false),
    isCandidate: createReadOfUser(pc, account, cc.Operator, abiOperator, "isCandidate", false),

    // delegates
    delegates: createReadOfUser<typeof abiVoBZK, "delegates", { _delegate: Address; _value: bigint; bribe: boolean }[]>(
      pc,
      account,
      cc.voBZK,
      abiVoBZK,
      "delegates",
      [],
      (res) => res.map((item) => ({ ...item, bribe: false }))
    ),
    delegatesBribe: createReadOfUser<typeof abiVoBZK, "delegateOperators", { _delegate: Address; _value: bigint; bribe: boolean }[]>(
      pc,
      account,
      cc.voBZK,
      abiVoBZK,
      "delegateOperators",
      [],
      (res) => res.map((item) => ({ ...item, bribe: true }))
    ),
  } as const;
  return reads;
}

export type Reads = ReturnType<typeof createReads>;
export type ReadsResult = { [k in keyof Reads]: UnwrapPromise<ReturnType<Reads[k]>> };
