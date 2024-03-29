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

import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useSession } from "next-auth/react";
import { TeamMemberTable } from "./team_member_table";

type EmployeeInfo = {
	username: string;
	userEmail: string;
	description: string;
	avatarImgSource: string;
};

type IdentityType = {
	identity: string;
	description: string;
};

const PageRoles: NextPageWithLayout = () => {
	return (
		<>
			{/* header */}
			<Header title="roles" showOptions />
			<CurrentUserCard />
			<div>
				<TeamMemberTable />
			</div>
		</>
	);
};

const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

function CurrentUserCard() {
	const { data: session, status } = useSession();

	const info: EmployeeInfo = {
		username: capitalizeFirstLetter(
			session?.user.emp_no ?? "Something went wrong"
		),
		userEmail: session?.user.email ?? "Email not set yet",
		description: "balabalabalabala balabalabala balabala",
		avatarImgSource: "https://github.com/shadcn.png",
	};

	return (
		<>
			<Card className="m-4">
				<CardHeader>
					<CardTitle>Administrator</CardTitle>
					<CardDescription>
						Modify the access rights for the employees.
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
								<CompHoverCard info={info} />
							</div>
						</div>
						<CompRoleDropdown />
					</div>
				</CardContent>
			</Card>
		</>
	);
}

function CompRoleDropdown() {
	const identitylist: IdentityType[] = [
		{
			identity: "Viewer",
			description: "Can view and comment.",
		},
		{
			identity: "Developer",
			description: "Can view, comment and edit.",
		},
		{
			identity: "Billing",
			description: "Can view, comment and manage billing.",
		},
		{
			identity: "Owner",
			description: "Admin-level access to all resources.",
		},
	];
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
							{identitylist.map((props: IdentityType) => (
								<CommandItem
									key={props.identity}
									className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
								>
									<p>{props.identity}</p>
									<p className="text-sm text-muted-foreground">
										{props.description}
									</p>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function CompHoverCard({ info }: { info: EmployeeInfo }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div>
					<p className="text-sm font-medium leading-none">
						{info.username}
					</p>
					<p className="text-sm text-muted-foreground">
						{info.userEmail}
					</p>
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
						<h4 className="text-sm font-semibold">
							{info.username}
						</h4>
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
			<PerpageLayoutNav pageTitle="roles">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageRoles;
