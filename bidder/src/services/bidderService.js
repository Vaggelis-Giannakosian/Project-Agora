const axios = require("axios");

const processBid = async (bidId, {geo: {country, lat, lon}}) => {

    try {
        const matchingCampaign = await getMatchingCampaign(country, lat, lon)

        if (!matchingCampaign) return null;

        return {
            id: bidId,
            campaign_id: matchingCampaign.id,
            price: matchingCampaign.price,
            ad_creative: matchingCampaign.ad_creative
        }
    } catch (e) {
        return null;
    }
}

const getMatchingCampaign = async (country, lat, lon) => {
    try {
        const {data: {campaign}} = await axios.post(process.env.CAMPAIGNS_ENDPOINT, {country, lat, lon});

        if (!campaign) return null;

        return {
            id: campaign.id,
            price: campaign.price,
            ad_creative: campaign.ad_creative,
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}


module.exports = {
    processBid
};
