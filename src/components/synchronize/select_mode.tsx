import {
	SyncDataDisplayModeEnum,
	syncDataModeString,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

interface SelectModeComponentProps {
	mode: SyncDataDisplayModeEnumType;
	setMode: (mode: SyncDataDisplayModeEnumType) => void;
}

export function SelectModeComponent({
	mode,
	setMode,
}: SelectModeComponentProps) {
	return (
		<>
			<Select value={mode} onValueChange={setMode}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{Object.values(SyncDataDisplayModeEnum.Values).map(
						(value) => (
							<SelectItem key={value} value={value}>
								{syncDataModeString(value)}
							</SelectItem>
						)
					)}
				</SelectContent>
			</Select>
		</>
	);
}
