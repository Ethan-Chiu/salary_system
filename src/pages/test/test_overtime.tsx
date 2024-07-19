import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { api } from "~/utils/api"
  
  
  export function OvertimeTable(props: {EMP: string}) {
    
    const EMP = props.EMP;
    const empdata = api.employeeData.getAllEmployeeData.useQuery()
    const overtime_data1 = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: EMP, period_id: 113 })    
    const overtime_data2 = api.calculate.calculateHolidayOvertimePay.useQuery({ emp_no: EMP, period_id: 113 })    
    return (
        <>
            {overtime_data1.isLoading || overtime_data2.isLoading ? <p>loading...</p> : 
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Emp No.</TableHead>
                    <TableHead>Emp Name</TableHead>
                    <TableHead>平日加班費</TableHead>
                    <TableHead className="text-right">假日加班費</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={EMP}>
                    <TableCell className="font-medium">{EMP}</TableCell>
                    <TableCell>{empdata.data ? empdata.data.findLast((e) => e.emp_no === EMP)?.emp_name : EMP}</TableCell>
                    <TableCell>{overtime_data1.data}</TableCell>
                    <TableCell className="text-right">{overtime_data2.data}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>平假日加班費總和</TableCell>
                    <TableCell className="text-right">${(overtime_data1.data ?? 0) + (overtime_data2.data ?? 0)}</TableCell>
                </TableRow>
                </TableFooter>
            </Table>
        }
      </>
    )
  }
  