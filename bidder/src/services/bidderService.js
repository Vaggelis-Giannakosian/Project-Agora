const axios = require("axios");

const processBid = async (bidId, {geo: {country, lat, lon}}) => {

    try {
        const campaigns = await getAllCampaigns()

        const winningCampaign = resolveWinningCampaign(campaigns, country, lat, lon);

        if (!winningCampaign) return null;

        return {
            id: bidId,
            campaign_id: winningCampaign.id,
            price: winningCampaign.price,
            ad_creative: winningCampaign.ad_creative
        }
    } catch (e) {
        return null;
    }
}

const getAllCampaigns = async () => {
    try {
        const {data: {campaigns}} = await axios.get(process.env.CAMPAIGNS_HOST + process.env.CAMPAIGNS_ENDPOINT);

        if (!campaigns || !campaigns.length) return [];

        return campaigns;
    } catch (e) {
        console.error(e);
        return [];
    }
}

function resolveWinningCampaign(campaigns, country, lat, lon) {
    return campaigns.filter((campaign) => matchesCountry(campaign, country) && matchesLocation(campaign, {lat, lon}))
        .reduce((winningCampaign, campaign) => {

            if (!winningCampaign || campaign.price > winningCampaign.price) return campaign;

            return winningCampaign;
        }, null);
}

const matchesCountry = (campaign, country) => {
    return campaign.targetedCountries?.includes('ALL COUNTRIES')
        || campaign.targetedCountries?.includes(country);
}

const matchesLocation = (campaign, {lat, lon}) => {
    if (campaign.targetedLocations?.includes('ALL LOCATIONS')) return true;

    for (let i = 0; i < campaign.targetedLocations?.length; i++) {
        // extract lat and lon tuples
        const {lat, lon} = campaign.targetedLocations?.[i];
        if (lat[0] <= lat && lat[1] >= lat && lon[0] <= lon && lon[1] >= lon) return true;
    }

    return false;
}


module.exports = {
    processBid
};
