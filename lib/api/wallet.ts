import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../auth-client";
import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useCreateWallet() {
  const queryClient = useQueryClient();
  const cookies = authClient.getCookie();
  return useApiRequest({
    method: "POST",
    endpoint: apiEndpoints.walletEndpoints.base,
    queryKey: ["wallet", "create"],
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet", "update"],
        exact: false,
      });
    },
  });
}

export function useGetWalletConnection() {
  const cookies = authClient.getCookie();
  return useQuery({
    queryKey: ["wallet", "connection"],
    queryFn: async () => {
      const response = await fetch(apiEndpoints.walletEndpoints.base, {
        headers: {
          Cookie: cookies,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch wallet connection");
      }
      return response.json();
    },
  });
}
