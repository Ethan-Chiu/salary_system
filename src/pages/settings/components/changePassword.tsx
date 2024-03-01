import { useState } from "react";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import * as z from "zod";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";

const formComponent = (mode?: string) => {
	const formSchema = z.object({
		old_pw: z.string().describe("Old Password"),
		new_pw: z.string().describe("New Password"),
		new_pw2: z.string().describe("Confirm New Password"),
	});
	const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>(
		{}
	);

	const { toast } = useToast();

	const { data: session, status } = useSession();
	const api_login = api.login.login.useMutation();
	const api_changePassword = api.login.changePassword.useMutation({
		onSuccess: () => {},
	});

	async function checkPassword(data: any) {
		try {
			await api_login.mutateAsync({
				emp_no: session?.user.emp_no!,
				password: data.old_pw,
			});

			if (api_login.isError) {
				return api_login.error.message;
			}

			if (data.new_pw !== data.new_pw2)
				return "Confirm of new password fail!";
			if (data.new_pw === data.old_pw)
				return "The new password is same as the old one!";
			return "Success";
		} catch (error) {
			return error as string;
		}
	}
	async function callAPI(newPassword: string) {
		await api_changePassword.mutateAsync({
			emp_no: session?.user.emp_no!,
			password: newPassword,
		});
	}

	async function handleSubmit(data: any) {
		const status: string = await checkPassword(data);
		if (status === "Success") {
			await callAPI(data.new_pw);
			toast({
				title: "Successfully update password",
				description: "Automatically logout",
			});
			signOut();
		} else {
			alert(status);
			window.location.reload();
		}
	}

	function getForm() {
		return (
			<>
				<AutoForm
					formSchema={formSchema}
					onSubmit={(data) => {
						handleSubmit(data);
					}}
					values={values}
					onValuesChange={setValues}
					fieldConfig={{
						old_pw: {
							inputProps: {
								type: "password",
								// placeholder: "••••••••",
							},
						},
						new_pw: {
							inputProps: {
								type: "password",
								// placeholder: "••••••••",
							},
						},
						new_pw2: {
							inputProps: {
								type: "password",
								// placeholder: "••••••••",
							},
						},
					}}
				>
					{/* <AutoFormSubmit>Confirm</AutoFormSubmit> */}
					<Button>Confirm</Button>
				</AutoForm>
			</>
		);
	}

	if (mode === "card")
		return (
			<div className="mx-auto my-6 max-w-lg">
				<Card>
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						{/* <CardDescription>
						Automatically generate a form from a Zod schema.
					</CardDescription> */}
					</CardHeader>

					<CardContent>{getForm()}</CardContent>
				</Card>
			</div>
		);

	return <>{getForm()}</>;
};

export const changePasswordForm = (mode?: string) => {
	return <>{formComponent(mode)}</>;
};
