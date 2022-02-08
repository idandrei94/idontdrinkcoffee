import { Shop } from "@/models/shop";
import axios from "axios";

export const GetCoffeeShops = async (latLong: string, limit: number): Promise<Shop[]> =>
{
    return await axios
        .get<{ shops: Shop[]; }>(
            `/api/coffee-shops/getCoffeeShopsByLocation/?latLong=${latLong
            }&limit=${limit}`
        ).then(res => res.data.shops)
        .catch(err =>
        {
            if (err.response)
            {
                throw (err.response.data);
            } else
            {
                throw (err);
            }
        });
};

export const GetCoffeeShopById = async (id: string): Promise<Shop> =>
{
    return await axios
        .get<Shop>(
            `/api/coffee-shops/${id}`
        ).then(res => res.data)
        .catch(err =>
        {
            if (err.response)
            {
                throw (err.response.data);
            } else
            {
                throw (err);
            }
        });
};

export const upvoteCoffeeShop = async (id: string) =>
{
    return await axios
        .get<boolean>(
            `/api/coffee-shops/${id}/upvote`
        ).then(res => res)
        .catch(err =>
        {
            if (err.response)
            {
                throw (err.response.data);
            } else
            {
                throw (err);
            }
        });
};