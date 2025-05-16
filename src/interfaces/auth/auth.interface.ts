import { IUser } from "@/interfaces/user/user.interface"

export interface ILoginResponse {
    accessToken: string,
    expiresAt: number,
    user: IUser
}
