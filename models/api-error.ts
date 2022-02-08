export interface ApiErrorModel
{
    error: string;
    errors: PropertyErrors;
}

export type PropertyErrors = { [key: string]: string[]; };