export interface IPermission {
    id: number,
    name: string,
    module: string,
    value: number,
    title: string,
    description: string,
    publish: number,
    createdAt: string
    userId: number[]

}


export interface IPermissionrRequest {
    name: string,
    module: string,
    value: number,
    title: string,
    description?: string,
    userId: number | undefined
}
