"use client";

import BondBZK from "@/components/modals/BondBZK";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
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
  return (
    <div className="grid grid-cols-2 gap-5 px-5">
      Operator
    </div>
  );
}
