export interface IUser {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    birthday: string,
    image: string,
    publish: number,
    userCatalogues: number[],
    permissions: string[]

}
// export type IUserWithoutPassword = Omit<IUser, 'password' | 'confirmPassword'>

export interface IUserRequest {
    name: string,
    email: string,
    password?: string,
    confirmPassword?: string,
    phone: string,
    address: string,
    birthday: string
    image?: File,
    publish?: number,
    userId: number | undefined,
}
