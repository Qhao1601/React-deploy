import { useState, useEffect } from "react"
import { IFilterSelectConfig } from "@/config/constans"
import { useSearchParams } from "react-router-dom"

// xử lý và truyền tham số qua index (cho gọn)

interface IUserTableProps {
    initiaFilters?: IFilterSelectConfig[],
    defauPerpage?: string,
}

export const useTable = ({ initiaFilters = [], defauPerpage = '20' }: IUserTableProps) => {

    const [searchParams, setSearchParams] = useSearchParams()

    const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
        const params: Record<string, string> = {
            page: searchParams.get('page') || "1",
            perpage: searchParams.get('perpage') || defauPerpage,
            keyword: searchParams.get('keyword') ?? ""
        }
        initiaFilters.forEach(filter => {
            const value = searchParams.get(filter.name)
            if (value) {
                params[filter.name] = value
            }
        })
        return params;

    })

    // bắn tìm kiếm dữ liệu lên đường dẫn url
    useEffect(() => {
        setSearchParams(queryParams)
    }, [queryParams, setSearchParams])


    // tìm kiếm keyword và trạng thái
    const handleFilterChange = (filters: Record<string, string>) => {
        setQueryParams((prevState) => ({
            ...prevState,
            ...filters,
            page: "1"
        }))
    }

    // sự kiến chuyển trang footer
    const handlePageChange = (page: number) => {
        setQueryParams((prevState) => ({
            ...prevState,
            page: page.toString()
        }))
    }





    return {
        queryParams,
        searchParams,
        setSearchParams,
        handleFilterChange,
        handlePageChange,
    }
}