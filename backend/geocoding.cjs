(async () => {
  const NodeGeocoder = require('node-geocoder');
  const axios = require('axios');
  const fs = require('fs');
  require('dotenv').config();

  console.log('Loaded API Key:', process.env.GOOGLE_API_KEY);

  const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY,
    formatter: null,
  };

  const geocoder = NodeGeocoder(options);

  const locations = [
    { name: 'Liberty Bell', address: '526 Market St, Philadelphia, PA 19106' },
    { name: 'Philadelphia Museum of Art', address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA 19130' },
    // Add more locations as needed
  ];

  async function getPlaceDetailsByName(name, address) {
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

        const openingHours = detailsResponse.data.result.opening_hours?.weekday_text || {};
        const hoursMap = openingHours.reduce((map, day) => {
          const [dayName, hours] = day.split(': ');
          map[dayName] = hours;
          return map;
        }, {});

        const jsonEntry = {
          address: address,
          coordinate: {
            lat: latitude.toString(),
            lng: longitude.toString(),
          },
          facts: [
            'This bench is a great place to sit and relax',
            'It\'s a great place to people watch',
            'It\'s a great place to read a book',
          ],
          hours: hoursMap,
          name: name,
        };

        return jsonEntry;
      } else {
        console.log(`No results found for ${name}`);
      }
    } catch (error) {
      console.error(`Error fetching details for ${name}:`, error);
    }
  }

  async function generateJsonFile() {
    const results = [];

    for (const location of locations) {
      const result = await getPlaceDetailsByName(location.name, location.address);
      if (result) {
        results.push(result);
      }
    }

    fs.writeFileSync('locations.json', JSON.stringify(results, null, 2));
    console.log('JSON file created: locations.json');
  }

  // Run the function to generate the JSON file
  await generateJsonFile();
})();
