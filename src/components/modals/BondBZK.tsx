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

export default function BondBZK() {
  const [amount, setAmount] = useState("");
  const amountBn = parseBn(amount);
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const { bzkBalance, bzkInOperator, bzkInProposal, bzkInBonding } = useStore((s) => ({
    bzkBalance: s.bzkBalance,
    bzkInOperator: s.bzkInOperator,
    bzkInProposal: s.bzkInProposal,
    bzkInBonding: s.bzkInBonding,
  }));
  const total = bzkBalance + bzkInOperator + bzkInProposal + bzkInBonding;
  return (
    <SimpleModal
      title="Bond BZK"
      trigger="Bond BZK"
      triggerProps={{ disabled: !cc }}
      bodyProps={{
        className: "flex flex-col gap-5",
      }}
      children={
        <>
          <div className="flex flex-col gap-1">
            <Info tit="My BZK total balance" value={formatBn(total)} />
            <Info tit="In Operator Deposit" value={formatBn(bzkInOperator)} />
            <Info tit="In Proposal Deposit" value={formatBn(bzkInProposal)} />
            <Info tit="In Bonding Process" value={formatBn(bzkInBonding)} />
          </div>
          <Info tit="Available to Bond" value={formatBn(bzkBalance)} />
          <Input label="Bond Amount:" required validate={validationPositiveNumber} value={amount} onValueChange={setAmount} />
        </>
      }
      footer={
        <ApproveAndTx
          tx="Confirm Bond"
          write={{ abi: abiVoBZK, functionName: "initalBond", address: cc.voBZK, args: [amountBn] }}
          onTxSuccess={() => setAmount("")}
        />
      }
    />
  );
}
