(async () => {
  const NodeGeocoder = require('node-geocoder');
  const axios = require('axios');
  const fs = require('fs');
  require('dotenv').config();

  console.log('Loaded API Key:', process.env.GOOGLE_API_KEY);

  const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY, // Ensure this uses your environment variable
    formatter: null,
  };

  const geocoder = NodeGeocoder(options);

  const locations = [
    { name: 'Kings Court English College House (KCECH)', address: '3465 Sansom Street, Philadelphia, PA 19104' },
    { name: 'Lauder College House', address: '3335 Woodland Walk, Philadelphia, PA 19104' },
    { name: 'Hill College House', address: '3333 Walnut Street, Philadelphia, PA 19104' },
    { name: 'Harnwell College House', address: '3820 Locust Walk, Philadelphia, PA 19104' },
    { name: 'Harrison College House', address: '3910 Irving Street, Philadelphia, PA 19104' },
    { name: 'Gutmann College House', address: '3901 Walnut Street, Philadelphia, PA 19104' },
    { name: 'Rodin College House', address: '3901 Locust Walk, Philadelphia, PA 19104' },
    { name: 'The Radian Apartments', address: '3925 Walnut Street, Philadelphia, PA 19104' },
    { name: 'The Button (Split Button Sculpture)', address: '3420 Walnut Street, Philadelphia, PA 19104' },
    { name: 'LOVE Statue', address: '36th Street and Locust Walk, Philadelphia, PA 19104' },
    { name: 'The Bench (The Covenant)', address: '36th Street and Locust Walk, Philadelphia, PA 19104' },
    { name: 'The Compass', address: '37th Street and Locust Walk, Philadelphia, PA 19104' },
    { name: 'Tampons (We Lost)', address: '3420 Walnut Street, Philadelphia, PA 19104' },
    { name: 'Van Pelt-Dietrich Library Center (VP)', address: '3420 Walnut Street, Philadelphia, PA 19104' },
    { name: 'Jon M. Huntsman Hall', address: '3730 Walnut Street, Philadelphia, PA 19104' },
    { name: 'Towne Building (Engineering Quad)', address: '220 South 33rd Street, Philadelphia, PA 19104' },
    { name: 'Williams Hall', address: '255 South 36th Street, Philadelphia, PA 19104' },
    { name: 'Houston Hall', address: '3417 Spruce Street, Philadelphia, PA 19104' },
    { name: 'Claire M. Fagin Hall', address: '418 Curie Boulevard, Philadelphia, PA 19104' },
    { name: 'Meyerson Hall', address: '210 South 34th Street, Philadelphia, PA 19104' }
  ];

  function convertTo24HourFormat(timeString) {
    if (!timeString || !timeString.includes(':')) {
      return 'Invalid time';
    }
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
      const timeRanges = hours.split('–').map(time => convertTo24HourFormat(time.trim()));
      if (timeRanges.some(time => time === 'Invalid time')) {
        console.error(`Invalid time format detected in: ${dayEntry}`);
        return { day, hours: 'Invalid time format' };
      }
      return { day, hours: timeRanges };
    });
  }

  async function getPlaceDetailsByName(name, address) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: `${name}, ${address}`,
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

        const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: placeId,
            fields: 'name,formatted_address,opening_hours',
            key: process.env.GOOGLE_API_KEY,
          },
        });

        const openingHoursText = detailsResponse.data.result.opening_hours?.weekday_text || [];
        const hoursArray = parseOpeningHours(openingHoursText);

        const jsonEntry = {
          address: address,
          coordinate: {
            lat: latitude,
            lng: longitude,
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

    fs.writeFileSync('./locations.json', JSON.stringify(results, null, 2));
    console.log('JSON file created: locations.json');
  }

  // Run the function to generate the JSON file
  await generateJsonFile();
})();
