import { Shop } from "@/models/shop";
import Airtable, { FieldSet, Record } from 'airtable';

export const GetCoffeeShops = async (): Promise<Shop[]> =>
{
    return await new Promise((resolve, reject) =>
    {
        const base = getAirtableConnector();
        const data: Shop[] = [];
        base('coffee shops')
            .select({
                view: "Grid view"
            })
            .eachPage(
                (records, fetchNextPage) =>
                {
                    records.forEach(
                        record =>
                        {
                            data.push(
                                {
                                    id: record.getId(),
                                    squareId: getFieldByName<string>('squareId', record),
                                    address: getFieldByName<string>('address', record),
                                    city: getFieldByName<string>('city', record),
                                    distance: getFieldByName<number>('distance', record),
                                    imgUrl: getFieldByName<string>('imgUrl', record),
                                    name: getFieldByName<string>('name', record),
                                    neighbourhood: getFieldByName<string>('neighbourhood', record) || '',
                                    websiteUrl: getFieldByName<string>('websiteUrl', record),
                                    upvotes: getFieldByName<number>('voting', record)
                                }
                            );
                        });
                    fetchNextPage();
                },
                err =>
                {
                    if (err)
                    {
                        reject(err);
                    } else
                    {
                        resolve(data);
                    }
                });
    });
};

export const GetCoffeeShopById = async (id: string): Promise<Shop | null> =>
{
    return new Promise((resolve, reject) =>
    {
        const base = getAirtableConnector();
        base('coffee shops').find(id,
            (err, record) =>
            {
                if (err || !record)
                {
                    console.log(err);
                    reject(err || { error: "Shop not found." });
                } else
                {
                    resolve(
                        {
                            id: record.getId(),
                            squareId: getFieldByName<string>('squareId', record),
                            address: getFieldByName<string>('address', record),
                            city: getFieldByName<string>('city', record),
                            distance: getFieldByName<number>('distance', record),
                            imgUrl: getFieldByName<string>('imgUrl', record),
                            name: getFieldByName<string>('name', record),
                            neighbourhood: getFieldByName<string>('neighbourhood', record) || '',
                            websiteUrl: getFieldByName<string>('websiteUrl', record),
                            upvotes: getFieldByName<number>('voting', record)
                        }
                    );
                }
            });
    });
};

export const LikeCoffeeShop = async (id: string): Promise<boolean> =>
{
    return new Promise((resolve, reject) =>
    {
        GetCoffeeShopById(id).then(
            shop =>
            {
                const base = getAirtableConnector();
                base('coffee shops')
                    .update(
                        [
                            {
                                "id": id,
                                "fields": {
                                    "voting": (shop?.upvotes || 0) + 1
                                }
                            }
                        ],
                        (err, records) =>
                        {
                            if (err)
                            {
                                reject(err);
                            } else
                            {
                                resolve((records?.length || 0) > 0);
                            }
                        }
                    );
            });
    });
};

export const AddCoffeeShop = async (shop: Shop): Promise<boolean> =>
{
    return await AddCoffeeShops([shop]);
};

export const AddCoffeeShops = async (shops: Shop[]): Promise<boolean> =>
{

    return await new Promise((resolve, reject) =>
    {
        const base = getAirtableConnector();
        base('coffee shops').create(shops.map(
            shop =>
            ({
                "fields": {
                    "squareId": shop.squareId,
                    "name": shop.name,
                    "address": shop.address,
                    "city": shop.city,
                    "neighbourhood": shop.neighbourhood,
                    "voting": shop.upvotes,
                    "imgUrl": shop.imgUrl,
                    "distance": shop.distance,
                    "websiteUrl": shop.websiteUrl
                }
            })
        ), (err, records) =>
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve((records?.length || 0) > 0);
            }
        });
    });
};

const getAirtableConnector = () =>
{
    return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_ID || '');
};


const getFieldByName = <T extends string | number | undefined>(name: string, data: Record<FieldSet>): T =>
{
    return data.get(name)?.valueOf() as T;
};