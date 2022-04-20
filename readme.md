# Vehicle Renter Backend

### About
A backend programm for Vehicles Renter application.

### How to Use This Project Locally
Clone this project to your local computer
Import vehicle_rent.sql to your local mysql database
Create .env file and fill the data which written in .env.example
Install required package with command ```npm i```
Run the app with ```npm run dev```

### Endpoints
| **url** | **Method** | **Description** |
| ------------- | ------------- | ------------- |
| vehicle | GET | Get a list of vehicle data |
| vehicle/:id | GET | Get a detailed vehicle data |
| vehicle | POST | Insert a vehicle data |
| vehicle/:id | PATCH | Update a vehicle data |
| vehicle | DELETE | Delete a vehicle data |
| vehicle/popular | GET | Get list of vehicles which are in history table in the last month |
| vehicle/category/:id | GET | Get a list of vehicle data based on category id |
| category | GET | Get a list of category data |
| category/:id | GET | Get a detailed category data |
| category | POST | Insert a category data |
| category/:id | PATCH | Update a category data |
| category/:id | Delete | Delete a category data |
| user | GET | Get a list of user data |
| user/:id | GET | Get a detailed user data |
| user | POST | Insert a user data |
| user/:id | PATCH | Update a user data |
| user/:id | DELETE | Delete a user data |
| profile/:id | GET | Get a user profile data |
| history | GET | Get a list of history data |
| history/:id | GET | Get a detailed history data |
| history | POST | Insert a history data |
| history/:id | PATCH | Update a history data |
| history/:id | DELETE | Delete a history data |
| transaction-status | GET | Get a list of transaction status data |
| transaction-status/:id | GET | Get a detailed transaction status data |
| transaction-status | POST | Insert a transaction status data |
| transaction-status/:id | PATCH | Update a transaction status data |
| transaction-status/:id | Delete | Delete a transaction status data |
| favorite | GET | Get a list of favorite vehicles data of currently logged in user |
| favorite | POST | Toggle favorite status for a vehicle for currently logged in user |