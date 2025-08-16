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
  get: (id: string) => `/transactions/${id}`,
};
export const apiEndpoints = {
  receiptsEndpoints,
  walletEndpoints,
  transactionsEndpoints,
};
