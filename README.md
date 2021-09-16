# SpotTracker is a website that tracks skateboarding spots around the world.

Compatible with mobile devices and most web browsers, SpotTracker allows users to upload and find skate spots near their current location, and anywhere else around the globe.

This application uses a React UI and Express/Node.js on the backend. Stores uploaded spot data in MongoDb cluster and images in an AWS S3 Bucket. User authentication is done using Firebase. It consists of a home page, add spot page, find spot page, and profile page, all traversable through the application's navigation bar at the top of the window.

Upon uploading a spot or park, a marker is added in the corresponding location and shows spot info such as name, location, type, description, date uploaded, username, and an image of the spot. when clicking the marker. Complete with a full profile section, the user can update their username, email address, and profile picture. It also features a search bar, where the user can enter a location and explore spots in any city. 

The map is programmed using Google Maps's API, as well as Places Autocomplete API to generate suggested locations. 

# Find Spots Page:
<img width="1194" alt="Screen Shot 2021-09-15 at 2 34 43 PM" src="https://user-images.githubusercontent.com/42751309/133512865-fabff37d-d5fa-49c7-a97b-fb1849a109f6.png">

# Profile:
![Screen Shot 2021-09-14 at 10 54 28 PM](https://user-images.githubusercontent.com/42751309/133378867-1fd3dbb1-b781-4fc4-93e1-06dbf43f4b97.png)

# My Spots Page:
<img width="1202" alt="Screen Shot 2021-09-15 at 3 51 47 AM" src="https://user-images.githubusercontent.com/42751309/133420806-0d116c14-33c5-4e5c-ba31-95ff24266077.png">


# Add Spot Page:
![Screen Shot 2021-09-14 at 10 54 34 PM](https://user-images.githubusercontent.com/42751309/133378904-e3802b29-3df4-4487-b028-217ca323a1f1.png)