# Locations API Endpoints
- `GET http://localhost:3000/api/loc/getLocation/{location_id}` - Get specific location details.
- `GET http://localhost:3000/api/loc/getRandomFunFact/{location_id}` - Get a random fun fact for a specific location.
- `GET http://localhost:3000/api/loc/getAllLocations` - Retrieve all locations with their information.

# Pins API Endpoints
- `GET http://localhost:3000/api/pins/topPins` - Get the top pins based on reaction count.
- `POST http://localhost:3000/api/pins/postPin` - Add a new pin.
- `GET http://localhost:3000/api/pins/{pin_id}` - Get pin details, including user and reactions.
- `GET http://localhost:3000/api/pins/{pin_id}/getReactions` - Get reactions for a specific pin.
- `POST http://localhost:3000/api/pins/{pin_id}/postReactions` - Post a reaction to a specific pin.

# Users API Endpoints
- `POST http://localhost:3000/api/users/register` - Register a new user.
- `GET http://localhost:3000/api/users/myPosts/{u_id}` - Get posts created by a specific user.
- `GET http://localhost:3000/api/users/myReactions/{u_id}` - Get posts a user has reacted to.
- `GET http://localhost:3000/api/users/myTopPosts/{u_id}` - Get top posts of a specific user.
