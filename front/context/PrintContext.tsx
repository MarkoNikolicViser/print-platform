'use client';

import { CopyShop } from '@/types';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

export type SelectedTemplate = {
  id: number;
  allowedOptions: any;
  supportedMime: string[]
  is_disabled: boolean
  description: string,
  supported_mime: string
};
export type PrintableFile = {
  id: number | string;
  file: File;
  url?: string;
  type: string;
  pages?: number;
  error?: string
  quantity: number;
  printConfig: any;
  selectedTemplate: SelectedTemplate | null;
  status: 'uploading' | 'done' | 'error';
};

type PrintContextType = {
  files: PrintableFile[];
  setFiles: Dispatch<SetStateAction<PrintableFile[]>>;
  previewFileId: number | null | string;
  setPreviewFileId: Dispatch<SetStateAction<number | null | string>>;
  updateFileConfig: (id: number | string, data: Partial<PrintableFile>) => void;
  removeFile: (id: number | string) => void;
  setSelectedTemplate: (fileId: number | string, template: SelectedTemplate) => void;

  selectedShop: CopyShop | null;
  setSelectedShop: Dispatch<SetStateAction<CopyShop | null>>;
};

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export function PrintProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<PrintableFile[]>([]);
  const [previewFileId, setPreviewFileId] = useState<number | null | string>(null);
  const [selectedShop, setSelectedShop] = useState<CopyShop | null>(null);

  const updateFileConfig = (id: number | string, data: Partial<PrintableFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f)),
    );
  };

  const removeFile = (id: number | string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (previewFileId === id) setPreviewFileId(null);
  };

  const setSelectedTemplate = (fileId: number | string, template: SelectedTemplate) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, selectedTemplate: template } : f,
      ),
    );
  };

  return (
    <PrintContext.Provider
      value={{
        files,
        setFiles,
        previewFileId,
        setPreviewFileId,
        updateFileConfig,
        removeFile,
        setSelectedTemplate,
        selectedShop,
        setSelectedShop,
      }}
    >
      {children}
    </PrintContext.Provider>
  );
}

export function usePrintContext() {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrintContext must be used within a PrintProvider');
  }
  return context;
}