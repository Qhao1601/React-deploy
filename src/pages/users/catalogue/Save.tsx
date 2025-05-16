import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { IUserCatalogueRequest, IUserCatalogue } from "@/interfaces/user/user-catalogue.interface";
import { useCurd } from "@/hooks/useCrud";
import useApi from "@/hooks/useApi";
import { IPermission, IPermissionrRequest } from "@/interfaces/permissions/user.interface";
import { useEffect, useMemo, useState } from "react";
import { isApiSuccessResponse } from "@/interfaces/api.response";






const formConfig = {
    schema: z.object({
        name: z.string().min(1, { message: 'Tên nhóm là bắt buộc' }),
        canonical: z.string().min(1, { message: 'Từ khóa của nhóm thành viên là bắt buộc' }),
        permissions: z.array(z.number()).min(1, { message: 'Bạn cần chọn ít nhất 1 quyền' })
    }),
    defaultValues: {
        name: '',
        canonical: '',
        permissions: [],
    },
    createTitle: 'Thêm mới nhóm thành viên',
    updateTitle: 'Update nhóm thành viên',
    endpoint: '/api/v1/user_catalogues',
    routerIndex: '/user_catalogues',
    mapToRequest: (values: { name: string, canonical: string, permissions: number[] | undefined }, userId?: number): IUserCatalogueRequest => ({
        ...values,
        permissions: values.permissions ?? [],
        userId
    })
}
export type TFromValues = z.infer<typeof formConfig.schema>

interface IPermissionModule {
    title: string,
    permissions: IPermission[]
}
interface IPermissionGroup {
    [key: string]: IPermissionModule
}
const getModuleKey = (moduleKey: string): string => {
    const moduleTitle: Record<string, string> = {
        'permissions': 'Quản lý quyền',
        'users': 'Quản lý người dùng',
        'user_catalogues': 'Quản lý nhóm thành viên',
        'post_catalogues': 'Quản lý nhóm bài viết',
        'posts': 'Quản lý bài viết',
    }
    return moduleTitle[moduleKey] || moduleKey
}

const UserCatalogueSave = () => {

    const { onSubmit, form } = useCurd<IUserCatalogue, IUserCatalogueRequest, TFromValues>(formConfig)
    const api = useApi()
    const { data: permissions } = api.usePagiante<IPermission[]>('/api/v1/permissions', { type: 'all', sort: 'name,asc' })
    const [permissionCount, setPermissionCount] = useState<{ selected: number, total: number }>({ selected: 0, total: 0 })
    // const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const selectedPermissions = useMemo(() => {
        return form.watch('permissions') || []
    }, [form.watch('permissions'), form])

    const permissionGroup = useMemo<IPermissionGroup>(() => {
        if (!permissions || !isApiSuccessResponse(permissions) || !permissions.data) return {}
        const result = permissions.data.reduce((acc: IPermissionGroup, permission: IPermission) => {
            const module = permission.module
            if (!acc[module]) {
                acc[module] = {
                    title: getModuleKey(module),
                    permissions: []
                }
            }
            acc[module].permissions.push(permission)
            return acc
        }, {})

        const totalCount = Object.values(result).reduce((sum, module) => sum + module.permissions.length, 0)
        setPermissionCount(prev => ({ ...prev, total: totalCount }))
        return result
    }, [permissions])

    // đếm số lượng quyền đã chọn
    useEffect(() => {
        setPermissionCount(prev => ({ ...prev, selected: selectedPermissions.length }))
    }, [selectedPermissions])


    // Chọn tất cả các quyền của 1  module
    const handleModulePermissionChange = (modulePermission: IPermission[], checked: boolean) => {
        const currentPermissions = form.getValues('permissions') || []
        let newPermissions: number[]
        if (checked) {
            const modulePermissionId = modulePermission.map(permission => permission.id)
            newPermissions = [...new Set([...currentPermissions, ...modulePermissionId])]
        } else {
            const modulePermissionId = modulePermission.map(permission => permission.id)
            newPermissions = currentPermissions.filter(id => !modulePermissionId.includes(id))
        }
        form.setValue('permissions', newPermissions, { shouldValidate: true })
    }

    // kiểm tra xem tất cả các quyền trong module đã chọn hay chưa . nếu chọn rồi thì checked modulePermission
    const isModuleSelected = (modulePermissions: IPermission[]) => {
        return modulePermissions.every(permission => selectedPermissions.includes(permission.id))
    }

    // bỏ chọn quyền trong modulePermission
    const handlePermissionChange = (PermissionId: number, checked: boolean) => {
        const currentPermissions = form.getValues('permissions') || []
        let newPermissions: number[]
        if (checked) {
            newPermissions = [...currentPermissions, PermissionId]
        } else {
            newPermissions = currentPermissions.filter(id => id !== PermissionId)
        }
        form.setValue('permissions', newPermissions)
    }
    // xóa tất tả quyền đã chọn
    const handleDeletePermission = () => {
        form.setValue('permissions', [], { shouldValidate: true })
    }
    // chọn tất cả quyền
    const handleAllPermission = () => {
        const allPermissionID = Object.values(permissionGroup).flatMap(module => module.permissions.map(permission => permission.id))
        form.setValue('permissions', allPermissionID, { shouldValidate: true })

    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                        <h2 className="mb-[20px] text-[20px] font-semibold uppercase">Chú ý</h2>
                        <p className="mb-[10px]">Nhập đầy đủ các thông tin bên dưới đây</p>
                        <p>Lưu ý: Các trường đánh dấu <span className="text-[#f00000]">(*)</span> là bắt buộc</p>
                    </div>
                    <div className="col-span-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <Card className="mb-[20px]">
                                    <CardHeader>
                                        <CardTitle>Thông tin chung</CardTitle>
                                        <CardDescription className="text-[#f00000]">Nhập đầy đủ các trường thông tin bên dưới</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tên nhóm thành viên</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="canonical"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Từ khóa</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-[20px]">
                                            <Button type="submit" className="text-[13px] font-light " > Lưu lại</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Phân quyền</CardTitle>
                                        <CardDescription className="text-[#f00000]">Chọn các quyền mà nhóm thành viên thực hiện. Nhấn vào tên module để xem chi tiết</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="justify-between flex mb-[10px]">
                                            <div className="text-sm text-blue-400">
                                                Đã chọn <span>{permissionCount.selected}</span>/<span>{permissionCount.total}</span>quyền
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button type="button"
                                                    onClick={handleDeletePermission}
                                                    variant="ghost"
                                                    className="text-sm font-light text-white cursor-pointer">Bỏ chọn tất cả
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleAllPermission}
                                                    variant="ghost"
                                                    className="text-sm font-light text-white bg-blue-800 cursor-pointer">
                                                    chọn tất cả
                                                </Button>
                                            </div>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="permissions"
                                            render={({ }) => (
                                                <FormItem>
                                                    <FormMessage className="mb-[20px]" />
                                                </FormItem>
                                            )}
                                        />
                                        <ScrollArea className="h-[400px] pr-[15px]">
                                            <Accordion type="multiple" className="w-full" defaultValue={["permission"]} >
                                                {Object.entries(permissionGroup).map(([moduleKey, module]) => (
                                                    <AccordionItem
                                                        value={moduleKey}
                                                        key={moduleKey}
                                                        className="border rounded-[10px] mb-[15px] data-[state=open]:pb-[15px]">
                                                        <div className="relative flex w-full">
                                                            <div className="absolute z-10 -translate-y-1/2 lext-4 top-1/2" onClick={(e) => e.stopPropagation()}>
                                                                <Checkbox
                                                                    id={`moduleKey:${moduleKey}`}
                                                                    className="rounded-sm size-4 ml-[5px]"
                                                                    checked={isModuleSelected(module.permissions)}
                                                                    onCheckedChange={(checked) => handleModulePermissionChange(module.permissions, checked === true)}>
                                                                </Checkbox>
                                                            </div>
                                                            <AccordionTrigger className="w-full px-4 py-3 pl-6 hover:bg-slate-50 rounded-t-md">
                                                                <Label htmlFor={`moduleKey- ${moduleKey}`} className="cursor-pointer text-blue font-nomal">
                                                                    {module.title}
                                                                </Label>
                                                            </AccordionTrigger>
                                                        </div>
                                                        <AccordionContent className="px-4 pt-2 pb-4">
                                                            <div className="grid grid-cols-3 gap-y-2">
                                                                {module.permissions.map((permission) => (
                                                                    <div className="flex items-center space-x-2" key={permission.id}>
                                                                        <Checkbox
                                                                            checked={selectedPermissions.includes(permission.id)}
                                                                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                                                                            id={`moduleKey-${permission.id}`}
                                                                            className="rounded-sm size-4 ">
                                                                        </Checkbox>
                                                                        <Label htmlFor={`moduleKey-${permission.id}`}
                                                                            className="text-sm font-normal">
                                                                            {permission.name}
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </form>
                        </Form>
                    </div>
                </div>
            </div >
        </>
    )
}

export default UserCatalogueSave