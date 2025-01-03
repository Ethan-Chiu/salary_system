import React from "react";

export function createTableFunctionContext<TMode>(initialMode: TMode) {
	return React.createContext<{
		mode: TMode;
		setMode: (mode: TMode) => void;
		open: boolean;
		setOpen: (open: boolean) => void;
		data: any;
		setData: (data: any) => void;
	}>({
		mode: initialMode,
		setMode: (_: TMode) => undefined,
		open: false,
		setOpen: (_: boolean) => undefined,
		data: null,
		setData: (_: any) => undefined,
	});
}
