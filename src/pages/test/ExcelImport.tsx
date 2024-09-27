import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";
import ExcelJS from 'exceljs';

const TEST: NextPageWithLayout = () => {
	const [data, setData] = useState<any[][]>([]);
	const [error, setError] = useState<string | null>(null);
	const createAPI = api.parameters.initSalaryIncomeTax.useMutation();

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			// Read the file as ArrayBuffer
			const arrayBuffer = await file.arrayBuffer();

			// Create a new workbook
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(arrayBuffer);

			// Access the first sheet
			const sheet = workbook.worksheets[0];
			const rows: any[][] = [];

			// Extract data from the sheet
			sheet!.eachRow({ includeEmpty: true }, (row: any) => {
				rows.push(row.values);
			});

			const newRows = rows.slice(1).map((row, index) => {
				row = row.slice(2);
				return {
					salary_start: row[0],
					salary_end: row[1],
					dependent: row[2],
					tax_amount: row[3],
				}
			})

			createAPI.mutate(newRows)


			// Update state with the extracted data
			setData(rows);
		} catch (error) {
			setError('Error processing file');
			console.error(error);
		}
	};

	return (
		<div>
			<h1>Upload and Read Excel File</h1>
			
			<Input type="file" accept=".xlsx" onChange={handleFileUpload} />
			
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<div style={{ overflowX: 'auto', maxHeight: '600px', border: '1px solid #ddd' }}>
				<table style={{ borderCollapse: 'collapse', width: '100%' }}>
					<thead>
						<tr>
							{/* Assuming the first row contains headers */}
							{data[0] && data[0].map((header: any, index: number) => (
								<th key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.slice(1).map((row: any, rowIndex: number) => (
							<tr key={rowIndex}>
								{row.map((cell: any, cellIndex: number) => (
									<td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

TEST.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Test">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;
