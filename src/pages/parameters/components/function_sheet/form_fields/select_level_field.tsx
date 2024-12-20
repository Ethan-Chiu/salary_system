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

export function SelectLevelField({
	field,
	inputProps,
	error,
	id,
}: FormFieldProps) {
	const { getValues } = useFormContext();

	return (
		<Select {...inputProps}>
			<SelectTrigger
				id={id}
				className={error ? "border-destructive" : ""}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
      <SelectLevelOptionsComp start_date={getValues("start_date")} />
		</Select>
	);
}

function SelectLevelOptionsComp({ start_date }: { start_date: Date }) {
	/* const { data, isLoading } = api.parameters.getAllLevel.useQuery(); */

	/* if (isLoading) { */
	/* 	return <span>Loading...</span>; */
	/* } */

  const fake_d = [
    "a", "b", "c"
  ]

	return (
		<SelectContent>
			{(fake_d ?? []).map((key) => (
				<SelectItem key={key} value={key}>
					{key}
				</SelectItem>
			))}
		</SelectContent>
	);
}
