import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { formatUnits, parseUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function getBigint(result: any, path: string | (string | number)[], def: bigint = 0n) {
  const data = get(result, path, def);
  if (typeof data == "bigint") return data;
  if (typeof data == "number") return BigInt(data);
  return def;
}

export function getErrorMsg(error: any) {
  // msg
  let msg = "Unkown";
  if (typeof error == "string") msg = error;
  else if (typeof error?.msg == "string") msg = error?.msg;
  else if (typeof error?.message == "string") msg = error?.message;
  // replace
  if (msg.includes("User denied") || msg.includes("user rejected transaction")) return "You declined the action in your wallet.";
  if (msg.includes("transaction failed")) return "Transaction failed";
  return msg;
}

export function isPositiveNumber(value: string) {
  return /^(\d+(\.\d+)?|\.\d+)$/.test(value);
}

export function validationPositiveNumber(value: string) {
  return isPositiveNumber(value) ? undefined : "Must be a positive number";
}

export function validationAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value) ? undefined : "Invalid address";
}

export function parseBn(val: string, decimals: number = 18) {
  try {
    const str = (val || "0").replaceAll(",", "");
    return parseUnits(str, decimals);
  } catch (error) {
    return 0n;
  }
}

export function formatBn(val: string | bigint | number, decimals: number = 18) {
  try {
    return formatUnits(BigInt(val), decimals);
  } catch (error) {
    return "-";
  }
}
