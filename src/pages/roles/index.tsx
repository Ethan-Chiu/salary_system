import { ChevronDownIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { Sidebar } from "~/components/sidebar";

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
import { Separator } from "~/components/ui/separator";

export default function DemoTeamMembers() {
	return (
		<PageLayout>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen bg-background">
				<div className="grid min-h-screen lg:grid-cols-5">
					<Sidebar className="hidden lg:block lg:border-border" />
					<div className="col-span-3 lg:col-span-4 lg:border-l">
						<div className="h-full px-4 py-6 lg:px-8">
							<div className="w-full">
								{/* header */}
								<div className="my-4">
									<h2 className="text-2xl font-semibold tracking-tight">
										Roles
									</h2>
								</div>
								<Separator />
								<Card className="my-6">
									<CardHeader>
										<CardTitle>Team Members</CardTitle>
										<CardDescription>
											Invite your team members to
											collaborate.
										</CardDescription>
									</CardHeader>
									<CardContent className="grid gap-6">
										<div className="flex items-center justify-between space-x-4">
											<div className="flex items-center space-x-4">
												<Avatar>
													<AvatarImage src="/avatars/01.png" />
													<AvatarFallback>
														OM
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium leading-none">
														Sofia Davis
													</p>
													<p className="text-sm text-muted-foreground">
														m@example.com
													</p>
												</div>
											</div>
											<CompRoleDropdown />
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</main>
		</PageLayout>
	);
}

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
