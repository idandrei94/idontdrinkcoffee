import { PropertyErrors } from "@/models/api-error";

export const addValidationError = (
    key: string,
    error: string,
    errorDictionary: PropertyErrors): PropertyErrors =>
{
    const x = errorDictionary[key] || [];
    errorDictionary[key] = [...x, error];
    return errorDictionary;
};