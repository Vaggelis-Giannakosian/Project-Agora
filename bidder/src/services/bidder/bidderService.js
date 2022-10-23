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
        return campaigns ?? [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

function resolveWinningCampaign(campaigns, country, lat, lon) {
    let winningCampaign = null;

    campaigns.forEach((campaign) => {
        if (
            !matchesCountry(campaign, country)
            || !matchesLocation(campaign, {lat, lon})
        ) return;

        if (!winningCampaign || campaign.price > winningCampaign.price) winningCampaign = campaign;
    })

    return winningCampaign;
}

const matchesCountry = (campaign, country) => {
    return campaign.targetedCountries?.includes('ALL COUNTRIES')
        || campaign.targetedCountries?.includes(country);
}

const matchesLocation = (campaign, {lat, lon}) => {
    if (campaign.targetedLocations?.includes('ALL LOCATIONS')) return true;

    // return true as long as the location of the device is included in one of the targeted ranges
    for (let i = 0; i < campaign.targetedLocations?.length; i++) {
        // extract lat and lon tuples
        const {lat: latRange, lon: lonRange} = campaign.targetedLocations?.[i];
        if (latRange[0] <= lat && latRange[1] >= lat && lonRange[0] <= lon && lonRange[1] >= lon) return true;
    }

    return false;
}


module.exports = {
    processBid
};
