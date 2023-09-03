import type { PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";

interface TitleProp extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	showOptions?: boolean; 
};

export const Header = (props: PropsWithChildren<TitleProp>) => {
	
	return (
		<div className={props.className}>
			<div className="my-4 flex">
				<h2 className="text-2xl font-semibold tracking-tight">
					{props.title.charAt(0).toUpperCase() +
						props.title.slice(1).toLowerCase()}
				</h2>
				{
					(props.showOptions) ?
					<div className="align-bot ml-auto flex items-center space-x-1">
						<ThemeSelector />
						<UserAvatar />
					</div> : <></>
				}
			</div>
			<Separator />
		</div>
	);
};
