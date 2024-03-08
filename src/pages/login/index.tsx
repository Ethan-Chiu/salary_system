import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useCallback, useState } from "react";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { useRouter } from "next/router";
import { toast } from "~/components/ui/use-toast";
import { signIn } from "next-auth/react";

const LoginFormSchema = z.object({
	userid: z.string(),
	password: z.string().min(1, { message: "enter password" }),
});

export default function Login() {
	const [forgetPwd, setForgetPwd] = useState(false);

	const router = useRouter();

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			userid: "",
			password: "",
		},
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof LoginFormSchema>) => {

			const res = await signIn("credentials", {
				username: data.userid,
				password: data.password,
				callbackUrl: "/",
				redirect: false
			});
			if (!res?.ok) {
				console.log(`error ${res?.error}`);
				toast({
					title: "Error",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">
								{JSON.stringify(res?.error, null, 2)}
							</code>
						</pre>
					),
				});
			}
			else {
				void router.push('/');
			}
		},
		[router]
	);

	return (
		<PerpageLayout pageTitle="login">
			<div className="mt-[15vh] flex justify-center align-middle">
				{!forgetPwd ? (
					<Card className="w-[400px]">
						<Form {...form}>
							<form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
								<CardHeader>
									<div className="justify-center">
										<CardTitle>Login</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="space-y-2">
									<FormField
										control={form.control}
										name="userid"
										render={({ field }) => (
											<FormItem>
												<FormLabel>User ID</FormLabel>
												<FormControl>
													<Input
														placeholder="user id"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Your employee ID
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														placeholder="password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="pt-4 text-right">
										<button
											type="button"
											onClick={() => setForgetPwd(true)}
											className="text-sm text-muted-foreground"
										>
											forget password?
										</button>
									</div>
								</CardContent>
								<CardFooter className="justify-center">
									<Button disabled={form.formState.isSubmitting} type="submit">LOGIN</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				) : (
					<Card className="w-[400px]">
						<CardHeader>
							<div className="justify-center">
								<CardTitle>Forget Password</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="name">User ID</Label>
								<Input id="userid" placeholder="user id" />
							</div>
							<div className="pt-4 text-right">
								<button
									onClick={() => setForgetPwd(false)}
									className="text-sm text-muted-foreground"
								>
									Login
								</button>
							</div>
						</CardContent>
						<CardFooter className="justify-center">
							<Button>RESET PASSWORD</Button>
						</CardFooter>
					</Card>
				)}
			</div>
		</PerpageLayout>
	);
}
