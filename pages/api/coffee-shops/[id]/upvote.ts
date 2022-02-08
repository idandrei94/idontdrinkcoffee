import { NextApiRequest, NextApiResponse } from "next";
import { LikeCoffeeShop } from "services/airtable_api";

const upvote = async (
    req: NextApiRequest,
    res: NextApiResponse<boolean>
) =>
{
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    return res.status(200).send(await LikeCoffeeShop(id));
};


export default upvote;