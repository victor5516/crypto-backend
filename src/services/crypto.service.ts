import axios from "axios";

const apiBase: string = 'https://data.messari.io/api/v1';
const assets : any[] = [
    {
        symbol: 'BTC',
        roi: 5
    },
    {
        symbol: 'ETH',
        roi: 4.2
    },
    {
        symbol: 'ADA',
        roi: 1
    }
]
const api = axios.create({
    baseURL: apiBase,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
const getPercentage = (value: number, percentage: number) => {
    return (value/100)*percentage;
}
const getMarketData = async (asset: string) => {
    const response = await api.get(`${apiBase}/assets/${asset}/metrics`);
    const { symbol, name, slug, market_data, roi_data, marketcap } = response.data.data;
    const {
        price_usd,
        volume_last_24_hours,
        real_volume_last_24_hours,
        percent_change_usd_last_1_hour,
        percent_change_usd_last_24_hours
      } = market_data;
    const {
        percent_change_last_1_week,
        percent_change_last_1_month,
        percent_change_last_1_year,
    } = roi_data;
    const {
        current_marketcap_usd
    } = marketcap;






    return  {
        symbol,
        name,
        slug,
        price_usd,
        volume_last_24_hours,
        real_volume_last_24_hours,
        percent_change_usd_last_1_hour,
        percent_change_usd_last_24_hours,
        percent_change_last_1_week,
        percent_change_last_1_month,
        percent_change_last_1_year,
        current_marketcap_usd

    }
}

    export const getAllAssets = async () => {
        try {
            const marketData = await Promise.all(assets.map(async (asset) => {
                const data = await getMarketData(asset.symbol);
                return {
                    asset,
                    data
                };
            }));
            return marketData;
        } catch (e) {
            console.log(e);
        }

    }

const getPriceUsd = async (asset: string) => {
    const response = await api.get(`${apiBase}/assets/${asset}/metrics/market-data`);
    const { market_data } = response.data.data;
    const {
        price_usd
    } = market_data;
    return price_usd;
}

export const calculateUsdToAsset = async (asset: string, amount: number) => {
    const priceUsd = await getPriceUsd(asset);
    const assetAmount = amount / priceUsd;
    return {
        assetAmount,
        priceUsd
    };
}

export const calculateRoi= async (asset: string, amount: number) => {

    const {assetAmount, priceUsd} = await calculateUsdToAsset(asset, amount);

    const roi = assets.find((c) => c.symbol === asset)?.roi;

  const accumulatedAmount =  Array.from({length: 12}, (_, i) => i + 1).reduce((acc) => {
        const percentage = getPercentage(assetAmount, roi);
        const total = percentage + acc;
        return total;
    }
    , assetAmount);

    const fiatAmount = accumulatedAmount * priceUsd;

    return {
        accumulatedAmount,
        fiatAmount,


    }

}
