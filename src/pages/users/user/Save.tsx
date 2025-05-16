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
import { IUser } from "@/interfaces/user/user.interface";
import { useCurd } from "@/hooks/useCrud";
import { MultiSelect } from "@/components/multi-select";
import { useEffect, useMemo, useState } from "react";
import useApi from "@/hooks/useApi";
import { IUserCatalogue } from "@/interfaces/user/user-catalogue.interface";
import { isApiSuccessResponse } from "@/interfaces/api.response";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from "react-router-dom";
const createSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhóm là bắt buộc' }),
    email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Email không đúng định dạng' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có tối thiểu 6 kí tự' }),
    confirmPassword: z.string().min(6, { message: 'Bạn phải xác nhận mật khẩu của mình' }),
    address: z.string().min(1, { message: 'Bạn phải nhập vào địa chỉ' }),
    birthday: z.string().min(1, { message: 'Bạn phải nhập vào ngày sinh' }),
    image: z.instanceof(File, { message: 'Bạn chưa chọn ảnh đại diện' }),
    phone: z.string().min(1, { message: 'Bạn phải nhập vào số điện thoại' }),
    userCatalogues: z.array(z.number()).min(1, { message: "Bạn chưa chọn nhóm thành viên" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không chính xác",
    path: ['confirmPassword']
})


const updateSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhóm là bắt buộc' }),
    email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Email không đúng định dạng' }),
    address: z.string().min(1, { message: 'Bạn phải nhập vào địa chỉ' }),
    birthday: z.string().min(1, { message: 'Bạn phải nhập vào ngày sinh' }),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    phone: z.string().min(1, { message: 'Bạn phải nhập vào số điện thoại' }),
    userCatalogues: z.array(z.number()).min(1, { message: "Bạn chưa chọn nhóm thành viên" })
})

const formConfig = (isUpdateMode: boolean) => ({
    schema: isUpdateMode ? updateSchema : createSchema,
    defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        birthday: '',
        image: undefined,
        phone: '',
        userCatalogues: []
    },
    createTitle: 'Thêm mới thành viên',
    updateTitle: 'Update thành viên',
    endpoint: '/api/v1/users',
    routerIndex: '/users',
    mapToRequest: (values: {
        name: string,
        email: string,
        password?: string,
        confirmPassword?: string,
        address: string,
        phone: string,
        birthday: string,
        image?: File | undefined | null,
        userCatalogues: number[]
    }, userId?: number): FormData => {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        if ('password' in values && 'confirmPassword' in values && values.password && values.confirmPassword) {
            formData.append('password', values.password)
            formData.append('confirmPassword', values.confirmPassword)
        }
        formData.append('address', values.address)
        formData.append('phone', values.phone)
        formData.append('birthday', values.birthday)

        // values.userCatalogues.forEach((CatalogueId: number) => {
        //     formData.append('user_catalogues[]', CatalogueId.toString())
        // })
        values.userCatalogues.forEach((catalogueId: number, index: number) => {
            formData.append(`userCatalogues[${index}]`, catalogueId.toString())
        })
        if (values.image instanceof File) {
            formData.append('image', values.image)
        }
        if (isUpdateMode) {
            formData.append('_method', 'PUT')
        }

        if (userId) {
            formData.append('user_id', userId.toString())
        }
        return formData
    }
})
export type TFromValues = z.infer<typeof createSchema> | z.infer<typeof updateSchema>

const UserCatalogueSave = () => {
    const api = useApi()
    const { data: userCatalogues } = api.usePagiante<IUserCatalogue[]>('api/v1/user_catalogues', { type: 'all' })
    const { id } = useParams();
    const isUpdateMode = !!id
    const { onSubmit, form, record, recordIsLoading } = useCurd<IUser, FormData, TFromValues>(formConfig(isUpdateMode))
    // xử lý select mutiple
    const [multipleSelectKey, setMultipleSelectKey] = useState<number>(0)
    const [selectedUserCatalogues, setSelectedUserCatalogues] = useState<string[]>([]);
    // XỬ LÝ NHÓM THÀNH VIÊN
    const userCatalogueOptions = useMemo(() => {
        if (!userCatalogues) return []
        if (isApiSuccessResponse(userCatalogues)) {
            return userCatalogues.data.map((item) => ({
                value: item.id.toString(),
                label: item.name
            }))
        }
        return []
    }, [userCatalogues])

    useEffect(() => {
        if (isApiSuccessResponse(record) && record.data && record.data.userCatalogues && !recordIsLoading && Array.isArray(record.data.userCatalogues)) {
            const userCataloguesId = record.data.userCatalogues.map((id: number) => id.toString())
            setSelectedUserCatalogues(userCataloguesId)
            setMultipleSelectKey((prev) => prev + 1)
            const formData = {
                ...record.data,
                image: undefined,
            }

            form.reset(formData)
        }
    }, [record, recordIsLoading, isUpdateMode, form])


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
                                    <Avatar className="w-[50px] h-[50px]">
                                        {record && isApiSuccessResponse(record) && <AvatarImage src={record.data.image} alt="CN" />}
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

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
                                                            <FormLabel>Tên thành viên</FormLabel>
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
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        {!isUpdateMode && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <FormField
                                                        control={form.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Mật khẩu</FormLabel>
                                                                <FormControl>
                                                                    <Input autoComplete="" type="password" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <FormField
                                                        control={form.control}
                                                        name="confirmPassword"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nhập lại mật khẩu</FormLabel>
                                                                <FormControl>
                                                                    <Input autoComplete="" type="password" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Địa chỉ</FormLabel>
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
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Số điện thoại</FormLabel>
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
                                                    name="birthday"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Ngày sinh</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="image"
                                                    render={({ field: { onChange, ref } }) => (
                                                        <FormItem>
                                                            <FormLabel>Ảnh đại diện</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    id="image"
                                                                    type="file"
                                                                    ref={ref}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : undefined;
                                                                        onChange(file);
                                                                    }}
                                                                />
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
                                                    name="userCatalogues"
                                                    render={({ field: { onChange } }) => (
                                                        <FormItem>
                                                            <FormLabel>Chọn nhóm thành viên</FormLabel>
                                                            <FormControl>
                                                                <MultiSelect
                                                                    key={multipleSelectKey}
                                                                    options={userCatalogueOptions}
                                                                    onValueChange={(values) => {
                                                                        setSelectedUserCatalogues(values)
                                                                        onChange(values.map(val => Number(val)))
                                                                    }}
                                                                    defaultValue={selectedUserCatalogues}
                                                                    placeholder="Chọn nhóm thành viên"
                                                                    variant="inverted"
                                                                    animation={2}
                                                                    maxCount={3}
                                                                />
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

export default UserCatalogueSave