import { abiOperator } from "@/abis";
import { CONFIG_CONTRACTS } from "@/config";
import { useCurrentChainId } from "@/hooks/useCurrentChainId";
import { useStore } from "@/store";
import { ApproveAndTx } from "@/ui/ApproveAndTx";
import SimpleModal from "@/ui/SimpleModal";
import { formatBn, parseBn, validationAddress, validationPositiveNumber } from "@/ui/utils";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

function Info(p: { tit: string; value: string }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="font-medium">{p.tit}:</div>
      <div>{p.value}</div>
    </div>
  );
}

export default function RegisterOperator({ forOthers }: { forOthers?: boolean }) {
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const { address: account } = useAccount();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const amountBn = parseBn(amount);
  const ableBZK = useStore((s) => s.bzkBalance);
  return (
    <SimpleModal
      title="Register Operator"
      trigger={forOthers ? "Register for others" : "Register for me"}
      triggerProps={{ disabled: !cc || !account }}
      bodyProps={{
        className: "flex flex-col gap-5",
      }}
      footer={
        <ApproveAndTx
          tx="Confirm Register"
          spender={cc.Operator}
          approves={{
            [cc.bzk]: amountBn,
          }}
          onTxSuccess={() => {
            setAmount("");
            setAddress("");
          }}
          write={{
            abi: abiOperator,
            functionName: "supportCandidate",
            address: cc.Operator,
            args: [(forOthers ? address : account) as Address, amountBn],
          }}
        />
      }
    >
      {forOthers && <Input label="Register For:" required validate={validationAddress} value={address} onValueChange={setAddress} />}
      <div className="flex flex-col gap-1">
        <Info tit="Fund BZK for Register" value="" />
        <div className="font-bold">You are able to fund {formatBn(ableBZK)} BZK</div>
      </div>
      <Input label="Amount:" required validate={validationPositiveNumber} value={amount} onValueChange={setAmount} />
    </SimpleModal>
  );
}
