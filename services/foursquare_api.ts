import { Shop } from "@/models/shop";
import axios from "axios";
import { AddCoffeeShops, GetCoffeeShops as GetAirtableCofeeShops } from "services/airtable_api";

interface ApiPlace
{
    fsq_id: string;
    name: string;
    location: {
        address: string,
        country: string,
        cross_street: string,
        locality: string,
        postcode: string,
        region: string,
        neighborhood: string;
    },
    categories: {
        name: string,
        icon: {
            prefix: string,
            suffix: string;
        };
    }[];
    distance: number,
    cross_street: string;
}

interface Result
{
    results: ApiPlace[];
}

export const GetCoffeeShops =
    async (api_key: string, latLong: string, query: string, limit: number): Promise<Shop[]> =>
    {
        var response = await axios.get<Result>(
            `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&sort=DISTANCE&limit=${limit}`,
            {
                headers: {
                    'Authorization': api_key
                }
            });
        const promises = await response.data.results.map(async r =>
        {
            return {
                id: r.fsq_id,
                squareId: r.fsq_id,
                name: r.name,
                distance: r.distance,
                address: `${r.location.address}, ${r.location.postcode} ${r.location.locality}`,
                imgUrl: await getRandomImage(600, 300),
                neighbourhood: (Array.isArray(r.location.neighborhood) ? r.location.neighborhood.join(', ') : r.location.neighborhood) || '',
                websiteUrl: `/coffee-shop/${r.fsq_id}`,
                city: r.location.locality,
                upvotes: 0
            };
        });
        const ret = await Promise.all(promises);
        const existing = (await GetAirtableCofeeShops());
        const missing = ret.filter(square => !existing.find(e => e.squareId === square.id));
        if (missing.length > 0)
        {
            await AddCoffeeShops(missing);
        };
        const newList = (await GetAirtableCofeeShops());
        return newList.filter(s => ret.find(r => r.squareId === s.squareId));
    };

const getRandomImage = async (width: number, height: number): Promise<string> =>
{
    return await axios.get(`https://picsum.photos/${width.toFixed(0)}/${height.toFixed(0)}`, {
        maxRedirects: 0
    })
        .then(r => 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80')
        .catch(err =>
        {
            if (err.response?.headers?.location)
            {
                return err.response.headers.location;
            }
            else
                return 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80';
        });
};