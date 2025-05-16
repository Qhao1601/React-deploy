import { IUser } from "@/interfaces/user/user.interface"


export interface IUserCatalogue {
    id: number,
    name: string,
    canonical: string,
    publish: number,
    userId: number,
    users: IUser[],
    users_count: number,
    permissions: number[],

}

export interface IUserCatalogueRequest {
    name: string,
    canonical: string,
    userId: number | undefined
    permissions: number[] | undefined
}