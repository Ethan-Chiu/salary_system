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
  
  
  export function OvertimeTable() {

    const overtime_data1 = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: "F103007", period_id: 113 })    
    const overtime_data2 = api.calculate.calculateOvertimeWeekendPayment.useQuery({ emp_no: "F103007", period_id: 113 })    
    return (
        <>
            {overtime_data1.isLoading || overtime_data2.isLoading ? <p>loading...</p> : 
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Employee</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>平日加班費</TableHead>
                    <TableHead className="text-right">假日加班費</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={"F103007"}>
                    <TableCell className="font-medium">{"F103007"}</TableCell>
                    <TableCell>{"???"}</TableCell>
                    <TableCell>{overtime_data1.data}</TableCell>
                    <TableCell className="text-right">{overtime_data2.data}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
                </TableFooter>
            </Table>
        }
      </>
    )
  }
  