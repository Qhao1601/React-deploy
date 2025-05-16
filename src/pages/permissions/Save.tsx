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
import { useCurd } from "@/hooks/useCrud";
import { IPermissionrRequest, IPermission } from "@/interfaces/permissions/user.interface";


const createSchema = z.object({
    name: z.string().min(1, { message: 'Từ khóa của quyền bắt buộc' }),
    title: z.string().min(1, { message: 'Tên quyền bắt buộc phải nhập' }),
    module: z.string().min(1, { message: 'Tên module bắt buộc phải nhập' }),
    description: z.string().optional(),
    value: z.number().min(1, { message: 'Giá trị quyền bắt buộc phải nhập' }),
})
const formConfig = {
    schema: createSchema,
    defaultValues: {
        name: '',
        title: '',
        module: '',
        description: '',
        value: 0,
    },
    createTitle: 'Thêm mới quyền',
    updateTitle: 'Chỉnh sửa thành viên',
    endpoint: '/api/v1/permissions',
    routerIndex: '/permissions',
    mapToRequest: (values: {
        name: string,
        title: string,
        module: string,
        description?: string,
        value: number,
    }, userId?: number): IPermissionrRequest => ({
        ...values,
        userId
    })
}

export type TFromValues = z.infer<typeof formConfig.schema>

const PermissionsSave = () => {
    const { onSubmit, form } = useCurd<IPermission, IPermissionrRequest, TFromValues>(formConfig)

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
                        <Card className="rounded-[5px]">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Thông tin chung</CardTitle>
                                        <CardDescription className="text-[#f00000]">Nhập đầy đủ các trường thông tin bên dưới</CardDescription>
                                    </div>


                                </div>

                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Từ khóa quyền</FormLabel>
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
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tên quyền</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="module"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Module </FormLabel>
                                                            <FormControl>
                                                                <Input autoComplete=""{...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="value"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Giá trị quyền</FormLabel>
                                                            <FormControl>
                                                                <Input autoComplete=""  {...field}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                                                        field.onChange(value)
                                                                    }} />
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
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        </>
    )
}

export default PermissionsSave