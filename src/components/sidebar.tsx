import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	// items: {
	// 	href: string
	// 	title: string
	//   }[]
}

// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
						Actions
					</h2>
					<div className="space-y-1">
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
								<rect width="7" height="7" x="3" y="3" rx="1" />
								<rect
									width="7"
									height="7"
									x="14"
									y="3"
									rx="1"
								/>
								<rect
									width="7"
									height="7"
									x="14"
									y="14"
									rx="1"
								/>
								<rect
									width="7"
									height="7"
									x="3"
									y="14"
									rx="1"
								/>
							</svg>
							Functions
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Outline"
								viewBox="0 0 24 24"
								className="mr-2 h-4 w-4"
							>
								<path d="M1,4.75H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2ZM7.333,2a1.75,1.75,0,1,1-1.75,1.75A1.752,1.752,0,0,1,7.333,2Z" />
								<path d="M23,11H20.264a3.727,3.727,0,0,0-7.194,0H1a1,1,0,0,0,0,2H13.07a3.727,3.727,0,0,0,7.194,0H23a1,1,0,0,0,0-2Zm-6.333,2.75A1.75,1.75,0,1,1,18.417,12,1.752,1.752,0,0,1,16.667,13.75Z" />
								<path d="M23,19.25H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2ZM7.333,22a1.75,1.75,0,1,1,1.75-1.75A1.753,1.753,0,0,1,7.333,22Z" />
							</svg>
							Parameters
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Layer_1"
								data-name="Layer 1"
								viewBox="0 0 24 24"
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
					<Link
							key={"/settings"}
							href={"/settings"}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								pathname === "/settings"
									? "bg-muted hover:bg-muted"
									: "",
								"justify-start w-full"
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Outline"
								viewBox="0 0 24 24"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2 h-4 w-4"
							>
								<path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
								<path d="M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z" />
							</svg>
							Settings
						</Link>
						<Button
							variant="ghost"
							className="w-full justify-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Outline"
								viewBox="0 0 24 24"
								className="mr-2 h-4 w-4"
							>
								<path d="M18.581,2.14,12.316.051a1,1,0,0,0-.632,0L5.419,2.14A4.993,4.993,0,0,0,2,6.883V12c0,7.563,9.2,11.74,9.594,11.914a1,1,0,0,0,.812,0C12.8,23.74,22,19.563,22,12V6.883A4.993,4.993,0,0,0,18.581,2.14ZM20,12c0,5.455-6.319,9.033-8,9.889-1.683-.853-8-4.42-8-9.889V6.883A3,3,0,0,1,6.052,4.037L12,2.054l5.948,1.983A3,3,0,0,1,20,6.883Z" />
								<path d="M15.3,8.3,11.112,12.5,8.868,10.16a1,1,0,1,0-1.441,1.386l2.306,2.4a1.872,1.872,0,0,0,1.345.6h.033a1.873,1.873,0,0,0,1.335-.553l4.272-4.272A1,1,0,0,0,15.3,8.3Z" />
							</svg>
							Roles
						</Button>
						{/* <Button
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
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
							Profile
						</Button> */}
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
