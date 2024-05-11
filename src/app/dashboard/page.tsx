"use client";

import { abiBribe, abiVoBZK } from "@/abis";
import BondBZK from "@/components/modals/BondBZK";
import Delegate from "@/components/modals/Delegate";
import RegisterOperator from "@/components/modals/RegisterOperator";
import UnBondBZK from "@/components/modals/UnBondBZK";
import { CONFIG_CONTRACTS } from "@/config";
import { useCurrentChainId } from "@/hooks/useCurrentChainId";
import { selectVotingPower, useStore } from "@/store";
import { ApproveAndTx } from "@/ui/ApproveAndTx";
import SimpleTable from "@/ui/SimpleTable";
import { formatBn } from "@/ui/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { ReactNode } from "react";

function DelegationItem(p: { tit: string; value: string; action?: ReactNode }) {
  return (
    <div className="flex gap-1 flex-col">
      <div className="font-medium">{p.tit}</div>
      <div>{p.value}</div>
      {p.action}
    </div>
  );
}

const headerClassName = "font-semibold";

export default function Page() {
  const chainId = useCurrentChainId();
  const cc = CONFIG_CONTRACTS[chainId];
  const store = useStore();
  const vote = useStore(selectVotingPower);
  const delegates = [...store.delegatesBribe, ...store.delegates];
  return (
    <main className="grid grid-cols-2 gap-5 px-5">
      <Card>
        <CardHeader className={headerClassName}>My Assets</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-10 items-center">
            <div>BZK: {formatBn(store.bzkBalance)}</div> <BondBZK />
          </div>
          <div className="flex gap-10 items-center">
            <div>voBZK: {formatBn(store.voBzkBalance)}</div> <UnBondBZK />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className={headerClassName}>Operator Role</CardHeader>
        <CardBody>
          <div>Current Role</div>
          <div>{store.isOperator ? "Operator" : store.isCandidate ? "Candidate" : "N/A"}</div>
        </CardBody>
        <CardFooter className="flex gap-5 items-center">
          <RegisterOperator />
          <RegisterOperator forOthers />
        </CardFooter>
      </Card>
      <Card className="col-span-2">
        <CardHeader className={headerClassName}>My Delegation</CardHeader>
        <CardBody className="gap-4">
          <div>My total voBZK: {formatBn(store.voBzkBalance)}</div>
          <div>In Delegation: {formatBn(store.voBzkInDelegation)}</div>
          <SimpleTable
            headers={["#", "Delegated to", "Amount", "Bribe", "Action"]}
            rows={delegates.map((item, index) => [
              `#${index + 1}`,
              item._delegate,
              formatBn(item._value),
              item.bribe ? "YES" : "NO",
              <ApproveAndTx
                tx="Undelegate"
                key={index}
                // @ts-ignore
                write={
                  item.bribe
                    ? { abi: abiBribe, address: cc.Bribe, functionName: "undelegate", args: [item._delegate, item._value] }
                    : { abi: abiVoBZK, address: cc.voBZK, functionName: "undelegate", args: [item._delegate, item._value] }
                }
              />,
            ])}
          />
          <div className="flex items-center gap-5">
            Not In Delegation: {formatBn(store.voBzkBalance - store.voBzkInDelegation)} <Delegate />
          </div>
        </CardBody>
      </Card>
      <Card className="col-span-2">
        <CardHeader className={headerClassName}>My Vote</CardHeader>
        <CardBody className="">
          <div>My voBZK available: {formatBn(vote.voteOfVoBZK)}</div>
          <div>Received Delegation from others: {formatBn(vote.voteReceived)}</div>
          <div>Total Voting Power: {formatBn(vote.voteTotal)}</div>
        </CardBody>
      </Card>
    </main>
  );
}
