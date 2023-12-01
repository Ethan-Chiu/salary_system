import { BankSettings } from "./Parameters"
import type { PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";

interface SelectProp extends React.HTMLAttributes<HTMLDivElement> {
	table_name: string
};

export const ParameterSetting = (props: PropsWithChildren<SelectProp>) => {
	if(props.table_name === "bank_setting")
        return <BankSettings />
	return (<></>);
};
