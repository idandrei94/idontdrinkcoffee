import { ApiErrorModel } from "@/models/api-error";
import FoursquareError from "@/models/foursquare-error";
import { Shop } from "@/models/shop";
import { NextApiRequest, NextApiResponse } from "next";
import { GetCoffeeShops } from "services/foursquare_api";
import { getCoffeeShopsValidation } from "validation/getCoffeeShopsValidation";



interface Response
{
    shops: Shop[];
}

const getCoffeeShopsByLocation = async (
    req: NextApiRequest,
    res: NextApiResponse<Response | ApiErrorModel>) =>
{
    const latLong = Array.isArray(req.query.latLong) ? req.query.latLong[0] : req.query.latLong;
    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    if (!process.env.FOURSQUARE_API_KEY)
    {
        return res.status(500).send({ error: "Unexpected error.", errors: {} });
    }
    else 
    {
        const validationErrors = getCoffeeShopsValidation(latLong);
        if (!!Object.keys(validationErrors).length)
        {
            return res.status(400).send({
                error: "Invalid request parameters.", errors: validationErrors
            });
        }
        else
        {
            try
            {
                const data = await GetCoffeeShops(
                    process.env.FOURSQUARE_API_KEY,
                    latLong,
                    'coffee',
                    Number.parseInt(limit) as number || 5
                );
                return res.status(200).send({
                    shops: data
                });
            } catch (ex)
            {
                console.log('Error: ', (ex as FoursquareError)?.response?.data || ex);
                return res.status(500)
                    .send({
                        error: "Unexpected error when loading coffee shop data",
                        errors: {}
                    });
            }
        }
    }
};

export default getCoffeeShopsByLocation;