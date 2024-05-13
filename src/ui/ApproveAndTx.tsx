import { useEffect, useMemo, useRef, useState } from "react";
import { toast as toaster } from "sonner";
import { Abi, Address, ContractFunctionArgs, ContractFunctionName, erc20Abi, zeroAddress } from "viem";
import { Config, useAccount, useBlockNumber, usePublicClient, useWalletClient, useWriteContract } from "wagmi";
import { WriteContractVariables } from "wagmi/query";
import { Button } from "./Button";
import { getBigint, getErrorMsg } from "./utils";
import { useStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { CONFIRMATIONS } from "@/config";

const cacheAllowance: { [k: Address]: { [k: Address]: bigint } } = {};
const NATIVE_TOKEN_ADDRESS = zeroAddress;
export const useApproves = (
  needAllownce: { [k: Address]: bigint },
  spender: Address | undefined,
  reqBigAmount: bigint | false = 10000000000n * 10n ** 18n
) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const pc = usePublicClient();
  const [isSuccess, setSuccess] = useState(false);
  const tokens = useMemo(() => Object.keys(needAllownce).filter((item) => item !== NATIVE_TOKEN_ADDRESS) as Address[], [needAllownce]);
  const [allowance, setAllownce] = useState<{ [k: Address]: bigint }>(spender ? cacheAllowance[spender] || {} : {});
  const updateAllownce = (token: Address, value: bigint) => {
    if (!spender) return;
    cacheAllowance[spender] = { ...(cacheAllowance[spender] || {}), [token]: value };
    setAllownce((old) => ({ ...old, [token]: value }));
  };
  const { data: blocknumber } = useBlockNumber();
  const client = usePublicClient();
  useEffect(() => {
    if (!address || !spender || !pc) {
      return;
    }

    tokens.forEach((t) => {
      pc.readContract({ abi: erc20Abi, address: t, functionName: "allowance", args: [address, spender] })
        .then((value) => updateAllownce(t, value || 0n))
        .catch(console.error);
    });
  }, [tokens, address, blocknumber]);
  const [loading, setLoading] = useState(false);
  const needApproves = useMemo(() => {
    return tokens.filter((t) => getBigint(needAllownce, t) > 0n && getBigint(needAllownce, t) > getBigint(allowance, t));
  }, [needAllownce, tokens, allowance]);
  const approve = async () => {
    if (needApproves.length == 0 || !spender) return;
    try {
      setLoading(true);
      setSuccess(false);
      for (let index = 0; index < needApproves.length; index++) {
        const token = needApproves[index];
        // const allowanceValue = needAllownce[token]
        const allowanceValue = reqBigAmount === false ? needAllownce[token] : reqBigAmount;
        const txHash = await walletClient?.writeContract({
          abi: erc20Abi,
          address: token,
          functionName: "approve",
          args: [spender, allowanceValue],
        });
        txHash && (await client?.waitForTransactionReceipt({ hash: txHash, confirmations: CONFIRMATIONS }));
        updateAllownce(token, allowanceValue);
      }
      toaster.success("Approve success ✅");
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      toaster.error(getErrorMsg(error));
      setLoading(false);
      setSuccess(false);
      throw error;
    }
  };
  return { approve, loading, shouldApprove: needApproves.length > 0, isSuccess };
};

export function ApproveAndTx<
  abi extends Abi,
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config
>({
  tx,
  approves,
  spender,
  requestAmount,
  write,
  toast = true,
  disabled,
  onTxSuccess,
  onApproveSuccess,
}: {
  className?: string;
  tx: string;
  approves?: { [k: Address]: bigint };
  spender?: Address;
  requestAmount?: bigint;
  write: WriteContractVariables<abi, functionName, args, config, config["chains"][number]["id"]>;
  toast?: boolean;
  disabled?: boolean;
  onTxSuccess?: () => void;
  onApproveSuccess?: () => void;
}) {
  const { writeContractAsync } = useWriteContract({});
  const pc = usePublicClient();
  const { mutate: doTx, isPending } = useMutation({
    mutationFn: async () => {
      if (!pc) throw "Not connect";
      const hash = await writeContractAsync(write as any);
      await pc.waitForTransactionReceipt({ hash, confirmations: CONFIRMATIONS });
    },
    onError: (error) => {
      const msg = getErrorMsg(error);
      toast && toaster.error(msg);
    },
    onSuccess: (tx) => {
      reFetchReads();
      onTxSuccess && onTxSuccess();
      toast && toaster.success("Transiction Success !");
    },
  });
  const txDisabled = disabled || isPending;
  const {
    approve,
    shouldApprove,
    loading: isApproveLoading,
    isSuccess: isApproveSuccess,
  } = useApproves(approves || {}, spender, requestAmount);
  const onApproveSuccessRef = useRef<() => void>();
  onApproveSuccessRef.current = onApproveSuccess;
  useEffect(() => {
    onApproveSuccessRef.current && isApproveSuccess && onApproveSuccessRef.current();
  }, [isApproveSuccess]);

  const approveDisabled = disabled || !approve || isApproveLoading;
  const reFetchReads = useStore((s) => s.refetchReads);
  if (shouldApprove) return <Button onClick={approve} disabled={approveDisabled} loading={isApproveLoading} text="Approve" />;
  return <Button onClick={() => doTx()} disabled={txDisabled} loading={isPending} text={tx} />;
}
