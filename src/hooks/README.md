# Wallet Operations Hook

This hook provides common wallet operations with chain switching functionality.

## Features

- **Chain Switching**: Automatically switches to the correct chain before operations
- **Wallet Connection**: Handles wallet connection if not connected
- **Error Handling**: Graceful error handling for chain switching failures

## Usage

```tsx
import { useWalletOperations } from "@/hooks/useWalletOperations";

const MyComponent = () => {
  const { handleStake, handleUnstake, handleClaim, isOnCorrectChain } =
    useWalletOperations();

  return (
    <div>
      <button onClick={handleStake}>Stake</button>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaim}>Claim</button>

      {!isOnCorrectChain && <p>Please switch to the correct chain</p>}
    </div>
  );
};
```

## Available Methods

- `handleStake()`: Handles staking with chain switching
- `handleUnstake()`: Handles unstaking with chain switching
- `handleClaim()`: Handles claiming with chain switching
- `isOnCorrectChain`: Boolean indicating if user is on correct chain

## Chain Configuration

The target chain is configured in `src/config/chains.ts`:

```tsx
import { abstractTestnet } from "wagmi/chains";

export const TARGET_CHAIN = abstractTestnet;
```

## How It Works

1. **Check Connection**: If not connected, connects wallet
2. **Check Chain**: If on wrong chain, switches to target chain
3. **Execute Operation**: Performs the requested operation
4. **Error Handling**: Catches and logs any errors

## Environment Variables

You can configure the target chain using environment variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155420
```

Then update `src/config/chains.ts` to use the environment variable.
