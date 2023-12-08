# engage-app

'engage' is an application whose purpose is to provide organizations with an avenue to encourage their employees to engage and interact with each other outside of the office. By providing features such as matching, activity finding, and community hosting, workers can find other employees, interact, and thus boost their productivity.

## Running the application:

To run the engage application, please follow these steps:

- Clone the repository to your local machine using `git clone https://github.com/Joshtray/engage-app.git`.
- Navigate to the root directory of the project using `cd engage-app``.
- Install the required dependencies on both the client and server sides
  - You can do this by running `npm install` in two different terminals; one rooted at the 'client' folder and the other 'server' folder.

- Create a .env file in the root directory of the project and add the following environment variables: 
    - MONGO_URI=mongodb+srv://genericUser:genericUser@auth-app.ekcsods.mongodb.net/?retryWrites=true&w=majority
    - JWT_SECRET=Gracelandsch15%
    - EMAIL=\<your email address\>
    - EMAIL_PASSWORD=\<your email account password\>
    * The cloudinary environment variables can be obtained easily by creating a free account on Cloudinary and getting the values

- Start the application
    - First start the server by running `npm start` in the server folder and connecting to the DB.
    - Then start the client by running `npm start` in a different location in the client folder.

To view the application, you need to install Expo Go and use it to scan the QR code that is shown after the client is loaded.
