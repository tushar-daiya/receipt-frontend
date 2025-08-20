const receiptsEndpoints = {
  base: "/receipts",
  get: (id: string) => `/receipts/${id}`,
  presignedUrl: "/receipts/presigned-url",
};

const walletEndpoints = {
  base: "/wallet/",
};

const transactionsEndpoints = {
  base: "/transactions/",
  get: (wallet_address: string) => `/transactions/${wallet_address}`,
};
export const apiEndpoints = {
  receiptsEndpoints,
  walletEndpoints,
  transactionsEndpoints,
};
