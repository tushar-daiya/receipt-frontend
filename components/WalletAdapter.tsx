import { useCreateWallet } from "@/lib/api/wallet";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

export const WalletConnectionHandler = () => {
  const { isConnected, address } = useAccount();
  const { mutate: createWallet, isPending } = useCreateWallet();

  const processedAddressRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      isConnected &&
      address &&
      !isPending &&
      address !== processedAddressRef.current
    ) {
      if (createWallet) {
        createWallet({ wallet_address: address });
        processedAddressRef.current = address;
      }
    }

    if (!isConnected) {
      processedAddressRef.current = undefined;
    }
  }, [isConnected, address, isPending, createWallet]);

  return null;
};
