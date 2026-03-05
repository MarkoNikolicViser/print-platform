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
};
export type PrintableFile = {
  id: string;
  file: File;
  url: string;
  type: string;
  pages?: number;
  quantity: number;
  printConfig: any;
  selectedTemplate: SelectedTemplate | null;
  status: 'uploading' | 'done' | 'error';
};

type PrintContextType = {
  files: PrintableFile[];
  setFiles: Dispatch<SetStateAction<PrintableFile[]>>;
  previewFileId: string | null;
  setPreviewFileId: Dispatch<SetStateAction<string | null>>;
  updateFileConfig: (id: string, data: Partial<PrintableFile>) => void;
  removeFile: (id: string) => void;
  setSelectedTemplate: (fileId: string, template: SelectedTemplate) => void;

  selectedShop: CopyShop | null;
  setSelectedShop: Dispatch<SetStateAction<CopyShop | null>>;
};

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export function PrintProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<PrintableFile[]>([]);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<CopyShop | null>(null);

  const updateFileConfig = (id: string, data: Partial<PrintableFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f)),
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (previewFileId === id) setPreviewFileId(null);
  };

  const setSelectedTemplate = (fileId: string, template: SelectedTemplate) => {
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