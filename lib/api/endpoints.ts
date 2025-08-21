const receiptsEndpoints = {
  base: "/receipts",
  get: (id: string) => `/receipts/${id}`,
  presignedUrl: "/receipts/presigned-url",
};

const walletEndpoints = {
  base: "/wallet/",
};

const transactionsEndpoints = {
  base: "/transaction/",
  get: (wallet_address: string) => `/transaction/${wallet_address}`,
};
export const apiEndpoints = {
  receiptsEndpoints,
  walletEndpoints,
  transactionsEndpoints,
};
