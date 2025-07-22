const receiptsEndpoints = {
  base: "/receipts",
  get:(id:string)=> `/receipts/${id}`,
  presignedUrl: "/receipts/presigned-url",
};

export const apiEndpoints = {
  receiptsEndpoints,
};
