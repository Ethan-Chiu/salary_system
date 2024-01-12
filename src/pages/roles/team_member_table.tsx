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

import { type NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useSession } from "next-auth/react";

type EmployeeInfo = {
	emp_no: string;
	username: string;
	userEmail?: string;
	description?: string;
	avatarImgSource?: string;
};

export function TeamMemberTable() {
	const data: EmployeeInfo[] = [
		{
			emp_no: "TEST1",
			username: "Test1",
			userEmail: "Test1",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "TEST2",
			username: "Test2",
			userEmail: "Test2",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "TEST3",
			username: "Test3",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
	];

	return <CompRoleDropdown />;
}

function CompRoleDropdown() {
	const [open, setOpen] = useState(false);
	const data: EmployeeInfo[] = [
		{
			emp_no: "B09901060",
			username: "Pony",
			userEmail: "Test1",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901058",
			username: "Ethan",
			userEmail: "Test2",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901149",
			username: "Howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "B09901052",
			username: "Max",
			userEmail: "Test4",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
	];

	const getUserInfo = (info: EmployeeInfo) => {
		return (
			<HoverCard>
				<HoverCardTrigger asChild>
					<div className="w-full">
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
								{info.userEmail}
							</p>
						</div>
					</div>
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
									{getUserInfo(emp)}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}

type IdentityType = {
	identity: string;
	description: string;
};
export function SelectRole() {
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
