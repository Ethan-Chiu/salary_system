import Head from "next/head";
import type { PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";

type TitleProp = {
	title: string;
	option: boolean; 
};

export const Title = (props: PropsWithChildren<TitleProp>, br=true) => {
	return (
		<>
			<div className="my-4 flex">
				<h2 className="text-2xl font-semibold tracking-tight">
					{props.title.charAt(0).toUpperCase() +
						props.title.slice(1).toLowerCase()}
				</h2>
				{
					(props.option) ?
					<div className="align-bot ml-auto flex items-center space-x-1">
						<ThemeSelector />
						<UserAvatar />
					</div> : <></>
				}
			</div>
			<Separator />
			{ (br)?<br/>:<></> }
		</>
	);
};
