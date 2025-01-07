import { useEffect, useState } from "react";
import { type HistoryDataType } from "../history_data_type";

export function useHistoryState<T extends HistoryDataType>(
	isLoading: boolean,
	data?: T[][],
	onLoad?: (d: T) => void
) {
	const [selectedData, setSelectedData] = useState<T | null>(null);
	const [selectedDataList, setSelectedDataList] = useState<T[]>(
		[]
	);

	// Select the first when data loaded
	useEffect(() => {
		if (!isLoading && data?.[0]?.[0]) {
			setSelectedData(data[0][0]);
			setSelectedDataList(data[0]);
			onLoad?.(data[0][0]);
		}
	}, [isLoading, data, onLoad]);

	useEffect(() => {
		if (selectedDataList[0]) {
			setSelectedData(selectedDataList[0]);
		}
	}, [selectedDataList]);

	return {
		selectedData,
		selectedDataList,
		setSelectedData,
		setSelectedDataList,
	};
}
