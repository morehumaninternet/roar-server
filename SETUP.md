All of this assumes you're on a Mac. If any part of these instructions are wrong or incomplete, please update them!

## Installs

Get [Homebrew](https://brew.sh/).

```bash
> /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Get [node.js](https://nodejs.org/en/).

```bash
> brew install node
```

Get [nvm](https://github.com/nvm-sh/nvm).

```bash
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

Get [postgres](https://www.postgresql.org/).

```bash
> brew install postgresql
```

Get [redis](https://redis.io/).

```bash
> brew install redis
```

## Setup

Use the correct node version and install node_modules.

```bash
> nvm use
> npm install
```

Create a database tied to a user name you specify for both local development & for running tests. If prompted for a password, you may leave it blank.

```bash
> createdb -h localhost -U $your_user -W roar_dev
> createdb -h localhost -U $your_user -W roar_test
```

Create a `.env.dev` file at the root level of the project with the connection information for the database you created. The `.default.env` file contains dummy variables that you'll need to override in the `.env.dev` file with secrets to external APIs, but if you're just working on the views, just the database info should be enough to get you off the ground. For other environment variables, reach out to Shachar Langer or Will Weiss to get set up.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_dev
```

Do the same for `.env.test`. Calls to clearbit should always be stubbed out on test environments.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_test
```

Run the [database migrations](/db/migrations) for each.

```bash
> NODE_ENV=dev npm run knex migrate:latest
> NODE_ENV=test npm run knex migrate:latest
```

Start a redis server in another terminal window.

```bash
> redis-server
```

Run end-to-end tests.

```bash
> npm test
```

The development environment requires a valid certificate. You can find a certificate [here](/certs/localhost.crt). This is a self-signed certificate so you need to tell your OS to trust it. See instructions [here](https://reactpaths.com/how-to-get-https-working-in-localhost-development-environment-f17de34af046#0fc3), but note that our certificate is called 'roar-server'. In addition, you might need to approve the certificate with your browser. If you see a warning message on Chrome, click on the "Advanced" button and then on the "Process to ... (unsafe)". If you see a warning message on Firefox, click on the "Advanced..." button and then on the "Accept the Risk and Continue".

Build source files in [/src](/src), [/scss](/scss), and [/views](/views) and start a server that reboots whenever any of those files change.

```
> npm run dev

🎉 First build successful! Continuing to watch files...


> @ start /Users/willweiss/dev/morehumaninternet/roar-server
> node -r source-map-support/register compiled/entry.js

roar-server listening on 5004 Wed Jan 06 2021 09:20:20 GMT-0500 (Eastern Standard Time)
Established connection to redis
```
