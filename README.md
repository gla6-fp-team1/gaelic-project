# Gaelic Text Project

Welcome to the Gaelic Text Project! This project focuses on allowing users to select Gaelic text from multiple options. Storing these sentences and user selected sentences in a database. Below, you'll find information on what this project is about and how to set it up and use it.

## Table of Contents

- [About the Project](#about-the-project)
- [Local Setup](#local-setup)
- [Google API credentials](#google-api-credentials)
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

3. Create a .env file and configure it with your environment-specific settings. You might need to set environment variables, such as the database connection details. `.env.example` file content can be used for that propose.

## Google API credentials

Follow the instructions to setup the Google API credentials:

1. Create a Google Cloud Project
   Go to the Google Cloud Console.
   Click the project drop-down and select "New Project."
   Enter a name for your project and click "Create."

2. Enable APIs
   In the Google Cloud Console, navigate to "APIs & Services" > "Library."
   Search for and enable the APIs you need for your project.

3. Create Credentials
   In the Google Cloud Console, navigate to "APIs & Services" > "Credentials."
   Click "Create credentials" and select "Service Account Key."
   Choose the role for your service account. For access to Google APIs, you can use the "Project" role or a more specific role like "Editor."
   Select the "JSON" key type and click "Create." This will download a JSON file with your credentials. Store this file securely.

4. More helpful links
   https://developers.google.com/workspace/guides/create-credentials

Save your changes.

## Database Setup

The project relies on a PostgreSQL database to store the Gaelic sentences. The schema for the database can be created if necessary to store the sentences and user interaction. More information about the database schema is in the [Database Schema File](./server/db-schema.sql)
file. Here's a schema if you want to create the database terminal:

sql
Copy code
-- Create a schema if you want to keep things organized

-- Create a table to store sentences

```bash
psql -U your_username -d your_database_name -c "CREATE TABLE IF NOT EXISTS sentences (
id SERIAL PRIMARY KEY,
sentence TEXT
);"

psql -U your_username -d your_database_name -c "CREATE TABLE IF NOT EXISTS suggestions (
id SERIAL PRIMARY KEY,
sentence_id INTEGER REFERENCES sentences(id),
suggestion TEXT
);"

psql -U your_username -d your_database_name -c "CREATE TABLE IF NOT EXISTS user_interactions (
id SERIAL PRIMARY KEY,
sentence_id INTEGER REFERENCES sentences(id),
selected_suggestion TEXT,
user_provided_suggestion TEXT,
original_sentence_was_correct BOOLEAN
);"
```

You can run these SQL statements using a PostgreSQL database management tool.

## Deploying to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

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

<!-- ## License

This project is licensed under the MIT License. -->
