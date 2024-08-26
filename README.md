=======
NestJS microservices
=======

Prerequisites
=============

Make sure you have installed the following tools and dependencies:

- Node.js
- NPM (or yarn)
- MongoDB
- RabbitMQ

Getting Started
===============

Follow these steps to get the project up and running on your local machine.

1. **Install dependencies**

   ::

     npm install
     # or
     yarn install

2. **Set environment variables**

   Create a `.env` file in the root directory of your project. You can use `.env.example` as a template to define your environment variables.

   ::

     # Example .env file
     MONGODB_URI=mongodb://x.x.x.x:port/
     RMQ_URI_CREDINTIAL=amqp://user:password@ip:port/
     RMQ_URI=amqp://ip:port/
     RMQ_QUEUE=
     USER_SERVICE_URL=https://reqres.in

   Replace `MONGO_URI` and `USER_SERVICE_URL` with your actual MongoDB connection string and any other environment variables needed for your project.

4. **Run the application**

   ::

     npm run start:dev
     # or
     yarn start:dev

   This command starts the application in development mode. It will automatically restart the server when you make changes to the source code.

5. **Open your browser**

   Navigate to `http://localhost:3000/api` to access the application.

Testing
=======

To run the tests, use the following command:

::

  npm run test
  # or
  yarn test

This will execute the test cases and provide the test results.

Additional Notes
================

Provide any additional information about the project here, such as:

- Explanation of project structure
- How to deploy the application
- Contact information for support or issues
- Credits and acknowledgments
- Resources are stored in root of project

License
=======

This project is licensed under the `MIT License`_.

.. _MIT License: LICENSE
