import { ApiErrorModel } from "@/models/api-error";
import { NextApiRequest, NextApiResponse } from "next";


const NotFound = (
    req: NextApiRequest,
    res: NextApiResponse<ApiErrorModel>) =>
{
    const route = Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug;
    res.status(404).send({ error: `Route /${route} not found.`, errors: {} });
};

export default NotFound;