import { authClient } from "../auth-client";
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

export function getReceipt({
  params,
  id,
}: {
  params: Record<string, string>;
  id: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return useApiRequest({
    endpoint: apiEndpoints.receiptsEndpoints.get(id),
    queryKey: ["receipts", "get", id],
    params,
  });
}

export function getPresignedUrl({
  params,
}: {
  params: Record<string, string>;
}) {
  return useApiRequest({
    endpoint: apiEndpoints.receiptsEndpoints.presignedUrl,
    queryKey: ["receipts", "presigned-url"],
    params,
    method: "POST",
  });
}

export function createReceipt({ params }: { params: Record<string, string> }) {
  const cookies = authClient.getCookie();
  return useApiRequest({
    endpoint: apiEndpoints.receiptsEndpoints.base,
    queryKey: ["receipts", "create"],
    params,
    invalidateKeys: [{ queryKey: ["receipts", "list"], exact: false }],
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies,
    },
  });
}
