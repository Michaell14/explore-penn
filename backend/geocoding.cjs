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

  function convertTo24HourFormat(timeString) {
    if (!timeString || !timeString.includes(':')) {
      return 'Invalid time';
    }

    // Normalize special characters (e.g., non-breaking spaces and different dashes)
    timeString = timeString.replace(/\u202F/g, ' ').replace(/–/g, '-').trim();

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return 'Invalid time';
    }

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  function parseOpeningHours(openingHoursText) {
    return openingHoursText.map(dayEntry => {
      const [day, hours] = dayEntry.split(': ');
      if (!hours || hours.toLowerCase() === 'closed') {
        return { day, hours: 'Closed' };
      }

      // Split time ranges (e.g., "09:00 AM – 05:00 PM")
      const timeRanges = hours.split('–').map(time => convertTo24HourFormat(time.trim()));

      // Check for invalid times
      if (timeRanges.some(time => time === 'Invalid time')) {
        console.error(`Invalid time format detected in: ${dayEntry}`);
        return { day, hours: 'Invalid time format' };
      }

      return { day, hours: timeRanges };
    });
  }

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

        const openingHoursText = detailsResponse.data.result.opening_hours?.weekday_text || [];
        const hoursArray = parseOpeningHours(openingHoursText);

        const jsonEntry = {
          address: address,
          coordinate: {
            lat: latitude, // Store as number
            lng: longitude, // Store as number
          },
          facts: [
            'This bench is a great place to sit and relax',
            'It\'s a great place to people watch',
            'It\'s a great place to read a book',
          ],
          hours: hoursArray,
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
