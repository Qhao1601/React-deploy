import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import * as z from "zod"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth"
import { useDashboard } from "@/pages/dashboard/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { isApiSuccessResponse } from "@/interfaces/api.response";
import { toast } from "sonner";
import { useEffect, useLayoutEffect } from "react";
import { AxiosError } from "axios";
import { invalidateError } from "@/interfaces/api.response";
import { useQueryClient } from "@tanstack/react-query";
import { Console } from "console";

export interface ICrudConfig<TRequest, TFormValues> {
    schema: z.ZodSchema<TFormValues>,
    defaultValues: DefaultValues<TFormValues>,
    endpoint: string,
    createTitle: string,
    updateTitle: string,
    routerIndex: string,
    mapToRequest: (values: TFormValues, userId?: number) => TRequest,

}

export const useCurd = <TData, TRequest, TFormValues extends FieldValues>(config: ICrudConfig<TRequest, TFormValues>) => {
    const { schema, defaultValues, endpoint, createTitle, updateTitle, routerIndex, mapToRequest } = config

    const { id } = useParams()
    const navigate = useNavigate()
    const api = useApi()
    const { auth } = useAuth()
    const isUpdateMode = !!id
    const title = isUpdateMode ? updateTitle : createTitle
    const modeId = id ? Number(id) : 0
    const { setHeading } = useDashboard()
    const createMution = api.useCreate<TData, TRequest>(endpoint)

    const updateMution = api.useUpdate<TData, TRequest>(endpoint, modeId)
    const useUpdatePost = api.useUpdatePost<TData, TRequest>(endpoint, modeId)
    const { data: record, isLoading: recordIsLoading } = api.useShow<TData>(endpoint, modeId, { enabled: modeId !== 0 })
    const queryClient = useQueryClient()



    const form = useForm<TFormValues>({
        resolver: zodResolver(schema),
        defaultValues
    })

    // xử lý trả về lổi sai
    const handleError = (error: unknown) => {
        // kiểm tra error có trong lổi AxiosError không và có phải lổi 422 không
        if (error instanceof AxiosError && error.response?.status === 422) {
            // ép kiểu lấy dữ liệu về invalidateError 
            const errorData = error.response.data as invalidateError
            // kiểm tra error data có không và trong errorData có errors không
            if (errorData && errorData.errors) {
                // chuyển Object.entries Errors thành mảng cặp key và values
                const errorMessages = Object.entries(errorData.errors).map(([field, message]) => {
                    // lấy kí tự đầu của field (Canonical) sau đó cắt chuỗi bỏ kí tự đầu và nối lại
                    const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
                    // kết hợp 2 mảng về 1 chuỗi bởi 
                    return `${fieldName}: ${(message as string[]).join(", ")}`
                }).join(";")
                toast.error(`Lổi: ${errorMessages}`)
            } else {
                toast.error('Dữ liệu không đúng định dạng')
            }
        } else {

            toast.error('Có lổi xảy ra trong quá trình thao tác. Hãy thử lại sau')
        }
    }


    const onSubmit = (values: TFormValues) => {
        const requestData: TRequest = mapToRequest(values, auth?.id)

        if (isUpdateMode) {
            if (!(requestData instanceof FormData)) {
                updateMution.mutate(requestData, {
                    onSuccess: ((response) => {
                        if (isApiSuccessResponse(response)) {
                            console.log(response)
                            toast.success('Update bản ghi thành công')
                            navigate(routerIndex)
                        } else {
                            toast.warning('update bản ghi thất bại,vui lòng thử lại')
                        }
                    }),
                    onError: (error) => {
                        handleError(error)
                    }
                })
            } else {
                useUpdatePost.mutate(requestData, {
                    onSuccess: ((response) => {
                        if (isApiSuccessResponse(response)) {

                            toast.success('Update bản ghi thành công')
                            navigate(routerIndex)
                        } else {
                            toast.warning('update bản ghi thất bại,vui lòng thử lại')
                        }
                    }),
                    onError: (error) => {
                        handleError(error)
                    }
                })
            }
        } else {
            createMution.mutate(requestData, {
                onSuccess: ((response) => {
                    console.log(requestData)
                    if (isApiSuccessResponse(response)) {
                        toast.success('Thêm bản ghi mới thành công')
                        queryClient.invalidateQueries({ queryKey: [endpoint] }) // làm mới lại dữ liệu trong bảng
                        navigate(routerIndex)
                    } else {
                        toast.warning('Thêm bản ghi thất bại,vui lòng thử lại')
                    }
                }),
                onError: (error) => {
                    handleError(error)
                }
            })
        }

    }

    // mai sữa lại chổ này

    // useEffect(() => {
    //     if (record && isApiSuccessResponse(record) && isUpdateMode) {
    //         form.reset(record.data as unknown as TFormValues)
    //     }
    // }, [form, record, isUpdateMode])



    // useEffect(() => {
    //     if (form.formState.errors) {
    //         console.log(form.formState.errors)
    //     }
    // }, [form.formState.errors])



    useLayoutEffect(() => {
        setHeading(title)
    }, [setHeading, title])


    return {
        form,
        onSubmit,
        isUpdateMode,
        title,
        record,
        recordIsLoading
    }
}