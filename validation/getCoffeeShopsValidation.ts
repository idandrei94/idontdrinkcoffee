import { PropertyErrors } from "@/models/api-error";
import { addValidationError } from "./validation";

const getCoffeeShopsValidation = (latLong: string): PropertyErrors =>
{
    const propertyErrors: PropertyErrors = {};

    if (!latLong)
    {
        addValidationError('latLong', 'Property is required.', propertyErrors);
    }
    if (!/^\d+\.\d*,\d+\.\d*$/.test(latLong))
    {
        addValidationError('latLong', `Invalid value '${latLong}', must be a string in the form '<lat>,<long>', for example '50.110924,8.682127'.`, propertyErrors);
    }
    return propertyErrors;
};

export { getCoffeeShopsValidation };