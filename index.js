import {
  createWalletClient,
  createPublicClient,
  custom,
  parseEther,
  formatEther,
  defineChain, 
} from "https://esm.sh/viem";
import { contractAddress, ABI } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const balanceBtn = document.getElementById("balanceBtn");
const ethAmountInp = document.getElementById("ethAmountInp");
const fundBtn = document.getElementById("fundBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

let walletClient;
let publicClient;
let ethAmount;

async function connect() {
  if (typeof window.ethereum !== undefined) {
    console.log("connecting...");
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    console.log("Connected to wallet");
    connectBtn.innerHTML = "Connected!";
  } else {
    alert("Please install MetaMask to use this feature.");
    connectBtn.innerHTML = "Connect Wallet";
  }
}
async function getBalance() {
  if (typeof window.ethereum !== undefined) {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const balance = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(formatEther(balance));
  }
}

async function fund() {
  ethAmount = ethAmountInp.value;
  console.log(`transferring ${ethAmount} ETH...`);

  if (typeof window.ethereum !== undefined) {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    walletClient.requestAddresses();
    const [connectedAccount] = await walletClient.getAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: ABI,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmount),
    });
    // console.log(request);
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  }
}
async function withdraw() {
  console.log("Withdrawing funds...");

  if (typeof window.ethereum !== "undefined") {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    await walletClient.requestAddresses();
    const [connectedAccount] = await walletClient.getAddresses();
    const currentChain = await getCurrentChain(walletClient);

    const publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: ABI,
      functionName: "withdraw",
      account: connectedAccount,
      chain: currentChain,
    });

    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);
  } else {
    console.error("MetaMask is not installed!");
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

connectBtn.addEventListener("click", connect);
balanceBtn.addEventListener("click", getBalance);
fundBtn.addEventListener("click", fund);
withdrawBtn.addEventListener("click", withdraw);
