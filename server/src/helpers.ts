import { Response } from "./types";

export const handleError = (err: any, res: Response) => {
    console.log(`[500] Internal server error`);
    console.error(err);
    res.sendStatusJson(500);
}