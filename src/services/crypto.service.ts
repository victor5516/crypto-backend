import axios from "axios";
import { AssetInfo } from "../types/asset";
import { fixedFormatter, usdFormatter,usdFormatterCompat } from "../helpers/formatter.helper";
import config from "config"
const apiBase: string = config.get("apiMessari")

const assets : AssetInfo[] = [
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

const getPercentage = (value: number, percentage: number) => {
    return (value/100)*percentage;
}
const getMarketData = async (asset: string) => {
    try {
    const response = await axios.get(`${apiBase}/assets/${asset}/metrics`);


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

    const priceUsd = usdFormatter(price_usd);
    const volumeLast24Hours = usdFormatterCompat(volume_last_24_hours);
    const realVolumeLast24Hours = usdFormatterCompat(real_volume_last_24_hours);
    const percentChangeUsdLast1Hour = percent_change_usd_last_1_hour;
    const percentChangeUsdLast24Hours = percent_change_usd_last_24_hours;
    const percentChangeLast1Week = percent_change_last_1_week;
    const percentChangeLast1Month = percent_change_last_1_month;
    const percentChangeLast1Year = percent_change_last_1_year;
    const currentMarketcapUsd = usdFormatterCompat(current_marketcap_usd);





    return  {
        symbol,
        name,
        slug,
        priceUsd,
        volumeLast24Hours,
        realVolumeLast24Hours,
        percentChangeUsdLast1Hour,
        percentChangeUsdLast24Hours,
        percentChangeLast1Week,
        percentChangeLast1Month,
        percentChangeLast1Year,
        currentMarketcapUsd,

    }
    } catch (e) {
        return {
            error: e.message
        }

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
            return  null;
        }

    }

const getPriceUsd = async (asset: string) => {
    const response = await axios.get(`${apiBase}/assets/${asset}/metrics/market-data`);
    const { market_data } = response.data.data;
    const {
        price_usd
    } = market_data;
    return price_usd;
}

 const calculateUsdToAsset = async (asset: string, amount: number) => {
    const priceUsd = await getPriceUsd(asset);
    const assetAmount = amount / priceUsd;

    return {
        assetAmount,
        priceUsd
    };
}
export const conversionPair = async (asset: string, amount: number) => {
    const {assetAmount, priceUsd} = await calculateUsdToAsset(asset, amount);

    const formattedFiatAmount =  usdFormatter(priceUsd)
    const formattedAssetAmount = fixedFormatter(assetAmount);
    return {
        assetAmount: formattedAssetAmount,
        priceUsd:formattedFiatAmount
    }
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
    const accumulatedAsset =  fixedFormatter(accumulatedAmount)
    const fiatAmount = accumulatedAmount * priceUsd;
    const formattedFiatAmount =  usdFormatter(fiatAmount)
    return {
        accumulatedAsset,
        formattedFiatAmount,


    }

}
