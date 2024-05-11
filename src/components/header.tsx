"use client";

import { useCurrentChainId } from "@/hooks/useCurrentChainId";
import { useReads } from "@/hooks/useReads";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { LuDatabase, LuLandmark, LuLineChart, LuUserCog2 } from "react-icons/lu";
import { useWindowSize } from "react-use";
import { sepolia } from "viem/chains";
const social_networks: any[] = [
  // { name: "doc", url: DOC_LINK, icon: TbBook2 },
  // { name: "Twitter", url: TWITTER_LINK, icon: TbBrandTwitterFilled },
  // { name: "Discord", url: DISCORD_LINK, icon: TbBrandDiscordFilled },
];

const NetName: { [k: number]: string } = {
  [sepolia.id]: "Ethereum Sepolia",
};

export function Header() {
  const pathname = usePathname();
  const { width } = useWindowSize(window.innerWidth, window.innerHeight);
  const hiddenTitle = pathname !== "/" && width < 1024;
  // const modal = useModal()
  const chainId = useCurrentChainId();
  const { openChainModal } = useChainModal();

  const links = useMemo(() => {
    const links = [
      { href: "/dashboard", label: "Dashboard", icon: LuLineChart },
      { href: "/pool", label: "Pools", icon: LuDatabase },
      { href: "/operator", label: "Operators", icon: LuUserCog2 },
      { href: "/governance", label: "Governance", icon: LuLandmark },
    ];

    return links;
  }, []);
  useReads()
  return (
    <header className="h-[72px] fixed w-full max-w-[1440px] inset-0 mx-auto flex items-center justify-between px-4 bg-slate-50/30 backdrop-blur-lg z-30 ml-[calc(100vw - 100%)]">
      <div className="flex items-center">
        <Link href={"/"} className="font-semibold flex pr-1 items-center text-base leading-7">
          <BsCurrencyBitcoin className="text-2xl text-orange-400" />
          <span className="font-poppins" style={{ display: hiddenTitle ? "none" : "inline-block" }}>
            BitcoinZK
          </span>
        </Link>
      </div>

      {/* Render App routes */}
      {
        <div className="flex flex-1 px-5 items-center justify-between">
          {links.map(({ href, label, icon }) => {
            const Icon = icon;
            return (
              <Link
                className={clsx(
                  "text-sm font-medium flex gap-1 mx-auto items-center transition-all active:translate-y-1",
                  pathname === `/${href}` ? "text-slate-700" : "text-slate-500"
                )}
                key={href}
                href={href}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </div>
      }

      <div className="flex items-center gap-1 md:gap-4">
        {/* Social networks */}
        <div className="hidden lg:flex items-center gap-3">
          {social_networks.map(({ url, icon, name }) => {
            const Icon = icon;
            return (
              <Link key={name} href={url} className="text-slate-300 hover:text-indigo-500">
                <Icon />
              </Link>
            );
          })}
        </div>

        {/* Render action button */}

        <ConnectButton />
      </div>
    </header>
  );
}
