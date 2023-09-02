import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { IconFunctions, IconParameters, IconRoles, IconSettings } from "./icons/svg_icons";

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
};

function CompNavLinkWrap(props: PropsWithChildren<NavLinkProp>) {
	return (
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
			{props.children}
		</Link>
	);
}

// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
	const pathname = usePathname();

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
						Actions
					</h2>
					<div className="space-y-1">
						<CompNavLinkWrap navLink="/" currentPath={pathname}>
							<IconFunctions />
							Functions
						</CompNavLinkWrap>
						<CompNavLinkWrap
							navLink="/parameters"
							currentPath={pathname}
						>
							<IconParameters />
							Parameters
						</CompNavLinkWrap>
						<Button
							variant="ghost"
							className="w-full justify-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Layer_1"
								data-name="Layer 1"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="mr-2 h-4 w-4"
							>
								<path d="M20,12a3.994,3.994,0,0,0-3.172,1.566l-.07-.03a5,5,0,0,0-6.009-6.377l-.091-.172A3.995,3.995,0,1,0,8.879,7.9l.073.137a4.992,4.992,0,0,0-1.134,6.7L5.933,16.5a4,4,0,1,0,1.455,1.377l1.838-1.718a4.993,4.993,0,0,0,6.539-.871l.279.119A4,4,0,1,0,20,12ZM6,4A2,2,0,1,1,8,6,2,2,0,0,1,6,4ZM4,22a2,2,0,1,1,2-2A2,2,0,0,1,4,22Zm8-7a3,3,0,0,1-1.6-5.534l.407-.217A3,3,0,1,1,12,15Zm8,3a2,2,0,1,1,2-2A2,2,0,0,1,20,18Z" />
							</svg>
							Modify
						</Button>
					</div>
				</div>
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
						Configurations
					</h2>
					<div className="space-y-1">
						<CompNavLinkWrap
							navLink="settings"
							currentPath={pathname}
						>
							<IconSettings />
							Settings
						</CompNavLinkWrap>
						<CompNavLinkWrap navLink="roles" currentPath={pathname}>
							<IconRoles/>
							Roles
						</CompNavLinkWrap>
						<Button
							variant="ghost"
							className="w-full justify-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2 h-4 w-4"
							>
								<path d="m16 6 4 14" />
								<path d="M12 6v14" />
								<path d="M8 8v12" />
								<path d="M4 4v16" />
							</svg>
							Report
						</Button>
					</div>
				</div>
				<div className="py-2">
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
				</div>
			</div>
		</div>
	);
}
