import { IColumn } from "@/interfaces/layout.interface"
import { JSX } from "react"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "./ui/input"


interface IColumTableProps<T> {
    columns: IColumn[],
    data: T[],
    render: (item: T) => JSX.Element
}


const CustomTable = <T,>(
    {
        columns,
        data,
        render
    }: IColumTableProps<T>) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col: IColumn) => (
                        <TableHead key={col.key} className={col.className}>
                            {col.key === 'checkbox' ? <Input type="checkbox" className="size-4" /> : col.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            {/* để có dữ liệu từ api thì truyền data vào map duyệt mảng nó render ra những item trong tableItem   */}
            <TableBody>
                {data.map((item: T) => render(item))}
            </TableBody>
        </Table>
    )
}

export default CustomTable