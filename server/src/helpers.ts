import { Response } from "./types";

export const handleError = (err: any, res: Response) => {
    console.log(`[500] Internal server error`);
    console.error(err);
    res.sendStatusJson(500);
}

export const dateToJsonDate = (date: Date): string => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    return [
        date.getFullYear(),
        (m < 10) ? `0${m}` : m,
        (d < 10) ? `0${d}` : d
    ].join("-");
}