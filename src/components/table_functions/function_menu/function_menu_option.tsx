import { type LucideIcon } from "lucide-react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

interface FunctionMenuOptionProps {
	onClick: () => void;
	itemName: string;
	icon: LucideIcon;
}

export function FunctionMenuOption({
	onClick,
	itemName,
	icon: Icon,
}: FunctionMenuOptionProps) {
	return (
		<div className="w-full" onClick={onClick}>
			<DropdownMenuItem className="cursor-pointer">
				<Icon className="mr-2 h-4 w-4" />
				<span>{itemName}</span>
			</DropdownMenuItem>
		</div>
	);
}

/* () => { */
/* 				setMode(props.mode); */
/* 				setOpen(true); */
/* 			} */


/* <CompTriggerItem */
/*   mode={"excel_download"} */
/*   itemName={t("button.excel_download")} */
/*   icon={Download} */
/* /> */
/* <CompTriggerItem */
/*   mode={"excel_upload"} */
/*   itemName={t("button.excel_upload")} */
/*   icon={Upload} */
/* /> */
/* <CompTriggerItem */
/*   mode={"initialize"} */
/*   itemName={t("button.initialize")} */
/*   icon={RefreshCcw} */
/* /> */
/* {autoCalculateFunction && ( */
/*   <CompTriggerItem */
/*     mode={"auto_calculate"} */
/*     itemName={t("button.auto_calculate")} */
/*     icon={Calculator} */
/*   /> */
/* )} */


