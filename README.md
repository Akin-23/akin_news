# Akin News API

Introduction:
Introducing the Akin News API: Engineered for seamless data handling, our dynamic API effortlessly retrieves and shares app information programmatically. Influenced by robust backend frameworks, it seamlessly integrates with frontends, ensuring smooth, structured data presentation for a seamless user experience.

Hosted Version:
https://akinapplication.onrender.com/api

For an easier reading experience I suggest you download this extension for chrome:
https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en


Setup Instructions:
To run this project, ensure you have the minimum required versions:

	•	Node: v18.16.1
	•	PostgreSQL: 15.3

Then follow these steps:

	1.	Install the project’s dependencies listed in package.json. Use npm or yarn package managers:

    npm install
    # or
    yarn install

	2.	For local database connections, create two .env files in the project:
	•	.env.test: Set PGDATABASE=nc_news_test
	•	.env.development: Set PGDATABASE=nc_news
	3.	To create and seed the database, run these commands in your terminal:
    
    npm run setup-dbs
    npm run seed

	4.	To run tests, execute the following command in the terminal:

    npm run test



Author:
👤 Peter Akin-Nibosun
GitHub: @Akin_23
Linkedin: https://www.linkedin.com/in/peter-akin-nibosun-b63753270/



