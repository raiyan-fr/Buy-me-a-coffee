# ☕ Buy Me a Coffee (Web3 Edition)

[![Built with Viem](https://img.shields.io/badge/Built_with-Viem-4B72C1)](https://viem.sh)
[![Built with Foundry](https://img.shields.io/badge/Built_with-Foundry-F76808)](https://getfoundry.sh)
[![Vite](https://img.shields.io/badge/Vite-^4.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

A decentralized application that allows supporters to send ETH tips ("coffees") to content creators.

![image](https://github.com/user-attachments/assets/d8d346b4-d0a2-496b-881c-9aea73e91222)
 
## 🚀 Features

- Connect wallet via MetaMask
- View smart contract balance
- Send ETH tips to support the creator
- Withdraw collected tips securely
- Beautiful, responsive frontend
- Built using **TypeScript**, **Viem**, and **HTML/CSS**

---

## 📦 Tech Stack

- **Frontend:** HTML, CSS (with gradients and subtle animations), TypeScript
- **Blockchain Interaction:** [Viem](https://viem.sh/) (modern alternative to Ethers.js and more suitable with Types)
- **Smart Contract:** Solidity (assumed to be deployed separately)
- **Network:** Localhost (`Foundry`) or any Ethereum-compatible chain

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/buy-me-a-coffee.git
cd buy-me-a-coffee
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm add viem
pnpm add vite
pnpm add foundry
```
Now restart the terminal and open 2 seperate terminal and run:
```bash
anvil --load-state fundme-anvil.json
```
```bash
pnpm vite
```

## 🔐 Security Notes

- Ensure the `withdraw()` function is restricted to only the owner using `msg.sender`.
- Always test thoroughly on testnets before deploying to mainnet.
- Use a `.env` file for managing sensitive private keys and RPC URLs during deployment.

---

## Author
- [@raiyan-fr](https://www.github.com/raiyan-fr)

