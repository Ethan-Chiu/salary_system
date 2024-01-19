import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { useContext, type ReactElement, useState } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

import { Button } from "~/components/ui/button";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { SelectSeparator } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/header";

const PageSettings: NextPageWithLayout = () => {
	const [selectedTable, setSelectedTable] = useState<string>('newTable');
  
	const previousTableData = [
		{ key: 1, value: 'Item 1' },
		{ key: 2, value: 'Item 2' },
		{ key: 3, value: 'Item 3' },
		{ key: 4, value: 'Item 4' },
		{ key: 5, value: 'Item 5' },
		{ key: 6, value: 'Item 6' },
		{ key: 7, value: 'Item 7' },
		{ key: 8, value: 'Item 8' },
		{ key: 9, value: 'Item 9' },
		{ key: 10, value: 'Item 10' },
		{ key: 11, value: 'Item 11' },
		{ key: 12, value: 'Item 12' },
		{ key: 13, value: 'Item 13' },
		{ key: 14, value: 'Item 14' },
		{ key: 15, value: 'Item 15' },
		{ key: 16, value: 'Item 16' },
		{ key: 17, value: 'Item 17' },
		{ key: 18, value: 'Item 18' },
		{ key: 19, value: 'Item 19' },
		{ key: 20, value: 'Item 20' },
	  ];
	
	  const newTableData = [
		{ key: 1, value: 'Item 1' },
		{ key: 2, value: 'Item 2' },
		{ key: 3, value: 'Item 3' },
		{ key: 4, value: 'Item 4' },
		{ key: 5, value: 'Item 5' },
		{ key: 6, value: 'Item 6' },
		{ key: 7, value: 'Item 7' },
		{ key: 8, value: 'Item 8' },
		{ key: 9, value: 'Item 9' },
		{ key: 10, value: 'Item 10' },
		{ key: 11, value: 'Item 11' },
		{ key: 12, value: 'Item 12' },
		{ key: 13, value: 'Item 16' },
		{ key: 14, value: 'Item 14' },
		{ key: 15, value: 'Item 15' },
		{ key: 16, value: 'Item 16' },
		{ key: 17, value: 'Item 17' },
		{ key: 18, value: 'Item 18' },
		{ key: 19, value: 'Item 19' },
		{ key: 20, value: 'Item 20' },
	  ];
  
	const handleTableChange = (table: string) => {
	  setSelectedTable(table);
	};
  
	const handleConfirmChange = () => {
	  console.log(`Confirmed change for ${selectedTable}`);
	  // 添加确认更改的逻辑，例如向服务器发送数据
	};
  
	const renderTable = (tableData: { key: number; value: string }[], tableName: string) => (
	  <div className={`w-1/2 cursor-pointer`} onClick={() => handleTableChange(tableName)}>
		<table className={`w-full border text-sm ${selectedTable === tableName ? 'border-2 border-blue-500' : ''}`}>
		  <caption className={cn("mt-4 text-sm text-muted-foreground")}>
			{tableName === 'previousTable' ? 'Previous Table' : 'New Table'}
		  </caption>
		  <thead className="[&_tr]:border-b">
			<tr>
			  <th className="border p-2 w-1/2">Key</th>
			  <th className="border p-2 w-1/2">Value</th>
			</tr>
		  </thead>
		  <tbody className={cn("[&_tr:last-child]:border-0")}>
			{tableData.map((row) => (
			  <tr key={row.key} className={cn("border-b transition-colors data-[state=selected]:bg-muted")}>
				<td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 w-1/2")}>
				  {row.key}
				</td>
				<td className={`border p-2 w-1/2 ${row.value !== (tableName === 'previousTable' ? newTableData : previousTableData).find(item => item.key === row.key)?.value ? 'text-red-500' : ''}`}>
				  {row.value}
				</td>
			  </tr>
			))}
		  </tbody>
		  <tfoot className={cn("bg-primary font-medium text-primary-foreground")} />
		</table>
	  </div>
	);
  
	return (
	  <>
		<Header title="TEST" />
		<Separator />
		<div className="container mx-auto my-8">
		  <div className="mb-8 mt-4 flex">
			{renderTable(previousTableData, 'previousTable')}
			<div className="w-4"></div> {/* Add a small separation */}
			{renderTable(newTableData, 'newTable')}
		  </div>
  
		  {selectedTable && (
			<Button
			  key="confirmButton"
			  onClick={() => handleConfirmChange()}
			>
			  Confirm Change
			</Button>
		  )}
		</div>
	  </>
	);
  };

PageSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="test">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageSettings;
