import { BACKEND_API_URL } from "@/constants/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../auth-client";
import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

type UseGetTransactionOptions = {
  enabled?: boolean;
};

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const cookies = authClient.getCookie();

  return useApiRequest({
    method: "POST",
    endpoint: apiEndpoints.transactionsEndpoints.base,
    queryKey: ["transactions", "create"],
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "update"],
        exact: false,
      });
    },
  });
}

export function useGetTransaction({
  params,
  options,
}: {
  params: Record<string, string>;
  options?: UseGetTransactionOptions;
}) {
  const queryClient = useQueryClient();
  const cookies = authClient.getCookie();

  return useQuery({
    queryKey: ["transactions", "get", params.wallet_address],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_API_URL}/transaction/${params.wallet_address}`,
        {
          headers: { Cookie: cookies },
        }
      );
      console.log("Fetching transaction data for:", params.wallet_address);
      console.log("Response status:", res);

      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      if (!data) {
        throw new Error("No transaction data found");
      }
      console.log("Transaction data:", data);
      return data.trxnResponse;
    },
    enabled: options?.enabled ?? true,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "list"],
        exact: false,
      });
    },
  });
}
