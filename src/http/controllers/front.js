import { Request, Response } from "express";

exports.index = (req: Request, res: Response) => {
    res.sendFile('resources/views/index.html', { root: './' });
}
