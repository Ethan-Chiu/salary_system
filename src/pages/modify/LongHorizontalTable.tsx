import React from "react";

const LongHorizontalTable = ({ tableData }: any) => {
	return (
		<div style={{ overflowX: "auto" }}>
			<br />
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					border: "1px solid black",
					whiteSpace: "nowrap", // Prevent text wrapping
				}}
			>
				<thead>
					<tr>
						{Object.keys(tableData).map((key) => (
							<th
								key={key}
								style={{
									border: "1px solid black",
									padding: "12px",
									backgroundColor: "#f2f2f2", // Add background color for header
									position: "sticky",
									top: 0,
									zIndex: 1,
								}}
							>
								{key}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr>
						{Object.keys(tableData).map((key) => (
							<td
								key={key}
								style={{
									border: "1px solid black",
									padding: "12px",
								}}
							>
								{tableData[key]}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LongHorizontalTable;
