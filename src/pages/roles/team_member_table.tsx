import { CalendarDays } from "lucide-react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { RootLayout } from "~/components/layout/root_layout";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

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
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
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
import { useState, type ReactElement } from "react";

type IdentityType = {
	identity: string;
	description: string;
};
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


type EmployeeInfo = {
	emp_no: string;
	username: string;
	role?: string;
	userEmail?: string;
	description?: string;
	avatarImgSource?: string;
};

export function TeamMemberTable() {
	return <CompRoleDropdown />;
}

function CompRoleDropdown() {
	const [open, setOpen] = useState(false);
	const data: EmployeeInfo[] = [
		{
			emp_no: "B09901060",
			username: "Pony",
			role: "Viewer",
			userEmail: "Test1",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901058",
			username: "Ethan",
			role: "Viewer",
			userEmail: "Test2",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901149",
			username: "Howard",
			role: "Viewer",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901052",
			username: "Max",
			role: "Viewer",
			userEmail: "Test4",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
	];

	const getUserInfo = (info: EmployeeInfo, side: "top" | "bottom" | "left" | "right") => {
		return (
			<HoverCard>
				<HoverCardTrigger asChild>
					<div className="flex items-center justify-start space-x-4">
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
							<p className="text-sm font-medium leading-none">
								{info.username}
							</p>
							<p className="text-sm text-muted-foreground">
								{info.role}
							</p>
						</div>
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="h-full w-full" side={side}>
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
							<p className="text-sm">{info.role}</p>
							{/* <div className="flex items-center pt-2">
								<CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
								<span className="text-xs text-muted-foreground">
									Joined December 2021
								</span>
							</div> */}
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
		);
	};

	return (
		<>
			<Button
				variant={"outline"}
				onClick={() => setOpen(true)}
				className="item-center m-5 w-[90%]"
			>
				Modify
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Employees">
						<CommandItem value="-" className="hidden" />
						{data.map((emp: EmployeeInfo, index: number) => {
							return (
								<CommandItem
									key={emp.emp_no + index.toString()}
									className={
										"teamaspace-y-1 flex cursor-pointer flex-col items-start px-4 py-2"
									}
								>
									{getUserInfo(emp, "right")}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}


export function SelectRole() {
	
	return (
		<Select>
			<SelectTrigger className="">
				<SelectValue placeholder="Select a Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Access</SelectLabel>
					{identitylist.map((identity) => {
						return (
							<SelectItem
								value={identity.identity}
								className="cursor-pointer"
								title={identity.description}
							>
								{identity.identity}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function CompHoverCard({ info }: { info: EmployeeInfo }) {
	return (
		<div className="flex items-center">
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
				<HoverCardContent className="h-full w-full">
					<div className="flex w-80 justify-between space-x-4">
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
		</div>
	);
}
