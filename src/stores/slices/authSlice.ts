import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ILoginResponse } from "@/interfaces/auth/auth.interface"
import { IUser } from "@/interfaces/user/user.interface"



interface IAuthState {
    accessToken: string | null,
    expiresAt: number | null,
    isAuthenticated: boolean,
    user: IUser | null,
    isRefreshing: boolean
}

const initialState: IAuthState = {
    accessToken: null,
    expiresAt: null,
    isAuthenticated: false,
    user: null,
    isRefreshing: false

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<ILoginResponse>) => {
            state.accessToken = action.payload.accessToken
            state.expiresAt = Date.now() + (action.payload.expiresAt * 1000) // số giây chuyển mili giấy + thời gian hiện tại
            state.isAuthenticated = true
            state.user = action.payload.user
        },

        logout: (state) => {
            state.accessToken = null
            state.expiresAt = null
            state.isAuthenticated = false
            state.user = null,
                state.isRefreshing = false
        },

        setRefreshing: (state, action) => {
            state.isRefreshing = action.payload
        }

    }
})

export const { setAuth, logout, setRefreshing } = authSlice.actions;
export default authSlice.reducer