import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import Image from "next/image";

interface CardFunctionProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	iconPath: string;
	subscript: string;
}

export function CardFunction({
	className,
	title,
	iconPath,
	subscript,
	...props
}: CardFunctionProps) {
	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-medium">{title}</CardTitle>
				<div className="relative h-6 w-6 text-muted-foreground">
					<Image
						src={iconPath}
						alt="$"
						layout="fill"
						objectFit="cover"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-sm font-light">{subscript}</div>
			</CardContent>
		</Card>
	);
}
