# Akin News API

## Back End RESTful API

Akin News API is a news aggregation demo loosely based on Reddit.

This project aims to demonstrate some of the skills learnt in my back end study including:

-JavaScript programming
-Building a RESTful Web API to respond to HTTP requests
-Storing data and interacting with databases
-Test Driven Development

A working example of this API is published on the link below where you can see the summary of the API endpoints:
https://akinapplication.onrender.com/api

For an easier reading experience I suggest you download this extension for chrome:
[JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)

## Setup Instructions

This project runs on :

	•	Node: v20.3.1
	•	PostgreSQL: 14.8

Then follow these steps:


	1. Duplicate or fork this repository from https://github.com/Akin-23/akin_news
	
	2.Install the project’s dependencies listed in package.json. Use npm or yarn package managers:
    npm install
    # or
    yarn install

	3.This repository uses the npm dotenv package to store some environment variables, to run this project you need to create two files .env.test and .env.development in the root folder of this project, and inside each file it should contain the following environment variable PGDATABASE= with the names of both databases.
    For the .env.test file it should look like this:

    PGDATABASE=nc_news_test

    For the .env.development file it should look like this:
    PGDATABASE=nc_news

	4.	To create and seed the database, run these commands in your terminal:
    
        .npm run setup-dbs
        .npm run seed

	5.	To run tests, execute the following command in the terminal:
        .npm run test

Author:
👤 Peter Akin-Nibosun
GitHub: @Akin_23
Linkedin: https://www.linkedin.com/in/peter-akin-nibosun-b63753270/



