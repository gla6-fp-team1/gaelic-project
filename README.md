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
   [npm](https://nodejs.org/en) install

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

The project relies on a PostgreSQL database to store the Gaelic sentences. The schema for the database needs to be loaded first before the server can be run. More information about the database schema is in the [Database Schema File](./db/schema.sql) file.

To set up the initial schema you can use the following command line:

```bash
psql -U your_username -d your_database_name < ./db/schema.sql
```

The unit tests will install the schema automatically before starting, but will require a test database to exist including access to it. By default this test database is called `cyf_test`, but can be modified in the `.env` file under `DB_NAME_TEST`.

## Deploying to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Scripts

Various scripts are provided in the package file, but many are helpers for other scripts; here are the ones you'll
commonly use and running, testing locally:

- `dev`: starts the frontend and backend in dev mode, with file watching (note that the backend runs on port 3100, and
  the frontend is proxied to it).
- `lint`: runs ESLint and Prettier against all the code in the project.
- `serve`: builds and starts the app in production mode locally.
- `test`: runs the unit tests for both the backend and the frontend
- `cucumber`: runs the end-to-end tests against a running instance

### Debugging

While running the dev mode using `npm run dev`, you can attach the Node debugger to the server process via port 9229.
If you're using VS Code, a debugging configuration is provided for this.

There is also a VS Code debugging configuration for the Chrome debugger, which requires the recommended Chrome
extension, for debugging the client application.

### Tests

There are two kind of tests included in the codebase:

- Unit tests using `jest`. You can run them using `npm run test`. The backend part of the tests require access to an empty postgresql database, by default called `cyf_test`, but this can be modified using the `DB_NAME_TEST` environment variable.
- Behavioural, end-to-end tests using `cucumber`. You need to start the server first using `npm run dev`, then start the tests afterwards using `npm run cucumber`. The tests will use Chrome, so you also need to make sure you have it installed.

## Contributions

We welcome contributions from the community to make this Gaelic Text Project even better. Feel free to open issues and pull requests.

## Privacy Policy

See [Privacy Policy](./PRIVACY.md)

## License

See [License](./LICENSE)
