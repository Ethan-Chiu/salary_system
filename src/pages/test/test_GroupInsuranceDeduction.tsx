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
  
  
  export function GIDTable(props: {EMP: string, period: number}) {

    // ;
    const EMP = props.EMP;
    const period = props.period
    
    const empdata = api.employeeData.getAllEmployeeData.useQuery()
    const GID = api.calculate.calculateGroupInsuranceDeduction.useQuery({ emp_no: EMP, period_id: 113 })    
    
    return (
        <>
            {GID.isLoading ? <p>loading...</p> : 
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Emp No.</TableHead>
                    <TableHead>Emp Name</TableHead>
                    <TableHead>團保費代扣</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow key={EMP}>
                    <TableCell className="font-medium">{EMP}</TableCell>
                    <TableCell>{empdata.data ? empdata.data.findLast((e) => e.emp_no === EMP)?.emp_name : EMP}</TableCell>
                    <TableCell>{GID.data ?? 0}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                
                </TableFooter>
            </Table>
        }
      </>
    )
  }
  