import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listReceipts({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.receiptsEndpoints.base,
    queryKey: ["receipts", "list", queryParams],
    params,
  });
}
