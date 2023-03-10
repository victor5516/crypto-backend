import { expect } from "chai";
import { conversionPair, calculateRoi, getAllAssets } from "../../src/services/crypto.service";
import  Sinon from "sinon";
import axios from "axios";
import { metrics } from "./mocks"
describe("Crypto Service", () => {

    Sinon.stub(axios, "get").callsFake(async (url,opts) => {
        if(url.endsWith("metrics"))
        {
            return Promise.resolve(metrics);
        }
        const response = {
            data: {
                data: {
                    market_data: {
                        price_usd: 100000
                    }
                }

        }
    }
        return Promise.resolve(response);
    });


    it("should convert usd to asset", async () => {
        const asset = "BTC";
        const amount = 100;
        const result = await conversionPair(asset, amount);
        expect(result).to.be.an('object');
        expect(result).to.have.property('assetAmount');
        expect(result).to.have.property('priceUsd');
        expect(result.assetAmount).to.equal('0.001');

    });

    it("should calculate roi", async () => {
        const asset = "BTC";
        const amount = 100;
        const result = await calculateRoi(asset, amount);
        expect(result).to.be.an('object');
        expect(result).to.have.property('accumulatedAsset');
        expect(result).to.have.property('formattedFiatAmount');
        expect(result.accumulatedAsset).to.equal('0.0016');
        expect(result.formattedFiatAmount).to.equal('$160.00');


    });

    it("should get all assets", async () => {
        const result = await getAllAssets();
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(3);
        expect(result[0].data).to.have.property('symbol');
        expect(result[0].data).to.have.property('name');
        expect(result[0].data).to.have.property('slug');
        expect(result[0].data).to.have.property('priceUsd');
        expect(result[0].data).to.have.property('volumeLast24Hours');
        expect(result[0].data).to.have.property('realVolumeLast24Hours');
        expect(result[0].data).to.have.property('percentChangeUsdLast1Hour');
        expect(result[0].data).to.have.property('percentChangeUsdLast24Hours');
        expect(result[0].data).to.have.property('percentChangeLast1Week');
        expect(result[0].data).to.have.property('percentChangeLast1Month');
        expect(result[0].data).to.have.property('percentChangeLast1Year');
        expect(result[0].data).to.have.property('currentMarketcapUsd');



    });
});