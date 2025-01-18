import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export function FunctionMenu({ children }: PropsWithChildren) {
	const { t } = useTranslation(["common", "nav"]);

	/* 	React.HTMLProps<HTMLElement> */
	/* const options = Children.toArray(children) as React.ReactElement< */
	/* >[]; */

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="ml-auto h-8 lg:flex"
				>
					<EllipsisVertical className="cursor-pointer stroke-[1.5]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
