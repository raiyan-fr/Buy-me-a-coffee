import {
  createWalletClient,
  createPublicClient,
  custom,
  parseEther,
  formatEther,
  defineChain,
  type WalletClient,
  type PublicClient,
  type Address,
} from "viem";
import "viem/window";
import { contractAddress, ABI } from "./constants-js";

// DOM Elements
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const balanceDisplay = document.getElementById(
  "balanceDisplay"
) as HTMLDivElement;
const balanceBtn = document.getElementById("balanceBtn") as HTMLButtonElement;
const ethAmountInp = document.getElementById(
  "ethAmountInp"
) as HTMLInputElement;
const fundBtn = document.getElementById("fundBtn") as HTMLButtonElement;
const withdrawBtn = document.getElementById("withdrawBtn") as HTMLButtonElement;

// Client instances
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

// Check for Ethereum provider
function hasEthereumProvider(): boolean {
  return typeof window.ethereum !== "undefined";
}

// Initialize clients if not already initialized
async function initializeClients(): Promise<boolean> {
  if (!hasEthereumProvider()) {
    console.error("Ethereum provider not found");
    return false;
  }

  if (!walletClient) {
    if (!window.ethereum) throw new Error("Ethereum provider not found");
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
  }

  if (!publicClient) {
    if (!window.ethereum) throw new Error("Ethereum provider not found");
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
  }

  return true;
}

async function connect(): Promise<void> {
  try {
    if (!hasEthereumProvider()) {
      alert("Please install MetaMask to use this feature.");
      connectBtn.textContent = "Connect Wallet";
      return;
    }

    console.log("Connecting...");
    await initializeClients();
    await walletClient?.requestAddresses();
    console.log("Connected to wallet");
    connectBtn.textContent = "Connected!";
  } catch (error) {
    console.error("Connection error:", error);
    connectBtn.textContent = "Connect Wallet";
    alert("Failed to connect wallet");
  }
}

async function getBalance(): Promise<void> {
  try {
    if (!(await initializeClients())) return;
    if (!publicClient) throw new Error("Public client not initialized");

    const balance = await publicClient.getBalance({
      address: contractAddress as Address,
    });

    const formattedBalance = formatEther(balance);
    console.log(`Contract balance: ${formattedBalance} ETH`);
    balanceDisplay.textContent = `Balance: ${formattedBalance} ETH`;
  } catch (error) {
    console.error("Error getting balance:", error);
    balanceDisplay.textContent = "Error loading balance";
  }
}

async function fund(): Promise<void> {
  try {
    const ethAmount = ethAmountInp.value;
    if (!ethAmount || isNaN(Number(ethAmount))) {
      alert("Please enter a valid ETH amount");
      return;
    }

    console.log(`Transferring ${ethAmount} ETH...`);

    if (!(await initializeClients())) return;
    if (!walletClient || !publicClient)
      throw new Error("Clients not initialized");

    await walletClient.requestAddresses();
    const [connectedAccount] = await walletClient.getAddresses();
    if (!connectedAccount) throw new Error("No connected account found");

    const currentChain = await getCurrentChain(walletClient);

    const { request } = await publicClient.simulateContract({
      address: contractAddress as Address,
      abi: ABI,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmount),
    });

    const hash = await walletClient.writeContract(request);
    console.log("Funding transaction hash:", hash);
  } catch (error) {
    console.error("Funding error:", error);
    alert("Failed to fund contract");
  }
}

async function withdraw(): Promise<void> {
  try {
    console.log("Withdrawing funds...");

    if (!(await initializeClients())) return;
    if (!walletClient || !publicClient)
      throw new Error("Clients not initialized");

    await walletClient.requestAddresses();
    const [connectedAccount] = await walletClient.getAddresses();
    if (!connectedAccount) throw new Error("No connected account found");

    const currentChain = await getCurrentChain(walletClient);

    const { request } = await publicClient.simulateContract({
      address: contractAddress as Address,
      abi: ABI,
      functionName: "withdraw",
      account: connectedAccount,
      chain: currentChain,
    });

    const hash = await walletClient.writeContract(request);
    console.log("Withdrawal transaction hash:", hash);
  } catch (error) {
    console.error("Withdrawal error:", error);
    alert("Failed to withdraw funds");
  }
}

async function getCurrentChain(
  client: WalletClient
): Promise<ReturnType<typeof defineChain>> {
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

// Event Listeners
connectBtn.addEventListener("click", connect);
balanceBtn.addEventListener("click", getBalance);
fundBtn.addEventListener("click", fund);
withdrawBtn.addEventListener("click", withdraw);
