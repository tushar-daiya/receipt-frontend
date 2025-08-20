import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "../auth-client";
import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

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
}: {
  params: Record<string, string>;
}) {
  const queryClient = useQueryClient();
  const cookies = authClient.getCookie();
  return useApiRequest({
    endpoint: apiEndpoints.transactionsEndpoints.get(params.wallet_address),
    queryKey: ["transactions", "get", params.wallet_address],
    params,
    headers: {
      Cookie: cookies,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "list"],
        exact: false,
      });
    },
  });
}
