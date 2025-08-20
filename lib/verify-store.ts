import { create } from "zustand";

export interface ReceiptFormData {
  // Step 1: Receipt Details (all 4 fields on first page)
  amount: string;
  vendor: string;
  date: Date;
  category: string;

  // Step 2: Confirmation (calculated fields)
  transactionFee: string;
  totalAmount: string;

  // Step 3: Image Upload Method
  imageUploadMethod: "camera" | "gallery";

  // Step 4: Image Upload
  imageUri: string;
  receiptId: string | null;
  wallet_address: string | null;
}

interface ReceiptStore {
  currentStep: number;
  formData: ReceiptFormData;
  errors: Record<string, string>;

  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<ReceiptFormData>) => void;
  setReceiptId: (id: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  resetForm: () => void;
  getTotalSteps: () => number;
  getProgress: () => number;
  getWalletAddress: () => string | null;
  setWalletAddress: (address: string | null) => void;
  calculateTransactionFee: () => void;
}

const initialFormData: ReceiptFormData = {
  amount: "",
  vendor: "",
  date: new Date(),
  category: "",
  transactionFee: "",
  totalAmount: "",
  imageUploadMethod: "camera",
  imageUri: "",
  receiptId: null,
  wallet_address: "",
};

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  errors: {},

  setReceiptId: (id: string) =>
    set((state) => ({
      formData: { ...state.formData, receiptId: id },
    })),
  setWalletAddress: (address: string | null) =>
    set((state) => ({
      formData: { ...state.formData, wallet_address: address },
    })),
  getWalletAddress: () => get().formData.wallet_address,

  setCurrentStep: (step: number) => set({ currentStep: step }),

  updateFormData: (data: Partial<ReceiptFormData>) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setErrors: (errors: Record<string, string>) => set({ errors }),

  clearErrors: () => set({ errors: {} }),

  resetForm: () =>
    set({
      formData: initialFormData,
      errors: {},
      currentStep: 1,
    }),

  getTotalSteps: () => 5,

  getProgress: () => {
    const { currentStep } = get();
    const totalSteps = get().getTotalSteps();
    return (currentStep / totalSteps) * 100;
  },

  calculateTransactionFee: () => {
    const { formData } = get();
    const amount = parseFloat(formData.amount) || 0;
    const transactionFee = amount * 0.05; // 5% fee
    const totalAmount = amount + transactionFee;

    set((state) => ({
      formData: {
        ...state.formData,
        transactionFee: transactionFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      },
    }));
  },
}));
