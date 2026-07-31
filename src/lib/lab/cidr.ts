export interface CidrResult {
  address: string;
  prefix: number;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  firstUsable: string | null;
  lastUsable: string | null;
  totalAddresses: number;
  usableHosts: number;
}

function ipToInt(ip: string): number {
  const octets = ip.trim().split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) {
    throw new Error(`"${ip}" isn't a valid IPv4 address.`);
  }
  return octets.reduce((acc, o) => (acc << 8) + o, 0) >>> 0;
}

function intToIp(n: number): string {
  return [24, 16, 8, 0].map((shift) => (n >>> shift) & 255).join(".");
}

export function parseCidr(input: string): CidrResult {
  const [address, prefixStr] = input.trim().split("/");
  const prefix = Number(prefixStr);
  if (!address || Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error("Enter a CIDR block like 192.168.1.10/24.");
  }

  const ipInt = ipToInt(address);
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  let usableHosts: number;
  let firstUsable: string | null;
  let lastUsable: string | null;

  if (prefix === 32) {
    usableHosts = 1;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(networkInt);
  } else if (prefix === 31) {
    usableHosts = 2;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(broadcastInt);
  } else {
    usableHosts = totalAddresses - 2;
    firstUsable = intToIp(networkInt + 1);
    lastUsable = intToIp(broadcastInt - 1);
  }

  return {
    address,
    prefix,
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    subnetMask: intToIp(maskInt),
    firstUsable,
    lastUsable,
    totalAddresses,
    usableHosts,
  };
}
