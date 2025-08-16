import { useQueryClient } from "@tanstack/react-query";
import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useApiRequest({
    method: "POST",
    endpoint: apiEndpoints.transactionsEndpoints.base,
    queryKey: ["transactions", "create"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "update"],
        exact: false,
      });
    },
  });
}


