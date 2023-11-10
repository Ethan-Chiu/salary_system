import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { onPromise } from "~/utils/on_promise";

const BANK_CODE_LENGTH = 3

const bankFormSchema = z.object({
    data: z.array(
        z.object(
            {  
                id:         z.number(),
                bank_code:  z.string().length(BANK_CODE_LENGTH, "Bank code should have length equal to "+BANK_CODE_LENGTH.toString()+"."),
                bank_name:  z.string({required_error: "Please enter bank name."}),
                org_code:   z.string({required_error: "Please enter organization code."}),
                org_name:   z.string({required_error: "Please enter organization name."}),
            }
        )
    )
});
type BankFormValues = z.infer<typeof bankFormSchema>;

// This can come from your database or API.
const defaultBankValues: Partial<BankFormValues> = {
	data: [
		{id: 0, bank_code: "test_bank_code", bank_name: "test_bank_name", org_code: "test_org_code", org_name: "test_org_name"},

	]
};

const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(30, {
			message: "Username must not be longer than 30 characters.",
		}),
	email: z
		.string({
			required_error: "Please select an email to display.",
		})
		.email(),
	bio: z.string().max(160).min(4),
	urls: z
		.array(
			z.object({
				value: z.string().url({ message: "Please enter a valid URL." }),
			})
		)
		.optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
	bio: "I own a computer.",
	urls: [
		{ value: "https://shadcn.com" },
		{ value: "http://twitter.com/shadcn" },
	],
};

export function BankForm() {
	const form = useForm<BankFormValues>({
		resolver: zodResolver(bankFormSchema),
		defaultValues: defaultBankValues,
		mode: "onChange",
	});

	const { fields, append } = useFieldArray({
		name: "data",
		control: form.control,
	});

	const { toast } = useToast();

	function onSubmit(data: BankFormValues) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(data, null, 2)}
					</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={onPromise<void>(form.handleSubmit(onSubmit))}
				className="space-y-8"
			>
                <div>
					{fields.map((field, index) => (
						<FormField
							control={form.control}
							key={field.id}
							name={field.id}
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(index !== 0 && "sr-only")}
									>
										URLs
									</FormLabel>
									<FormDescription
										className={cn(index !== 0 && "sr-only")}
									>
										Add Bank Data
									</FormDescription>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2"
						onClick={() => {
							console.log({fields})
							append({id: -1, bank_code: "", bank_name: "", org_code: "", org_name: ""})
						}}
					>
						Add URL
					</Button>
				</div>
				<Button type="submit">Update bank</Button>
			</form>
		</Form>
	);
}
