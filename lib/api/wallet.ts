import { useQueryClient } from "@tanstack/react-query";
import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useCreateWallet() {
  const queryClient = useQueryClient();
  return useApiRequest({
    method: "POST",
    endpoint: apiEndpoints.walletEndpoints.base,
    queryKey: ["wallet", "create"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet", "update"],
        exact: false,
      });
    },
  });
}
