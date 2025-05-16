import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useCurd } from "@/hooks/useCrud";
import { IPostCatalogue, IPostCatalogueRequest } from "@/interfaces/post/post-catalogues.interface";
import CKEditorComponent from "@/components/editor"
import { Publish } from "@/config/constans"
import Seo from "@/components/seo"
import Album from "@/components/album"
import useApi from "@/hooks/useApi"
import { data, useParams } from "react-router-dom"
import { useEffect, useMemo, useRef } from "react"
import { isApiSuccessResponse } from "@/interfaces/api.response"
import Parent from "@/components/parentId"




const createSchema = z.object({
    name: z.string().min(1, { message: 'Từ khóa của quyền bắt buộc' }),
    parentId: z.string().min(1, { message: 'Bạn phải chọn danh mục cha, không có danh mục cha thì vui lòng chọn root' }),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    publish: z.string().min(1, { message: "Bạn phải chọn trạng thái" }),
    description: z.string().optional(),
    content: z.string().optional(),
    metaTitle: z.string().optional(),
    metaKeyword: z.string().optional(),
    metaDescription: z.string().optional(),
    canonical: z.string().min(1, { message: "Bạn phải nhập đường dẫn" }),
    album: z.array(z.instanceof(File)).optional(),
    removeImages: z.array(z.string()).optional()
})
const formConfig = (isUpdateMode: boolean) => ({
    schema: createSchema,
    defaultValues: {
        name: '',
        parentId: '0',
        image: undefined,
        publish: '2',
        description: '',
        content: '',
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        canonical: '',
        album: []
    },
    createTitle: 'Thêm mới nhóm bài viết',
    updateTitle: 'Chỉnh sửa nhóm bài viết',
    endpoint: '/api/v1/post_catalogues',
    routerIndex: '/post_catalogues',
    mapToRequest: (values: {
        name: string,
        parentId: string,
        publish: string,
        description?: string,
        content?: string,
        metaTitle?: string,
        metaKeyword?: string,
        metaDescription?: string,
        canonical: string,
        image?: File | undefined | null,
        album?: File[],
        removeImages?: string[]

    }, userId?: number): IPostCatalogueRequest => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'image' || key === 'album' || key === 'removeImages') {
                return
            }
            if (value !== undefined && value !== null) {
                formData.append(key, value?.toString())
            }
        })

        if (values.image instanceof File && values.image !== undefined) {
            formData.append('image', values.image)
        }
        if (values.album && Array.isArray(values.album) && values.album.length > 0) {
            values.album.forEach((file, index) => {
                formData.append(`album[${index}]`, file)
            })
        }

        if (values.removeImages && Array.isArray(values.removeImages) && values.removeImages.length > 0) {
            values.removeImages.forEach(($path, index) => {
                formData.append(`removeImages[${index}]`, $path)
            })
        }

        if (isUpdateMode) {
            formData.append('_method', 'PUT')
        }

        if (userId) formData.append('userId', userId.toString())
        return formData as unknown as IPostCatalogueRequest

    }
})

export type TFromValues = z.infer<typeof createSchema>

const PostCataloguesSave = () => {

    const api = useApi()
    const { id } = useParams()
    const isUpdateMode = !!id
    const parentCategory = api.usePagiante('/api/v1/post_catalogues', { sort: 'lft, asc', type: 'all' })
    const { onSubmit, form, record } = useCurd<IPostCatalogue, IPostCatalogueRequest, TFromValues>(formConfig(isUpdateMode))
    const formResetRef = useRef<boolean>(false)


    const ParentCategoriOptions = useMemo(() => {
        if (parentCategory && isApiSuccessResponse(parentCategory.data)) {
            const CategoryData = parentCategory.data.data as IPostCatalogue[]
            return [
                { label: "Chọn tất cả", value: "0" },
                ...CategoryData.map((item) => ({
                    value: item.id.toString(),
                    label: `${"|---".repeat(item.level > 0 ? item.level - 1 : 0)}${item.name}`
                }))
            ]
        }
        return []
    }, [parentCategory])

    useEffect(() => {
        if (isApiSuccessResponse(record) && !formResetRef.current && isUpdateMode) {
            const formData = {
                ...record.data,
                image: undefined,
                parentId: record.data.parentId.toString() || '0',
                publish: record.data.publish.toString() || '2',
                album: [] as File[],
                removeImages: [] as string[]
            }
            setTimeout(() => {
                form.reset(formData as unknown as TFromValues)
                formResetRef.current = true
            }, 100)
        }
    }, [record, isUpdateMode, form])



    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                                {ParentCategoriOptions.length && <Parent name="parentId" placeholder="Chọn danh mục cha" control={form.control} data={ParentCategoriOptions} />}
                                <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                                    <CardHeader className="border-b pt-[0px] custom-padding">
                                        <CardTitle className="font-normal uppercase">Ảnh đại diện</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-[15px]">
                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({ field: { ref, onChange } }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                                            <Input id="image" type="file"
                                                                ref={ref}
                                                                onChange={(e) => {
                                                                    const files = e.target.files && e.target.files.length > 0 ? e.target.files[0] : undefined
                                                                    onChange(files)
                                                                }}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {isApiSuccessResponse(record) && <div className="h-[280px] mt-[10px]"><img className="object-cover size-full " src={record.data.image} alt="" /></div>}
                                    </CardContent>
                                </Card>
                                <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                                    <CardHeader className="border-b pt-[0px] custom-padding">
                                        <CardTitle className="font-normal uppercase">Cấu hình nâng cao</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-[15px]">
                                        <FormField
                                            control={form.control}
                                            name="publish"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Chọn trạng thái" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Publish && Publish.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-9">
                                <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                                    <CardHeader className="border-b pt-[0px] custom-padding">
                                        <CardTitle className="font-normal uppercase">Thông tin chung</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-[15px]">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-[20px]">
                                                            <FormLabel>Tiêu đề</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-[20px]">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mô tả ngắn</FormLabel>
                                                            <FormControl>
                                                                <CKEditorComponent className="description" onChange={field.onChange} value={field.value || ''} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="content"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nội dung</FormLabel>
                                                            <FormControl>
                                                                <CKEditorComponent className="content" onChange={field.onChange} value={field.value || ''} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Album data={isApiSuccessResponse(record) ? record.data.album : []} />
                                <Seo control={form.control} />
                                <div className="mt-[10px] flex justify-end ">
                                    <Button>Lưu lại</Button>
                                </div>
                            </div>
                        </div>
                    </div >
                </form>
            </Form>
        </>
    )
}

export default PostCataloguesSave