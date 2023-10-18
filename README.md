# Gaelic Text Project

Welcome to the Gaelic Text Project! This project focuses on allowing users to select Gaelic text from multiple options. Storing these sentences and user selected sentences in a database. Below, you'll find information on what this project is about and how to set it up and use it.

## Table of Contents

- [About the Project](#about-the-project)
- [Local Setup](#local-setup)
- [Database Setup](#database-setup)
- [Deploying to Render](#deploying-to-render)
- [Starter Kit](#starter-kit)
- [Scripts](#scripts)
- [Debugging](#debugging)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributions](#contributions)
- [License](#license)

## About the Project

The Gaelic Text Project is a web application designed to let user select a grammatical correct gaelic sentence from multiple options, break them into sentences, and store these sentences in a PostgreSQL database. It provides admin users with the ability to manage Gaelic text data effectively and download it if necessary.

## Local Setup

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/gla6-fp-team1/gaelic-project.git
   cd gaelic-project

   ```

2. Install dependencies:  
   npm install

3. Create a .env file and configure it with your environment-specific settings. You might need to set environment variables, such as the database connection details.

```bash
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=XXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleXXXXXXXXXXXX.com
GOOGLE_CLIENT_SECRET=XXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXX
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=0000
DB_NAME=postgres
DB_PORT=5432
```

## Database Setup

The project relies on a PostgreSQL database to store the Gaelic sentences. Unfortunately, the schema for the database was missing from the repository. You should create the necessary database schema and tables to store the sentences. Here's a sample schema:

sql
Copy code
-- Create a schema if you want to keep things organized
CREATE SCHEMA IF NOT EXISTS gaelic_text;

-- Create a table to store sentences
CREATE TABLE IF NOT EXISTS gaelic_text.sentences (
id SERIAL PRIMARY KEY,
sentence_text TEXT,
source_filename TEXT,
sentence_order INT
);
You can run these SQL statements using a PostgreSQL database management tool or by executing SQL scripts.

## Deploying to Render

Deployment instructions can be added here, detailing how to deploy the project to the Render platform or any other deployment solution you choose.

1. Create a Render Account: If you don't already have a Render account, go to the Render website and sign up for an account.

2. Create a New Service on Render: Once you have an account, log in to Render and follow these steps to create a new service for your project:

3. Click on the "New" button in your Render dashboard.
   Choose "Web Service."

4. Configure Your Service: You will need to configure your service settings.

5. Follow these guidelines:

```bash
Service Name: Provide a name for your service, such as "Gaelic-Project."
Environment: Choose the environment for your project.
Build Command: Specify the build command to build your project. For a typical Node.js project, this might be npm run build or yarn build. Make sure this command produces a production-ready build of your project.
Start Command: Specify the command to start your application. In a Node.js project, this is often something like npm start or yarn start.
Add Environment Variables:

If your project relies on environment variables, you can add them in the Render dashboard. This is where you can provide any configuration details, like database connection strings.

Configure Databases and Add-Ons:

If your project uses a database or other add-ons, Render allows you to add them through the dashboard. Configure your database settings, such as the type of database (e.g., PostgreSQL), and provide connection details.
```

6. Add Repositories: Connect your Render service to your project's Git repository. Render supports GitHub, GitLab, and Bitbucket. Select the repository and branch you want to deploy.

7. Build and Deploy: Render will automatically detect your project type and set up the build environment accordingly. After you've configured everything, click the "Create Web Service" or equivalent button to start the build and deployment process.

## Starter Kit

- [x] Full stack ES8+ with [Babel]
- [x] [Node] LTS support (verified working on 16.x, 18.x and 20.x LTS releases)
- [x] [Express] server
- [x] Logging with [Winston] and [Morgan]
- [x] [React] client with [Webpack]
- [x] Client-side routing with [React Router]
- [x] Linting with [ESLint] and [Prettier]
- [x] Dev mode (watch modes for client and server, proxy to avoid CORS issues)
- [x] Production build (single deployment artifact, React loaded via CDN)
- [x] [Render] deployment
- [x] [Cloud Foundry] deployment
- [x] [Docker] build
- [x] [Postgres] database with [node-postgres]

## Scripts

Various scripts are provided in the package file, but many are helpers for other scripts; here are the ones you'll
commonly use and running, testing locally:

- `dev`: starts the frontend and backend in dev mode, with file watching (note that the backend runs on port 3100, and
  the frontend is proxied to it).
- `lint`: runs ESLint and Prettier against all the code in the project.
- `serve`: builds and starts the app in production mode locally.

### Debugging

While running the dev mode using `npm run dev`, you can attach the Node debugger to the server process via port 9229.
If you're using VS Code, a debugging configuration is provided for this.

There is also a VS Code debugging configuration for the Chrome debugger, which requires the recommended Chrome
extension, for debugging the client application.

### Security

If the project handles **any kind of** Personally Identifiable Information (PII) then make sure the following
principles are followed:

- Only collect **strictly necessary** PII;
- Access to PII should be as restricted as possible;
- Access to PII should only be possible after authentication. Authentication **must be done** via GitHub. **Ad hoc
  authentication solutions are not allowed**;
- Admins must be able to control who has access to the platform and at which levels using only GitHub groups;
- There must be an audit mechanism in place. It is required by law to know who accessed what and when;
- Code must be reviewed by senior developers before being pushed to production;
- APIs must be secure. Make sure we are not handling security on the frontend.

### Troubleshooting

See the guidance in the [wiki].

[1]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template
[2]: https://codeyourfuture.slack.com/archives/C021ATWS9A5
[Babel]: https://babeljs.io/
[Cloud Foundry]: https://www.cloudfoundry.org/
[collaborators]: https://help.github.com/en/articles/inviting-collaborators-to-a-personal-repository
[Docker]: https://www.docker.com
[ESLint]: https://eslint.org/
[Express]: https://expressjs.com/
[Morgan]: https://github.com/expressjs/morgan
[Node]: https://nodejs.org/en/
[node-postgres]: https://node-postgres.com/
[Postgres]: https://www.postgresql.org/
[Prettier]: https://prettier.io/
[pull request]: https://help.github.com/en/articles/about-pull-requests
[React]: https://reactjs.org/
[React Router]: https://reactrouter.com/web
[Render]: https://render.com/
[Webpack]: https://webpack.js.org/
[wiki]: https://github.com/textbook/starter-kit/wiki
[Winston]: https://github.com/winstonjs/winston

## Contributions

We welcome contributions from the community to make this Gaelic Text Project even better. Feel free to open issues and pull requests.

## License

This project is licensed under the MIT License.
