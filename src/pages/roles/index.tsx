import { CalendarDays } from "lucide-react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { RootLayout } from "~/components/layout/root_layout";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";

import { Separator } from "~/components/ui/separator";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { PerpageLayout } from "~/components/layout/perpage_layout";

type EmployeeInfo = {
	username: string;
	userEmail: string;
	description: string;
	avatarImgSource: string;
}

const PageRoles: NextPageWithLayout = () => {
	const info: EmployeeInfo = {
		username: "Ethan Chiu",
		userEmail: "ethanchiu@gmail.com",
		description: "balabalabalabala balabalabala balabala",
		avatarImgSource: "https://github.com/shadcn.png"
	}

	return (
		<>
			{/* header */}
			<div className="my-4">
				<h2 className="text-2xl font-semibold tracking-tight">Roles</h2>
			</div>
			<Separator />
			<Card className="my-6">
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
					<CardDescription>
						Invite your team members to collaborate.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="flex items-center justify-between space-x-4">
						<div className="flex items-center space-x-4">
							<Avatar>
								<AvatarImage src={info.avatarImgSource} />
								<AvatarFallback>
									{info.username
										.split(" ")
										.map((eachWord: string) => {
											return eachWord[0];
										})
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<CompHoverCard info={info}/>
							</div>
						</div>
						<CompRoleDropdown />
					</div>
				</CardContent>
			</Card>
		</>
	);
};

function CompRoleDropdown() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="ml-auto">
					Owner{" "}
					<ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" align="end">
				<Command>
					<CommandInput placeholder="Select new role..." />
					<CommandList>
						<CommandEmpty>No roles found.</CommandEmpty>
						<CommandGroup>
							<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
								<p>Viewer</p>
								<p className="text-sm text-muted-foreground">
									Can view and comment.
								</p>
							</CommandItem>
							<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
								<p>Developer</p>
								<p className="text-sm text-muted-foreground">
									Can view, comment and edit.
								</p>
							</CommandItem>
							<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
								<p>Billing</p>
								<p className="text-sm text-muted-foreground">
									Can view, comment and manage billing.
								</p>
							</CommandItem>
							<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
								<p>Owner</p>
								<p className="text-sm text-muted-foreground">
									Admin-level access to all resources.
								</p>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function CompHoverCard({info}: {info: EmployeeInfo}) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div>
					<p className="text-sm font-medium leading-none">
						{info.username}
					</p>
					<p className="text-sm text-muted-foreground">{info.userEmail}</p>
				</div>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src={info.avatarImgSource} />
						<AvatarFallback>
							{info.username
								.split(" ")
								.map((eachWord: string) => {
									return eachWord[0];
								})
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">{info.username}</h4>
						<p className="text-sm">{info.description}</p>
						<div className="flex items-center pt-2">
							<CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
							<span className="text-xs text-muted-foreground">
								Joined December 2021
							</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

PageRoles.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayout pageTitle="roles">{page}</PerpageLayout>
		</RootLayout>
	);
};

export default PageRoles;
