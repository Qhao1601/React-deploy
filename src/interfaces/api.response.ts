interface IbaseResponse {
    //status: number, // đã sữa ở dưới
    status: boolean,
    code: number,
    message: string,
    timestamp: string
}

export interface IApiSuccessResponse<T> extends IbaseResponse {
    data: T
}

export interface IApiErrorResponse<E> extends IbaseResponse {
    data: E
}

export interface IApiMessageResponse extends IbaseResponse {
    message: string
}

export type IApiResponse<T, E> = IApiSuccessResponse<T> | IApiErrorResponse<E> | IApiMessageResponse



// định nghĩa thêm cho biết IApiResponse là kiểu success chứ k phải Error

export const isApiSuccessResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiSuccessResponse<T> => {
    return Boolean(response && 'data' in response && response.status === true)
}
export interface invalidateError {
    status: boolean,
    code: number,
    messages: string,
    timestamp: string,
    errors: Record<string, string[]>
}