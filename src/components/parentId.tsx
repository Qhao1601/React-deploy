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
import { ISelectOptionItem } from "@/config/constans"
import { Control, FieldValues, FieldPath } from "react-hook-form"
import React, { memo, ReactElement } from "react"


interface IParentComponent<T extends FieldValues = FieldValues> {
    control: Control<T, unknown>,
    name: FieldPath<T>,
    placeholder: string,
    data: ISelectOptionItem[],
}

const ParentComponent = <T extends FieldValues = FieldValues>(props: IParentComponent<T>): ReactElement => {

    const { control, name, placeholder, data } = props

    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">Danh mục cha</CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <div className="text-[#f00] text-[12px] mb-[10px]">* Chọn Root nếu không có danh mục cha</div>
                    <FormField
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data && data.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
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
        </>
    )
}
const Parent = memo(ParentComponent) as <T extends FieldValues = FieldValues>(props: IParentComponent<T>) => ReactElement

export default Parent