const axios = require('axios');
const _ = require('lodash');
const moment = require('moment-timezone');

const OAuth = require('./oauth');

moment.tz.setDefault('America/Mexico_City');

const arrayEndpoints = ['https://apis.garmin.com/wellness-api/rest/stressDetails', 'https://apis.garmin.com/wellness-api/rest/dailies', 
                      'https://apis.garmin.com/wellness-api/rest/pulseOx', 'https://apis.garmin.com/wellness-api/rest/respiration'];

module.exports.requestEndpoints = async (timestamp) => {

    try {
        const merge = {};

        const { data: respiration } = await axios.get(`${arrayEndpoints[3]}?${timestamp}`, {
            headers: {
                Authorization: 'OAuth ' + OAuth(arrayEndpoints[3], timestamp),
            }
        });

        respiration.forEach( (element, index) => {
            let id = respiration[index].startTimeInSeconds;

            _.forEach(respiration[index].timeOffsetEpochToBreaths, (value, key) => {
                if(!merge[`${id+parseInt(key)}`]) merge[`${id+parseInt(key)}`] = { date: moment.unix(id+parseInt(key)).format('YYYY-MM-DD HH:mm:ss')};
                merge[`${id+parseInt(key)}`].breath = value;
            });
        });

        const { data: pulseOx } = await axios.get(`${arrayEndpoints[2]}?${timestamp}`, {
            headers: {
                Authorization: 'OAuth ' + OAuth(arrayEndpoints[2], timestamp),
            }
        });

        pulseOx.forEach( (element, index) => {
            let id = pulseOx[index].startTimeInSeconds;

            _.forEach(pulseOx[index].timeOffsetSpo2Values, (value, key) => {
                if(!merge[`${id+parseInt(key)}`]) merge[`${id+parseInt(key)}`] = { date: moment.unix(id+parseInt(key)).format('YYYY-MM-DD HH:mm:ss')};
                merge[`${id+parseInt(key)}`].pulse = value;
            });
        });

        const { data: dailies } = await axios.get(`${arrayEndpoints[1]}?${timestamp}`, {
            headers: {
                Authorization: 'OAuth ' + OAuth(arrayEndpoints[1], timestamp),
            }
        });

        dailies.forEach( (element, index) => {
            let id = dailies[index].startTimeInSeconds;

            _.forEach(dailies[index].timeOffsetHeartRateSamples, (value, key) => {
                if(!merge[`${id+parseInt(key)}`]) merge[`${id+parseInt(key)}`] = { date: moment.unix(id+parseInt(key)).format('YYYY-MM-DD HH:mm:ss')};
                merge[`${id+parseInt(key)}`].heartBeat = value;
                merge[`${id+parseInt(key)}`].stepsDaily = dailies[0].steps;
            });
        });

        const { data: stressDetails } = await axios.get(`${arrayEndpoints[0]}?${timestamp}`, {
            headers: {
                Authorization: 'OAuth ' + OAuth(arrayEndpoints[0], timestamp),
            }
        });

        stressDetails.forEach( (element, index) => {
            let id = stressDetails[index].startTimeInSeconds;

            _.forEach(stressDetails[index].timeOffsetBodyBatteryValues, (value, key) => {
                if(!merge[`${id+parseInt(key)}`]) merge[`${id+parseInt(key)}`] = { date: moment.unix(id+parseInt(key)).format('YYYY-MM-DD HH:mm:ss')};
                merge[`${id+parseInt(key)}`].bodyBattery = value;
            });

            _.forEach(stressDetails[index].timeOffsetStressLevelValues, (value, key) => {
                if(!merge[`${id+parseInt(key)}`]) merge[`${id+parseInt(key)}`] = { date: moment.unix(id+parseInt(key)).format('YYYY-MM-DD HH:mm:ss')};
                merge[`${id+parseInt(key)}`].stress = value;
            });
        });

        _.forEach(merge, (element, key) => {
            const date = new Date(element.date);
            if(date.getSeconds() !== 0){
                const id = Math.floor(date.getTime() / 1000);;
                delete merge[id];
            }
        });

        return merge;

    } catch (error) {
        console.log(error)
    }
}