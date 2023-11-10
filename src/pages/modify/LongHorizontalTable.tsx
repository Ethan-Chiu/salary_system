import React from 'react';

const LongHorizontalTable = ({ tableData }: any) => {
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Object.keys(tableData).map((key) => {
                return <th>{key}</th>
            })}
          </tr>
        </thead>
        <tbody>
        <tr key={tableData.id}>
            {Object.keys(tableData).map((key) => {
                return <td>{tableData[key]}</td>
            })}
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LongHorizontalTable;