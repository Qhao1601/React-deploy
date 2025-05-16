import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Publish, IPublish } from "@/config/constans";
import FilterExtra from "./filter-extra";
import { IFilterSelectConfig } from "@/config/constans";
import { memo, useState } from "react";
import { Perpage } from "@/components/perpage"

interface IFilterExtraProps {
    onFilterChange: (filters: Record<string, string>) => void
    extraFilters?: IFilterSelectConfig[]
}

const FilterCommon = ({ onFilterChange, extraFilters }: IFilterExtraProps) => {

    const [keyword, setKeyword] = useState<string>("")
    const [filterValues, setFilterValues] = useState<Record<string, string>>({})

    const handleSearch = () => {
        const filters: Record<string, string> = { ...filterValues }
        if (keyword)
            filters.keyword = keyword
        onFilterChange(filters)
    }

    const handFilterChange = (filterId: string, value: string) => {
        setFilterValues((prevState) => ({
            ...prevState,
            [filterId]: value
        }))
    }

    return (
        <>
            <div className="flex">
                <div className="mr-[10px]">
                    <Perpage />
                </div>
                {extraFilters && extraFilters.length > 0 && (
                    <FilterExtra
                        filters={extraFilters}
                        onchange={handFilterChange} />
                )}
                <div className="flex items-center w-full max-w-sm space-x-2">
                    <Input
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        type="text" placeholder="Nhập từ khóa muốn tìm kiếm " className="text-[8px] w-[250px]" />
                    <Button onClick={handleSearch}
                        type="submit" className="rounded-[5px] cursor-pointer bg-[#0088FF] font-light">Tìm kiếm</Button>
                </div>
            </div>
        </>
    );
}
export default memo(FilterCommon)