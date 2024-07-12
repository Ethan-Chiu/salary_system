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
  
  
  export function LIDTable() {

    const EMP = "F103007";
    
    const empdata = api.employeeData.getAllEmployeeData.useQuery()
    const LID = api.calculate.calculateLaborInsuranceDeduction.useQuery({ emp_no: EMP, period_id: 113 })    
    
    return (
        <>
            {LID.isLoading ? <p>loading...</p> : 
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Emp No.</TableHead>
                    <TableHead>Emp Name</TableHead>
                    <TableHead>勞保扣除額</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={EMP}>
                    <TableCell className="font-medium">{EMP}</TableCell>
                    <TableCell>{empdata.data ? empdata.data.findLast((e) => e.emp_no === EMP)?.emp_name : EMP}</TableCell>
                    <TableCell>{LID.data ?? 0}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                
                </TableFooter>
            </Table>
        }
      </>
    )
  }
  