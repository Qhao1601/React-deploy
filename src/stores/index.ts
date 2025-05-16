import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"

import storage from "redux-persist/lib/storage";

import authenReducer from "./slices/authSlice";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["accessToken", "expiresAt", "isAuthenticated", "user", "isRefreshing"]
}

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authenReducer)
})

const rootPersistConfig = {
    key: "root",
    storage,
    blacklist: ["auth"]
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector