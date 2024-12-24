import { type FormFieldProps } from "~/components/ui/custom-form/types";
import { api } from "~/utils/api";
import { useFormContext } from "react-hook-form";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "~/components/ui/select";
import { useEffect } from "react";
import { z } from "zod";

export function SelectLevelField({
	field,
	inputProps,
	error,
	id,
}: FormFieldProps) {
	const { watch } = useFormContext();

	const startDateInput = watch("start_date", null);
	const result = z
		.string()
		.nullable()
		.pipe(z.coerce.date().nullable())
		.safeParse(startDateInput);

	useEffect(() => {
		const subscription = watch((value, { name, type }) =>
			console.log(value, name, type)
		);
		return () => subscription.unsubscribe();
	}, [watch]);

	return (
		<Select {...inputProps}>
			<SelectTrigger
				id={id}
				className={error ? "border-destructive" : ""}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>

			{result.success && result.data ? (
				<SelectLevelOptionsComp start_date={result.data} />
			) : (
				<div>Select a start date</div>
			)}
		</Select>
	);
}

function SelectLevelOptionsComp({ start_date }: { start_date: Date }) {
	const { data, isLoading } = api.parameters.getAllLevelByStartDate.useQuery({
		start_date: start_date,
	});

	if (isLoading) {
		return <span>Loading...</span>;
	}

	return (
		<SelectContent>
			{(data ?? []).map((d) => (
				<SelectItem key={d.id} value={d.level.toString()}>
					{d.level}
				</SelectItem>
			))}
		</SelectContent>
	);
}
