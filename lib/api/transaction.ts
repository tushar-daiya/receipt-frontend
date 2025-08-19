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
