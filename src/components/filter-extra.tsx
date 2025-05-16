import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

import { IFilterExtraProps, IFilterSelectConfig, ISelectOptionItem } from "@/config/constans"

const FilterExtra = ({ filters, onchange }: IFilterExtraProps) => {
    const [selectValues, setSelectValues] = useState<Record<string, string>>({})

    const handleValueChange = (filterId: string, value: string) => {
        const newSelectValues = {
            // sao chép dữ liệu củ
            ...setSelectValues,
            // lấy giá trị củ hoặc giá trị vừa cập nhật
            [filterId]: value
        }
        setSelectValues(newSelectValues)

        if (onchange) {
            onchange(filterId, value)
        }
    }
    // Tìm kiếm theo trạng thái
    return (
        <div className="flex items-center">
            {
                filters.map((filter: IFilterSelectConfig) => (
                    <div key={filter.id} className="mr-[10px]">
                        <Select
                            value={selectValues[filter.id || filter.defaultValues?.toString() || ""]}
                            onValueChange={(value) => handleValueChange(filter.id, value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options.map((option: ISelectOptionItem) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))
            }
        </div>
    )
}
export default FilterExtra