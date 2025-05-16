import { useDashboard } from "@/pages/dashboard/Layout"
import React, { memo, useEffect, useMemo, useState, useLayoutEffect } from "react"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { IPermission } from "@/interfaces/permissions/user.interface"
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

const config: IConfigModule<IPermission> = {
    endpoint: 'api/v1/permissions',
    title: 'Quản lý quyền',
    description: 'Quản lý thông tin danh sách quyền',
    createLink: '/permissions/create',
    extraFilters: [...commonExtraFilter],
    columns: [
        { key: 'checkbox', label: '', className: 'w-[50px] text-center' },
        { key: 'id', label: 'ID', className: 'text-left w-[80px]' },
        { key: 'name', label: 'Từ khóa', className: 'text-left w-[25%]' },
        { key: 'title', label: 'Tên quyền', className: 'text-left w-[120px]' },
        { key: 'module', label: 'Tên module', className: 'text-center w-[120px]' },
        // { key: 'description', label: 'Mô tả', className: 'text-center w-[100px]' },
        { key: 'value', label: 'Giá trị quyền', className: 'text-center w-[100px]' },
        // { key: 'user_id', label: 'Người dùng', className: 'text-center w-[100px]' },
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
    item: IPermission,
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
        <TableCell className="text-left">{item.title}</TableCell>
        <TableCell className="text-center">{item.module}</TableCell>
        {/* <TableCell className="text-center">{item.description}</TableCell> */}
        <TableCell className="text-center">{item.value}</TableCell>
        {/* <TableCell className="text-center">{item.userId}</TableCell> */}
        <TableCell className="text-center">
            <Switch
                checked={switchStates[item.id] ?? (item.publish === 2)}
                className="cursor-pointer"
                onCheckedChange={() => handleSwitchChange(item.id, item.publish, 'publish')}
            />
        </TableCell>
        <TableCell>
            <div className="flex items-center justify-center gap-2">
                <Link to={`/permissions/edit/${item.id}`}>
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


const PermissionsIndex = () => {
    const {
        title,
        description,
        createLink,
        columns,
        memoziedFilterCommonProps,
        switchStates,
        isLoading,
        tableItems,
        records: permissions,
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
                            render={(item: IPermission) => (
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
                        {!isLoading && permissions && 'data' in permissions && isApiSuccessResponse(permissions) && 'links' in permissions.data && (
                            <PaginateComponent
                                links={permissions.data.links}
                                // click chuyển trang
                                onPageChange={handlePageChange}
                                from={permissions.data.from}
                                to={permissions.data.to}
                                total={permissions.data.total}
                                currentPage={permissions.data.current_page}
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default memo(PermissionsIndex)