import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, UseFormReturn, useWatch, Path, FieldValues } from "react-hook-form"
import { ReactElement, useEffect, useState } from "react"
import { toSlug } from "@/utils/helper"
import { memo } from "react"
// interface seoFormValue {
//     name: string,
//     metaTitle?: string,
//     metaKeyword?: string,
//     metaDescription?: string,
//     canonical: string
// }

interface ISeo<T extends FieldValues = FieldValues> {

    control: Control<T>,
    defaultUrl?: string
}
const SeoComponent = <T extends FieldValues>(props: ISeo<T>): ReactElement => {
    const { control, defaultUrl = "http:/Shoppe/" } = props

    const [seoPreview, setSeoPreview] = useState<{ metaTitle: string, metaDescription: string, fullUrl: string }>({
        metaTitle: '',
        metaDescription: '',
        fullUrl: ''
    })

    const name = useWatch({
        control,
        name: 'name' as Path<T>
    })

    const metaDescription = useWatch({
        control,
        name: 'metaDescription' as Path<T>
    })

    const metaTitle = useWatch({
        control,
        name: 'metaTitle' as Path<T>
    })

    const canonical = useWatch({
        control,
        name: 'canonical' as Path<T>
    })

    const metaTitleField = 'metaTitle' as Path<T>
    const metaKeywordField = 'metaKeyword' as Path<T>
    const metaDescriptionField = 'metaDescription' as Path<T>
    const CanonicalField = 'canonical' as Path<T>


    useEffect(() => {
        setSeoPreview(prev => ({
            ...prev,
            metaTitle: metaTitle || name || '',
            metaDescription: metaDescription || '',
            fullUrl: canonical ? `${defaultUrl} ${toSlug(canonical)}.html` : defaultUrl
        }))
    }, [metaTitle, metaDescription, canonical, name, defaultUrl])

    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">
                        Cấu hình SEO
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <div className="seoPreview mb-[20px]">
                        <div className="text-[blue] font-normal text-[20px] mb-[5px]">
                            {seoPreview.metaTitle || "Bạn chưa nhập vào tiêu đề SEO"}
                        </div>
                        <div className="text-[green] font-normal text-[16px] mb-[5px]">
                            {seoPreview.metaDescription || "http://abc.com/test.html"}
                        </div>
                        <div className="text-gray-700">
                            {seoPreview.fullUrl || " Bạn chưa nhập vào mô tả SEO"}
                        </div>
                    </div>
                    <FormField
                        control={control}
                        name={metaTitleField}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề SEO</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={metaKeywordField}
                        render={({ field }) => (
                            <FormItem className="mt-[12px]">
                                <FormLabel>Từ khóa SEO</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={metaDescriptionField}
                        render={({ field }) => (
                            <FormItem className="mt-[12px] w-full">
                                <FormLabel>Mô tả SEO</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="h-[168px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={CanonicalField}
                        render={({ field }) => (
                            <FormItem className="mt-[12px] w-full">
                                <FormLabel>Đường dẫn</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </>
    )
}

const Seo = memo(SeoComponent) as <T extends FieldValues = FieldValues> (props: ISeo<T>) => ReactElement

export default Seo