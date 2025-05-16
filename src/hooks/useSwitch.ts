import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce"
import { UseMutationResult } from "@tanstack/react-query";
import { IApiResponse } from "@/interfaces/api.response";
import { useQueryClient } from "@tanstack/react-query";


interface IUseSwitchProps<T> {
    items: T[] | undefined,
    patchUpdateMutation: UseMutationResult<IApiResponse<T, unknown>, Error, { id: number, payload: Record<string, number> }, unknown>
    fields: (keyof T)[],
    activeValue?: number,
    inActiveValue?: number,
    endpoint?: string,
}

export const useSwitch = <T extends { id: number }>({
    items,
    patchUpdateMutation,
    fields,
    activeValue = 2,
    inActiveValue = 1,
    endpoint
}: IUseSwitchProps<T>) => {
    const [switchStates, setSwitchSates] = useState<Record<string, Record<number, boolean>>>({})
    const debounceFn = useMemo(() => debounce((callBack: () => void) => callBack()), [])
    const queryClient = useQueryClient()
    useEffect(() => {
        if (items && items.length && fields.length) {
            setSwitchSates((prev) => {
                const newSwitchStates: Record<string, Record<number, boolean>> = {}
                let hasChange = false
                fields.forEach((field) => {
                    newSwitchStates[field as string] = {}
                    items.forEach((item: T) => {
                        if (!(field in prev) || !(item.id in prev[field as string])) {
                            const status = item[field] as unknown as number
                            const newValue = status === activeValue
                            newSwitchStates[field as string][item.id] = newValue
                            if (prev[field as string]?.[item.id] !== newValue) {
                                hasChange = true
                            }
                        }
                    })
                })
                return hasChange ? { ...prev, ...newSwitchStates } : prev
            })
        }
    }, [items, fields, activeValue])

    const handleSwitchChange = useCallback(
        (id: number, currentValue: number, field: string) => {
            const newValue = currentValue === activeValue ? inActiveValue : activeValue

            setSwitchSates((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [id]: newValue === activeValue
                }
            }))
            const previousSwitchStates = { ...switchStates }
            debounceFn(() => {
                patchUpdateMutation.mutate(
                    {
                        id,
                        payload: { [field]: newValue }
                    },
                    {
                        onSuccess: (response: { status: boolean }) => {
                            if (!response.status) {
                                setSwitchSates(previousSwitchStates)
                            }
                            queryClient.invalidateQueries({ queryKey: [endpoint] })
                        },
                        onError: () => {
                            setSwitchSates(previousSwitchStates)
                        }
                    }
                )
            })
        }, [patchUpdateMutation, switchStates, debounceFn, activeValue, inActiveValue, queryClient, endpoint]
    )

    return {
        switchStates,
        handleSwitchChange
    }
}