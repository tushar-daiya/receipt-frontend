const receiptsEndpoints = {
  base: "/receipts",
  get: (id: string) => `/receipts/${id}`,
  presignedUrl: "/receipts/presigned-url",
};

const walletEndpoints = {
  base: "/wallet/",
};

export const apiEndpoints = {
  receiptsEndpoints,
  walletEndpoints,
};
