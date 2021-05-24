'use strict'

require('dotenv').config()

const {Client} = require("@googlemaps/google-maps-services-js")
const fs = require('fs')
const locationList = require('./locationList.json')
const googlemapKey = process.env.GOOGLEMAP_KEY

const getLatLng = async (locationList) => {
	const client = new Client({})
	
	return await Promise.all(locationList.map(async location => {
		return await client.geocode({
			params: {
				address: location.address,
				key: googlemapKey
			},
			timeout: 1000,
		}).then((r) => {
			console.log(r.data.results[0].geometry.location)
			location.lat = r.data.results[0].geometry.location.lat
			location.lng = r.data.results[0].geometry.location.lng
			return location
		})
		.catch((e) => {
			console.log(e.response)
		})
	}))
}

const save = (json, filename) => {
	let data = JSON.stringify(json)
	fs.writeFile(filename, data, (err) => {
			if (err) throw err;
			console.log('Data written to file');
	})
}

const main = async () => {
	let locationWithLatLng = await getLatLng(locationList)
	save(locationWithLatLng, 'locationWithLatLng.json')
}

main()