"use client";

import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Toaster } from "sonner";

import dynamic from "next/dynamic";
const Providers = dynamic(() => import("./providers"), {
  ssr: false,
});

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <div className="min-h-[calc(100vh+1px)] h-auto pt-[80px] pb-6">{children}</div>
      </Providers>
      <Toaster position="top-right" offset={70} />
    </>
  );
}
