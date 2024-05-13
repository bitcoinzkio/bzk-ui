import { abiVoBZK } from "@/abis";
import { CONFIG_CONTRACTS } from "@/config";
import { useCurrentChainId } from "@/hooks/useCurrentChainId";
import { useStore } from "@/store";
import { ApproveAndTx } from "@/ui/ApproveAndTx";
import SimpleModal from "@/ui/SimpleModal";
import { formatBn, parseBn, validationPositiveNumber } from "@/ui/utils";
import { Input } from "@nextui-org/react";
import { useState } from "react";

function Info(p: { tit: string; value: string }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="font-medium">{p.tit}:</div>
      <div>{p.value}</div>
    </div>
  );
}

export default function UnBondBZK() {
  const [amount, setAmount] = useState("");
  const amountBn = parseBn(amount);
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const { voBzkBalance, voBzkInDelagation } = useStore((s) => ({
    voBzkBalance: s.voBzkBalance,
    voBzkInDelagation: s.voBzkInDelegation,
  }));
  const available = voBzkBalance - voBzkInDelagation;
  return (
    <SimpleModal
      title="Unbond BZK"
      trigger="Unbond BZK"
      triggerProps={{ disabled: !cc }}
      bodyProps={{
        className: "flex flex-col gap-5",
      }}
      children={
        <>
          <div className="flex flex-col gap-1">
            <Info tit="My voBZK total balance" value={formatBn(voBzkBalance)} />
            <Info tit="In Delegation" value={formatBn(voBzkInDelagation)} />
          </div>
          <Info tit="Available to Unbond" value={formatBn(available)} />
          <Input label="Unbond Amount:" required validate={validationPositiveNumber} value={amount} onValueChange={setAmount} />
        </>
      }
      footer={
        <ApproveAndTx
          tx="Confirm Unbond"
          write={{ abi: abiVoBZK, functionName: "unbond", address: cc.voBZK, args: [amountBn] }}
          onTxSuccess={() => {
            setAmount("");
          }}
        />
      }
    />
  );
}
