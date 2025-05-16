
import React, { memo } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import FilterCommon from "@/components/filter-common"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import {

    TableCell,

    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { IUser } from "@/interfaces/user/user.interface"
import { isApiSuccessResponse } from "@/interfaces/api.response"
import { commonExtraFilter, IFilterSelectConfig } from "@/config/constans"
import PaginateComponent from "@/components/pagination"
import { IColumn } from "@/interfaces/layout.interface"
import CustomTable from "@/components/custom-table"
import { usePage } from "@/hooks/usePage"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"

export interface IConfigModule<T> {
    endpoint: string,
    title: string,
    description: string,
    createLink: string,
    extraFilters: IFilterSelectConfig[],
    columns: IColumn[],
    fields: (keyof T)[],
}

const config: IConfigModule<IUser> = {
    endpoint: 'api/v1/users',
    title: 'QL thành viên',
    description: 'Quản lý thông tin danh sách thành viên',
    createLink: '/user/create',
    extraFilters: [...commonExtraFilter],
    columns: [
        { key: 'checkbox', label: '', className: 'w-[50px] text-center' },
        { key: 'id', label: 'ID', className: 'text-left w-[80px]' },
        { key: 'name', label: 'Tên thành viên', className: 'text-left w-[25%]' },
        { key: 'email', label: 'email', className: 'text-left w-[120px]' },
        { key: 'phone', label: 'Số điện thoại', className: 'text-center w-[120px]' },
        { key: 'publish', label: 'Trạng thái', className: 'text-center w-[100px]' },
        { key: 'actions', label: 'Thao tác', className: 'text-center w-[160px]' },
    ],
    fields: ["publish"]
}

const TableRowComponent = React.memo(({
    item,
    switchStates,
    handleSwitchChange,
    handleDelete
}: {
    item: IUser,
    switchStates: Record<number, boolean>,
    handleSwitchChange: (id: number, currentValue: number, field: string) => void,
    handleDelete: (id: number) => void
}) => (
    <TableRow key={item.id} className="hover:bg-gray-50">
        <TableCell className="text-center">
            <Input type="checkbox" className="size-4" />
        </TableCell>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell className="text-left">{item.name}</TableCell>
        <TableCell className="text-left">{item.email}</TableCell>
        <TableCell className="text-center">{item.phone}</TableCell>
        <TableCell className="text-center">
            <Switch
                checked={switchStates[item.id] ?? (item.publish === 2)}
                className="cursor-pointer"
                onCheckedChange={() => handleSwitchChange(item.id, item.publish, 'publish')}
            />
        </TableCell>
        <TableCell>
            <div className="flex items-center justify-center gap-2">
                <Link to={`/user/edit/${item.id}`}>
                    <Button className="size-10 bg-[#0088FF] rounded-[5px] p-2 hover:opacity-90">
                        <Edit className="w-4 h-4" />
                    </Button>
                </Link>
                <DeleteConfirmDialog item={item} onDelete={() => handleDelete(item.id)}>
                    <Button className="size-10 bg-[#ed5565] rounded-[5px] p-2 hover:opacity-90">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </DeleteConfirmDialog>

            </div>
        </TableCell>
    </TableRow>
))


const userIndex = () => {
    const {
        title,
        description,
        createLink,
        columns,
        memoziedFilterCommonProps,
        switchStates,
        isLoading,
        tableItems,
        records: users,
        handlePageChange,
        handleSwitchChange,
        handleDelete,
    } = usePage({ config })

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                <Card className="rounded-[5px]">
                    <CardHeader className="border-b">
                        <CardTitle> {title} </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-[20px]">
                            <FilterCommon
                                {...memoziedFilterCommonProps}
                            />

                            <Link to={createLink} className="ml-[-15px]">
                                <Button className="bg-[#ed5565] shadown rounded-[4px] cursor-pointer">
                                    <PlusCircle />
                                    Thêm mới bản ghi
                                </Button>
                            </Link>
                        </div>
                        {/* custom Table render ra dòng cột truyền vào 3 tham số  */}
                        <CustomTable
                            columns={columns}
                            data={tableItems}
                            render={(item: IUser) => (
                                <TableRowComponent
                                    key={item.id}
                                    item={item}
                                    switchStates={switchStates.publish ?? {}}
                                    handleSwitchChange={handleSwitchChange}
                                    handleDelete={handleDelete}
                                />
                            )}
                        />

                    </CardContent>
                    <CardFooter className="borderr-t">
                        {!isLoading && users && 'data' in users && isApiSuccessResponse(users) && 'links' in users.data && (
                            <PaginateComponent
                                links={users.data.links}
                                // click chuyển trang
                                onPageChange={handlePageChange}
                                from={users.data.from}
                                to={users.data.to}
                                total={users.data.total}
                                currentPage={users.data.current_page}
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default memo(userIndex)