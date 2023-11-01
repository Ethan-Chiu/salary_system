import Head from "next/head";
import { RootLayout } from "~/components/layout/root_layout";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";

import React, { useState } from "react";
import { PerpageLayout } from "~/components/layout/perpage_layout";

export default function Login() {
	const [forgetPwd, setForgetPwd] = useState(false);

	return (
		<PerpageLayout pageTitle="login">
			<div className="mt-[15vh] flex justify-center align-middle">
				{!forgetPwd ? (
					<Card className="w-[400px]">
						<CardHeader>
							<div className="justify-center">
								<CardTitle>Login</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="name">User ID</Label>
								<Input id="userid" placeholder="user id" />
							</div>
							<div className="space-y-1">
								<Label htmlFor="username">Password</Label>
								<Input id="password" placeholder="password" />
							</div>
							<div className="text-right">
								<br></br>
								<button
									onClick={() => setForgetPwd(true)}
									className="text-sm text-muted-foreground"
								>
									forget password?
								</button>
							</div>
						</CardContent>
						<CardFooter className="justify-center">
							<Link key={"/"} href={"/"}>
								<Button>LOGIN</Button>
							</Link>
						</CardFooter>
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
							<div className="text-right">
								<br></br>
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
