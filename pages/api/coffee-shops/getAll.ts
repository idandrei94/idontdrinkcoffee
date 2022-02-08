import { Shop } from "@/models/shop";
import { NextApiRequest, NextApiResponse } from "next";
import { GetCoffeeShops } from "services/airtable_api";

const getCoffeeShops = async (
    req: NextApiRequest,
    res: NextApiResponse<Shop[]>) =>
{
    return res.status(200).send(await GetCoffeeShops());
};

export default getCoffeeShops;