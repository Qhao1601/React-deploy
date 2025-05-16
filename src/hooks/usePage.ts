import { IConfigModule } from "@/pages/users/catalogue/Index"
import useApi from "./useApi"
import { useDashboard } from "@/pages/dashboard/Layout"
import { useTable } from "./useTable"
import { IPaginate } from "@/interfaces/paginate.response"
import { useMemo, useLayoutEffect, useEffect } from "react"
import { isApiSuccessResponse } from "@/interfaces/api.response"
import { useSwitch } from "./useSwitch"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"


export interface IUsePage<T> {
    config: IConfigModule<T>,
}

export const usePage = <TData extends { id: number }>({ config }: IUsePage<TData>) => {
    const queryClient = useQueryClient()
    const api = useApi()
    const { setHeading } = useDashboard()

    const { endpoint, title, description, createLink, extraFilters, columns, fields } = config

    const { queryParams, handleFilterChange, handlePageChange } = useTable({ initiaFilters: extraFilters, })

    // gọi api
    const patchUpdateMutation = api.usePatchUpdate<TData, Record<string, number>>(endpoint)

    const { data: records, isLoading } = api.usePagiante<IPaginate<TData>>(endpoint, queryParams)

    const deleteMutation = api.useDelete(endpoint)


    const tableItems = useMemo(() => {
        if (records && 'data' in records && isApiSuccessResponse(records)) {
            return records.data.data
        }
        return []
    }, [records])

    const { switchStates, handleSwitchChange } = useSwitch<TData>({
        items: tableItems,
        patchUpdateMutation,
        fields: fields,
        endpoint: endpoint
    })


    const memoziedFilterCommonProps = useMemo(() => ({
        extraFilters,
        onFilterChange: handleFilterChange
    }),
        [handleFilterChange, extraFilters]
    )

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: ((response) => {
                if (response.status === true) {
                    toast.success("Xóa bản ghi thành công")
                    queryClient.invalidateQueries({ queryKey: [endpoint] })
                }
            }),
            onError: () => {
                toast.error("Xóa bản ghi thất bại")
            }
        })
    }

    useLayoutEffect(() => {
        setHeading(title)
    }, [setHeading])


    return {
        endpoint,
        title,
        description,
        createLink,
        extraFilters,
        columns,
        queryParams,
        memoziedFilterCommonProps,
        switchStates,
        isLoading,
        tableItems,
        records,
        handleFilterChange,
        handlePageChange,
        handleSwitchChange,
        handleDelete
    }
}