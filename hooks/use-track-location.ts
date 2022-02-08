import { useState } from "react";

export const useTrackLocation = () =>
{

    const [state, setstate] = useState<{ isFindingLocation: boolean, latLong: string | undefined, error: string | undefined; }>({
        isFindingLocation: false,
        latLong: undefined,
        error: undefined
    });

    const success: PositionCallback = (pos) =>
    {
        setstate({
            isFindingLocation: false,
            latLong: `${pos.coords.latitude},${pos.coords.longitude}`,
            error: undefined
        });
    };

    const error: PositionErrorCallback = (err) =>
    {

        setstate({
            isFindingLocation: false,
            latLong: undefined,
            error: err.message
        });
    };

    const handleTrackLocation = () =>
    {
        if (!navigator)
        {
            setstate({
                isFindingLocation: false,
                latLong: undefined,
                error: 'Geolocation is not supported by your browser.'
            });
        } else
        {
            setstate(old =>
            {
                return {
                    isFindingLocation: true,
                    latLong: old.latLong,
                    error: old.error
                };
            });
            navigator.geolocation.getCurrentPosition(success, error);
        }
    };

    return {
        location: state,
        handleTrackLocation
    };
};