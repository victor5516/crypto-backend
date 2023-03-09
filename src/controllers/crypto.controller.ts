
import { Request, Response } from "express";
import  { getAllAssets, calculateUsdToAsset, calculateRoi } from "../services/crypto.service";
export const getAll = async (req: Request, res: Response) => {
    try {

        const marketData = await getAllAssets();
        const response = {
            status: 200,
            message: "Success",
            data: marketData
        }
      return res.status(200).json(response);

    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };

export const calculate = async (req: Request, res: Response) => {
    try {

        const amount: number = req.body.amount;
        const asset: string = req.body.asset;
        const usdToAsset = await calculateUsdToAsset(asset, amount);
        const response = {
            status: 200,
            message: "Success",
            data: usdToAsset
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

}

export const getCalculatedRoi = async (req: Request, res: Response) => {
    try {

        const amount: number = req.body.amount;
        const asset: string = req.body.asset;
        const roi = await calculateRoi(asset, amount);
        const response = {
            status: 200,
            message: "Success",
            data: roi
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

}

