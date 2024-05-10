import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import * as z from "zod";
import { signOut, useSession } from "next-auth/react";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { onPromise } from "~/utils/on_promise";
import Router from "next/router";
import { cn } from "~/lib/utils";

const changePasswordFormSchema = z.object({
	old_pw: z
		.string({ required_error: "Please enter your old password" })
		.describe("Old Password"),
	new_pw: z
		.string({ required_error: "Please enter your new password" })
		.describe("New Password"),
	new_pw2: z
		.string({ required_error: "Please enter your new password again" })
		.describe("Confirm New Password"),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export function ChangePasswordForm() {
	const { data: session } = useSession();

	const changePassword = api.login.changePassword.useMutation();

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordFormSchema),
	});

	async function onSubmit(data: ChangePasswordFormValues) {
		if (session === null) {
			void Router.push("/login");
			return;
		}
		await changePassword.mutateAsync({
			emp_no: session.user.emp_no,
			password: data.new_pw,
		});
		toast({
			title: "Successfully update password",
			description: "Automatically logout",
		});
		await signOut();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={onPromise<void>(form.handleSubmit(onSubmit))}
				className="flex space-y-8 w-1/2 justify-center"
			>
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle className="text-2xl">Change Password</CardTitle>
						<CardDescription>
							Enter your old password and new password.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<FormField
							control={form.control}
							name="old_pw"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Old password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="old password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="new_pw"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="new password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="new_pw2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm new password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="new password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Change password
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}

// async function checkPassword(data: any) {
// 	try {
// 		await api_login.mutateAsync({
// 			emp_no: session?.user.emp_no!,
// 			password: data.old_pw,
// 		});

// 		if (api_login.isError) {
// 			return api_login.error.message;
// 		}

// 		if (data.new_pw !== data.new_pw2)
// 			return "Confirm of new password fail!";
// 		if (data.new_pw === data.old_pw)
// 			return "The new password is same as the old one!";
// 		return "Success";
// 	} catch (error) {
// 		return error as string;
// 	}
// }
