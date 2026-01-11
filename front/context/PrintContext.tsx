"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

type SelectedTemplate = {
    id: number;
    allowedOptions: any
}
type PrintContextType = {
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
    selectedTemplate: SelectedTemplate | null;
    setSelectedTemplate: Dispatch<SetStateAction<SelectedTemplate | null>>;
    printConfig: any;
    setPrintConfig: any;
};


// Create the context with default undefined
const PrintContext = createContext<PrintContextType | undefined>(undefined);

// Provider component
export function PrintProvider({ children }: { children: ReactNode }) {
    const [file, setFile] = useState<File | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
    const [printConfig, setPrintConfig] = useState(null);

    return (
        <PrintContext.Provider
            value={{ file, setFile, selectedTemplate, setSelectedTemplate, printConfig, setPrintConfig }}
        >
            {children}
        </PrintContext.Provider>
    );
}

// Custom hook for consuming context
export function usePrintContext() {
    const context = useContext(PrintContext);
    if (!context) {
        throw new Error("usePrintContext must be used within a PrintProvider");
    }
    return context;
}