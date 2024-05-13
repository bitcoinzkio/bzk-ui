import { Address } from "viem";
import { sepolia } from "wagmi/chains";

export type ConfigContract = {
  bzk: Address; // include voBzk
  voBZK: Address;
  Operator: Address;
  Gauge: Address;
  Bribe: Address;
  manager: Address;
  timelock: Address;
  governor: Address;
};

/**
#######################
BZK      deployed to: 0xADBFf5e472cE375980fe12B0Fb6Eb02A36121dcf
#######################
voBZK    deployed to: 0xcb9f47D79482A405AEE8ad1a7759cd6817439451
#######################
Operator deployed to: 0x98160C27d9cfB8Ac58c60C960026019ab6e4375B
#######################
Gauge    deployed to: 0x11c99A155E9E2E1299B2b0353F71b8Fb7C0F3Cd4
#######################
Bribe    deployed to: 0x0e24F5655bF35F922a7C6b55F7A8c04B5d49aaA0
#######################
manager  deployed to: 0xEE2Be8EC22fC585C319E039a79A1826c730d8143
#######################
timelock deployed to: 0xb7136CF1c2aea99Fb65FEBF1a20e240878f67eC7
#######################
governor deployed to: 0x4753AEAE2911403055Dd9480E4Cf80926cd9B521
 
 */
export const CONFIG_CONTRACTS: { [k: number]: ConfigContract } = {
  [sepolia.id]: {
    bzk: "0xADBFf5e472cE375980fe12B0Fb6Eb02A36121dcf",
    voBZK: "0xcb9f47D79482A405AEE8ad1a7759cd6817439451",
    Operator: "0x98160C27d9cfB8Ac58c60C960026019ab6e4375B",
    Gauge: "0x11c99A155E9E2E1299B2b0353F71b8Fb7C0F3Cd4",
    Bribe: "0x0e24F5655bF35F922a7C6b55F7A8c04B5d49aaA0",
    manager: "0xEE2Be8EC22fC585C319E039a79A1826c730d8143",
    timelock: "0xb7136CF1c2aea99Fb65FEBF1a20e240878f67eC7",
    governor: "0x4753AEAE2911403055Dd9480E4Cf80926cd9B521",
  },
};

export const SUPPORT_CHAINS = [sepolia];

export const CONFIRMATIONS = 1;
