import React from "react";

export function createTableFunctionContext<TMode, TData>(initialMode: TMode) {
	return React.createContext<{
		mode: TMode;
		setMode: (mode: TMode) => void;
		open: boolean;
		setOpen: (open: boolean) => void;
		data: TData | null;
		setData: (data: TData) => void;
	}>({
		mode: initialMode,
		setMode: (_: TMode) => undefined,
		open: false,
		setOpen: (_: boolean) => undefined,
		data: null,
		setData: (_: TData) => undefined,
	});
}
