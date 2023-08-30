import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export type CardFunctionData = {
    title: string;
	iconPath: string;
	subscript: string;
};

interface CardFunctionProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	iconPath: string;
	subscript: string;
}

const variants = {
	start: {
		scale: 0.95,
	},
	end: {
		scale: 1.0,
	},
	hover: {
		scale: 1.05,
	},
};

const imageVariants = {
	start: {
		rotate: 0,
		x: 10,
	},
	end: {
		rotate: 0,
		x: 0,
	},
	hover: {
		rotate: -20,
		x: -10,
	},
};

export function CardFunction({
	className,
	title,
	iconPath,
	subscript,
	...props
}: CardFunctionProps) {
	return (
		<motion.a
			initial="start"
			animate="end"
			whileHover="hover"
			variants={variants}
			className={cn(className)}
		>
			<Card className="text-foreground hover:text-primary">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-2xl font-medium">
						{title}
					</CardTitle>
					<motion.div
						variants={imageVariants}
						className="relative h-6 w-6 text-muted-foreground"
					>
						<Image
							src={iconPath}
							alt="$"
							layout="fill"
							objectFit="cover"
						/>
					</motion.div>
				</CardHeader>
				<CardContent>
					<div className="text-sm font-light">{subscript}</div>
				</CardContent>
			</Card>
		</motion.a>
	);
}
