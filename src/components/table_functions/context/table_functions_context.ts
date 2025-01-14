import React, { useState } from "react";

export function createTableFunctionContext<TMode, TData>() {
	return React.createContext<{
		mode: TMode;
		setMode: (mode: TMode) => void;
		open: boolean;
		setOpen: (open: boolean) => void;
		data: TData | null;
		setData: (data: TData) => void;
	} | null>(null);
}

export function useTableFunctionState<TMode, TData>(initialMode: TMode) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<TMode>(initialMode);
	const [data, setData] = useState<TData | null>(null);

	return { open, setOpen, mode, setMode, data, setData };
}
