# Wallet Context System

This document explains how to use the centralized wallet context system for managing wallet connections across the application.

## Overview

The wallet context system provides a centralized way to manage wallet connections, including both regular wallets (MetaMask, WalletConnect) and Abstract wallets. This eliminates code duplication and provides a consistent interface across all components.

## Components

### 1. WalletContext (`src/contexts/WalletContext.tsx`)

The main context that provides:

- Connection state management
- Wallet connection/disconnection methods
- UI state management (button labels)
- Account information

### 2. useWalletOperations Hook (`src/hooks/useWalletOperations.ts`)

A utility hook that provides common wallet operations:

- Staking operations
- Unstaking operations
- Claiming operations
- Button label management

## Usage

### Basic Usage

```tsx
import { useWallet } from "@/contexts/WalletContext";

const MyComponent = () => {
  const { isConnected, connectWallet, connectWalletLabel, address } =
    useWallet();

  return <button onClick={connectWallet}>{connectWalletLabel}</button>;
};
```

### Advanced Usage with Operations

```tsx
import { useWalletOperations } from "@/hooks/useWalletOperations";

const VaultComponent = () => {
  const { handleStake, handleUnstake, handleClaim, updateButtonLabel } =
    useWalletOperations();

  const handleStakeClick = () => {
    updateButtonLabel("stake");
    handleStake();
  };

  return (
    <div>
      <button onClick={handleStakeClick}>Stake</button>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaim}>Claim</button>
    </div>
  );
};
```

## Available Methods

### From useWallet()

- `isConnected`: Boolean indicating if wallet is connected
- `isConnecting`: Boolean indicating if connection is in progress
- `connectWallet()`: Connect/disconnect regular wallets
- `connectAbstractWallet()`: Connect Abstract wallet specifically
- `disconnectWallet()`: Disconnect all wallets
- `connectWalletLabel`: Global button label (for navbar only)
- `setConnectWalletLabel()`: Update global button label
- `address`: Connected wallet address
- `isMounted`: Boolean for hydration state

### From useWalletOperations()

- `handleStake()`: Handle staking with wallet check
- `handleUnstake()`: Handle unstaking with wallet check
- `handleClaim()`: Handle claiming with wallet check

## Setup

The WalletProvider is already set up in `src/app/layout.tsx`:

```tsx
<AbstractWalletProviderClient>
  <WalletProvider>{children}</WalletProvider>
</AbstractWalletProviderClient>
```

## Benefits

1. **Centralized Logic**: All wallet operations are managed in one place
2. **Smart Label Management**: Navbar shows "CONNECT WALLET"/"DISCONNECT WALLET", components manage their own labels
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Extensible**: Easy to add new wallet operations
5. **No Duplication**: Eliminates repeated wallet connection code

## Adding New Operations

To add new wallet operations:

1. Add the operation to `useWalletOperations.ts`
2. Use the hook in your component
3. The operation will automatically handle wallet connection checks

Example:

```tsx
// In useWalletOperations.ts
const handleTransfer = () => {
  if (!isConnected) {
    connectWallet();
    return;
  }
  // Add transfer logic here
};

// In your component
const { handleTransfer } = useWalletOperations();
```
