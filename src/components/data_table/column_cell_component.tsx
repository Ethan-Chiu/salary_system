import { type PropsWithChildren } from "react";

interface ColumnCellComponentProps extends PropsWithChildren {}

export function ColumnCellComponent({
	children,
}: ColumnCellComponentProps) {
	return <div className="text-center font-medium">{children}</div>;
}
