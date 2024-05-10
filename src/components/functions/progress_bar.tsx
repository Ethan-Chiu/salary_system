import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import React, { Fragment } from "react";

function ProgressBar({
	labels,
	selectedIndex,
}: {
	labels: string[];
	selectedIndex: number;
}) {
	return (
		<ol className="flex w-full items-center justify-evenly space-x-2 rounded-lg border border-gray-200 bg-white p-3 text-center text-sm font-medium text-gray-500 shadow-sm rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:space-x-4 sm:p-4 sm:text-base">
			{labels.map((label, index) => (
				<Fragment key={label}>
					<Step
						number={index + 1}
						selectedIndex={selectedIndex + 1}
						label={label}
					/>
					{index == labels.length - 1 ? (
						<></>
					) : (
						<DoubleArrowRightIcon />
					)}
				</Fragment>
			))}
		</ol>
	);
}

function Step({
	number,
	selectedIndex,
	label,
}: {
	number: number;
	selectedIndex: number;
	label: string;
}) {
	if (selectedIndex > number) {
		return (
			<li className="flex items-center text-green-600 dark:text-green-500">
				<span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green-600 text-xs dark:border-green-500">
					{number}
				</span>
				{label}
			</li>
		);
	} else if (selectedIndex == number) {
		return (
			<li className="flex items-center text-blue-600 dark:text-blue-500">
				<span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-600 text-xs dark:border-blue-500">
					{number}
				</span>
				{label}
			</li>
		);
	} else {
		return (
			<li className="flex items-center text-gray-600 dark:text-gray-500">
				<span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-600 text-xs dark:border-gray-500">
					{number}
				</span>
				{label}
			</li>
		);
	}
}

export { ProgressBar };
