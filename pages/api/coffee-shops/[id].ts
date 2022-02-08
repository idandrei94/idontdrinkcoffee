import { ApiErrorModel } from "@/models/api-error";
import { Shop } from "@/models/shop";
import { NextApiRequest, NextApiResponse } from "next";
import { GetCoffeeShopById } from "services/airtable_api";

const getCoffeeShopById = async (
    req: NextApiRequest,
    res: NextApiResponse<Shop | null | ApiErrorModel>
) =>
{
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    try
    {
        const shop = await GetCoffeeShopById(id);
        return res.status(200).send(shop);
    } catch (err: any)
    {
        res.status(500).send({
            error: err?.toString(), errors: {}
        });
    }
};

export default getCoffeeShopById;