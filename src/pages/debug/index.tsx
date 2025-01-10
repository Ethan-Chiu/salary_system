import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { DatePicker } from "~/components/ui/date-picker";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

const PageHome: NextPageWithLayout = () => {
	return (
		<>
			<DatePicker setDate={() => {}} />
			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent className="max-h-40">
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						<SelectItem
							className="pointer-events-auto"
							value="apple"
						>
							Apple
						</SelectItem>
						<SelectItem
							className="pointer-events-auto"
							value="banana"
						>
							Banana
						</SelectItem>
						<SelectItem
							className="pointer-events-auto"
							value="blueberry"
						>
							Blueberry
						</SelectItem>
						<SelectItem value="grapes">Grapes</SelectItem>
						<SelectItem value="pineapple">Pineapple</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return <RootLayout>{page}</RootLayout>;
};

export default PageHome;
