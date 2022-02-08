import { Shop } from "@/models/shop";
import React from "react";
import { Dispatch } from "react";

interface AppState
{
    latLong: string | undefined;
    shops: Shop[];
}

type Action =
    | { type: 'SET_SHOPS'; payload: Shop[]; }
    | { type: 'SET_LATLONG'; payload: string | undefined; };

export const DefaultState: AppState = {
    latLong: undefined,
    shops: []
};

export const ShopReducer = (state: AppState, action: Action): AppState =>
{
    switch (action.type)
    {
        case 'SET_LATLONG':
            return { ...state, latLong: action.payload };
        case 'SET_SHOPS':
            return { ...state, shops: action.payload };

        default:
            throw new Error('Invalid Action type');
    }
};

export const ShopContext = React.createContext<{
    state: AppState;
    dispatch: Dispatch<Action>;
}>({
    state: DefaultState,
    dispatch: (_) => { }
});