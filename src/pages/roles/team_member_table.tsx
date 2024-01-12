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
			emp_no: "TEST1",
			username: "pony",
			userEmail: "Test1",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "TEST2",
			username: "ethan",
			userEmail: "Test2",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
		{
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
        {
			emp_no: "TEST3",
			username: "howard",
			userEmail: "Test3",
			description: "balabalabalabala balabalabala balabala",
			avatarImgSource: "https://github.com/shadcn.png",
		},
	];
	return (
		<>
            <Button variant={"outline"} onClick={() => setOpen(true)}>Modify</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..."/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Employees">
                        {data.map((emp: EmployeeInfo, index: number) => {
                            return <CommandItem key={emp.emp_no+index.toString()} className={"teamaspace-y-1 flex flex-col items-start px-4 py-2"}>
                                <p>{emp.emp_no}</p>
                                <p className="text-sm text-muted-foreground">
                                    {emp.username}
                                </p>
                            </CommandItem>
                        })}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
