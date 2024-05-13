import { abiVoBZK } from "@/abis";
import { CONFIG_CONTRACTS } from "@/config";
import { useCurrentChainId } from "@/hooks/useCurrentChainId";
import { useStore } from "@/store";
import { ApproveAndTx } from "@/ui/ApproveAndTx";
import SimpleModal from "@/ui/SimpleModal";
import { formatBn, parseBn, validationAddress, validationPositiveNumber } from "@/ui/utils";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { Address } from "viem";

function Info(p: { tit: string; value: string }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="font-medium">{p.tit}:</div>
      <div>{p.value}</div>
    </div>
  );
}

export default function Delegate() {
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const amountBn = parseBn(amount);
  const ableDelegate = useStore((s) => s.voBzkBalance - s.voBzkInDelegation);
  return (
    <SimpleModal
      title="Delegate"
      trigger={"Delegate"}
      triggerProps={{ disabled: !cc }}
      bodyProps={{
        className: "flex flex-col gap-5",
      }}
      children={
        <>
          <div className="font-bold">You are able to delegate: {formatBn(ableDelegate)} voBZK</div>
          <Input label="Delegate to:" required validate={validationAddress} value={address} onValueChange={setAddress} />
          <Input label="Delegate Amount:" required validate={validationPositiveNumber} value={amount} onValueChange={setAmount} />
        </>
      }
      footer={
        <ApproveAndTx
          tx="Confirm Delegate"
          onTxSuccess={() => {
            setAmount("");
            setAddress("");
          }}
          write={{ abi: abiVoBZK, functionName: "delegate", address: cc.voBZK, args: [address as Address, amountBn] }}
        />
      }
    />
  );
}
