(async () => {
  const NodeGeocoder = require('node-geocoder');
  const axios = require('axios');
  require('dotenv').config();

  console.log('Loaded API Key:', process.env.GOOGLE_API_KEY);

  const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY,
    formatter: null,
  };

  const geocoder = NodeGeocoder(options);

  async function getCoordinates(address) {
    try {
      const res = await geocoder.geocode(address);
      if (res.length > 0) {
        const { latitude, longitude } = res[0];
        console.log('Coordinates:', latitude, longitude);
        return { latitude, longitude };
      } else {
        console.log('No results found for the given address');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  }

  async function getPlaceDetailsByName(name) {
    try {
      // Step 1: Use Text Search to find the place by name and get the coordinates
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: name,
          key: process.env.GOOGLE_API_KEY,
        },
      });
  
      if (response.data.results.length > 0) {
        const place = response.data.results[0];
        const placeId = place.place_id;
        const latitude = place.geometry.location.lat;
        const longitude = place.geometry.location.lng;
  
        console.log('Retrieved Place ID:', placeId);
        console.log('Coordinates:', latitude, longitude);
  
        // Step 2: Use Place Details API to get more information
        const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: placeId,
            fields: 'name,formatted_address,opening_hours',
            key: process.env.GOOGLE_API_KEY,
          },
        });
  
        console.log('Details Response:', detailsResponse.data);
  
        if (detailsResponse.data.result.opening_hours) {
          const openingHours = detailsResponse.data.result.opening_hours;
          console.log('Name of the location:', detailsResponse.data.result.name);
          console.log('Opening Hours:', openingHours);
          return { latitude, longitude, openingHours };
        } else {
          console.log('No opening hours found for this place.');
          return { latitude, longitude };
        }
      } else {
        console.log('No results found for the given location name');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  }
  
  // Replace with the name of the location you want to search for
  getPlaceDetailsByName('Liberty Bell, Philadelphia');
  
})();  