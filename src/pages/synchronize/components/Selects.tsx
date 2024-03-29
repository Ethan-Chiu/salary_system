import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

interface MODE {
	mode: string;
	setMode: (mode: string) => void;
}

export function SelectModeComponent({ mode, setMode }: MODE) {
	return (
		<>
			<Select value={mode} onValueChange={setMode}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="Changed">Only Changed</SelectItem>
					<SelectItem value="All">Display All</SelectItem>
				</SelectContent>
			</Select>
		</>
	);
}

// const SelectColorComponent = () => {
//     return (
//         <>
//             <Select value={diffColor} onValueChange={setDiffColor}>
//                 <SelectPrimitive.Trigger
//                     className={
//                         "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     }
//                 >
//                     <Paintbrush
//                         strokeWidth={1.5}
//                         className="cursor-pointer"
//                     />
//                 </SelectPrimitive.Trigger>
//                 <SelectContent>
//                     <SelectItem value="red">Red</SelectItem>
//                     <SelectItem value="blue">Blue</SelectItem>
//                     <SelectItem value="purple">Purple</SelectItem>
//                 </SelectContent>
//             </Select>
//         </>
//     );
// };
