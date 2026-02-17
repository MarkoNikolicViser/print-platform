'use client';

import { FileInfo } from '@/types';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type SelectedTemplate = {
  id: number;
  allowedOptions: any;
};

type PrintContextType = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  selectedTemplate: SelectedTemplate | null;
  setSelectedTemplate: Dispatch<SetStateAction<SelectedTemplate | null>>;
  printConfig: any;
  setPrintConfig: any;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  fileInfo: FileInfo | null;
  setFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
  uploadedUrl: string | null;
  setUploadedUrl: Dispatch<SetStateAction<string | null>>;
  previewOpen: boolean;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
  selectedShop: number | null;
  setSelectedShop: Dispatch<SetStateAction<number | null>>;
};

// Create the context with default undefined
const PrintContext = createContext<PrintContextType | undefined>(undefined);

// Provider component
export function PrintProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [printConfig, setPrintConfig] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [done, setDone] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);

  return (
    <PrintContext.Provider
      value={{
        file,
        setFile,
        selectedTemplate,
        setSelectedTemplate,
        printConfig,
        setPrintConfig,
        quantity,
        setQuantity,
        fileInfo,
        setFileInfo,
        done,
        setDone,
        uploadedUrl,
        setUploadedUrl,
        previewOpen,
        setPreviewOpen,
        selectedShop,
        setSelectedShop
      }}
    >
      {children}
    </PrintContext.Provider>
  );
}

// Custom hook for consuming context
export function usePrintContext() {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrintContext must be used within a PrintProvider');
  }
  return context;
}
