# Locations API Endpoints
- `GET http://localhost:3000/api/loc/getLocation/{location_id}` - Get specific location details.
- `GET http://localhost:3000/api/loc/getRandomFunFact/{location_id}` - Get a random fun fact for a specific location.
- `GET http://localhost:3000/api/loc/getAllLocations` - Retrieve all locations with their information.

Thanks for pointing that out! Here's the **correct updated API documentation** reflecting the existing endpoints for `socialPins` without adding non-existent functionality like `topPins`.

# EventPins API Endpoints
- `GET http://localhost:3000/api/eventPins` - Get all event pins.
- `POST http://localhost:3000/api/eventPins` - Add a new event pin.
- `GET http://localhost:3000/api/eventPins/{pin_id}` - Get details for a specific event pin.
- `DELETE http://localhost:3000/api/eventPins/{pin_id}` - Delete a specific event pin and all its associated posts.
- `POST http://localhost:3000/api/eventPins/location - Get event pins within a specific location radius.

- `GET http://localhost:3000/api/eventPins/{pin_id}/posts` - Get posts associated with a specific event pin.
- `POST http://localhost:3000/api/eventPins/{pin_id}/posts` - Add a post to a specific event pin.
- `POST http://localhost:3000/api/eventPins/{pin_id}/posts/move` - Move a post within a specific event pin.
- `DELETE http://localhost:3000/api/eventPins/{pin_id}/posts/{post_id}` - Delete a specific post associated with an event pin.

# Users API Endpoints
- `POST http://localhost:3000/api/users/register` - Register a new user.
- `GET http://localhost:3000/api/users/myPosts/{u_id}` - Get posts created by a specific user.
- `GET http://localhost:3000/api/users/myReactions/{u_id}` - Get posts a user has reacted to.
- `GET http://localhost:3000/api/users/myTopPosts/{u_id}` - Get top posts of a specific user.
