import React from "react";

const LongHorizontalTable = ({ tableData }: any) => {
	return (
		<div>
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					border: "1px solid black",
				}}
			>
				<thead>
					<tr>
						{Object.keys(tableData).map((key) => {
							return (
								<th
									style={{
										border: "1px solid black",
										padding: "8px",
									}}
								>
									{key}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					<tr key={tableData.id}>
						{Object.keys(tableData).map((key) => {
							return (
								<td
									style={{
										border: "1px solid black",
										padding: "8px",
									}}
								>
									{tableData[key]}
								</td>
							);
						})}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LongHorizontalTable;
