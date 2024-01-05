import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";
import {
	CalendarRange,
	GanttChartSquare,
	LayoutGrid,
	LucideIcon,
	LucideSettings,
	LucideShieldCheck,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
} from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";

export type Playlist = (typeof playlists)[number];

export const playlists = [
	"Total expense",
	"Employee",
	"History",
	"Table 1",
	"Table 2",
	"Table 3",
	"Table 4",
	"Table 5",
];

type NavLinkProp = {
	navLink: string;
	currentPath: string;
	icon: LucideIcon;
	collapsed: boolean;
};

function CompNavLinkWrap(props: PropsWithChildren<NavLinkProp>) {
	return props.collapsed ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						key={props.navLink}
						href={props.navLink}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							props.currentPath === props.navLink
								? "bg-muted hover:bg-muted"
								: "",
							"w-full justify-start"
						)}
					>
						<props.icon className="h-4 w-4" />
						<TooltipContent>{props.children}</TooltipContent>
					</Link>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	) : (
		<Link
			key={props.navLink}
			href={props.navLink}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				props.currentPath === props.navLink
					? "bg-muted hover:bg-muted"
					: "",
				"w-full justify-start"
			)}
		>
			<props.icon className="h-4 w-4" />
			<p className="ps-2">{props.children}</p>
		</Link>
	);
}

interface SidebarProp extends React.HTMLAttributes<HTMLDivElement> {
	isCollapsed: boolean;
}

type NavLinkEntry = {
	title: string;
	icon: LucideIcon;
	url: string;
};

const actionLinks: NavLinkEntry[] = [
	{
		title: "Functions",
		icon: LayoutGrid,
		url: "/functions",
	},
	{
		title: "Parameters",
		icon: SlidersHorizontal,
		url: "/parameters",
	},
	{
		title: "Modify",
		icon: CalendarRange,
		url: "/modify",
	},
];

// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function Sidebar({ className, isCollapsed }: SidebarProp) {
	const pathname = usePathname();

	const { isLoading, isError, data, error } =
		api.access.accessByRole.useQuery();

	if (isLoading) {
		return <></>;
	}

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-2 py-4">
				{data?.actions && (
					<div className={cn("py-2", !isCollapsed && "px-3")}>
						{!isCollapsed && (
							<h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
								Actions
							</h2>
						)}
						<div className="space-y-1">
							{actionLinks.map((link) => (
								<CompNavLinkWrap
									key={link.title}
									navLink={link.url}
									currentPath={pathname}
									icon={link.icon}
									collapsed={isCollapsed}
								>
									{link.title}
								</CompNavLinkWrap>
							))}
						</div>
					</div>
				)}
				{isCollapsed && <Separator />}
				<div className={cn("py-2", !isCollapsed && "px-3")}>
					{!isCollapsed && (
						<h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
							Configurations
						</h2>
					)}
					<div className="space-y-1">
						{data?.settings && (
							<CompNavLinkWrap
								navLink="settings"
								currentPath={pathname}
								icon={Settings}
								collapsed={isCollapsed}
							>
								Settings
							</CompNavLinkWrap>
						)}
						{data?.roles && (
							<CompNavLinkWrap
								navLink="roles"
								currentPath={pathname}
								icon={ShieldCheck}
								collapsed={isCollapsed}
							>
								Roles
							</CompNavLinkWrap>
						)}
						<CompNavLinkWrap
							navLink=""
							currentPath={pathname}
							icon={GanttChartSquare}
							collapsed={isCollapsed}
						>
							Report
						</CompNavLinkWrap>
					</div>
				</div>
				{/* <div className="py-2">
					<h2 className="relative px-7 text-lg font-semibold tracking-tight">
						Statistics
					</h2>
					<ScrollArea className="h-[300px] px-1">
						<div className="space-y-1 p-2">
							{playlists?.map((playlist, i) => (
								<Button
									key={`${playlist}-${i}`}
									variant="ghost"
									className="w-full justify-start font-normal"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										id="Layer_1"
										data-name="Layer 1"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="mr-2 h-4 w-4"
									>
										<path d="M12,0c-1.65,0-3,1.35-3,3V21c0,1.65,1.35,3,3,3s3-1.35,3-3V3c0-1.65-1.35-3-3-3Zm1,21c0,.55-.45,1-1,1s-1-.45-1-1V3c0-.55,.45-1,1-1s1,.45,1,1V21ZM21,6c-1.65,0-3,1.35-3,3v12c0,1.65,1.35,3,3,3s3-1.35,3-3V9c0-1.65-1.35-3-3-3Zm1,15c0,.55-.45,1-1,1s-1-.45-1-1V9c0-.55,.45-1,1-1s1,.45,1,1v12ZM3,12c-1.65,0-3,1.35-3,3v6c0,1.65,1.35,3,3,3s3-1.35,3-3v-6c0-1.65-1.35-3-3-3Zm1,9c0,.55-.45,1-1,1s-1-.45-1-1v-6c0-.55,.45-1,1-1s1,.45,1,1v6Z" />
									</svg>
									{playlist}
								</Button>
							))}
						</div>
					</ScrollArea>
				</div> */}
			</div>
		</div>
	);
}
