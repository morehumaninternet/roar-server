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

Create a database for both local development & for running tests. If prompted for a password, leave it blank.

```bash
> createdb -h localhost -U $your_user -W roar_dev
> createdb -h localhost -U $your_user -W roar_test
```

Create a `.env.dev` file at the root level of the project with the connection information for the database you created. Create an account with [Clearbit](https://clearbit.com/) to get a `CLEARBIT_SECRET_API_KEY`. Apply for a Twitter Developer account to get `TWITTER_API_KEY`, `TWITTER_KEY_SECRET`, `TWITTER_ACCESS_TOKEN`, and `TWITTER_TOKEN_SECRET`. You may put the dummy `MAILCHIMP_` variables in below unless you need the `/subscribe` route working. By default, the dev server runs on port `5004`.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_dev

CLEARBIT_SECRET_API_KEY=

TWITTER_API_KEY=
TWITTER_KEY_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_TOKEN_SECRET=

MAILCHIMP_LIST_ID=aaaaaaaaaa
MAILCHIMP_API_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-aaa
MAILCHIMP_SERVER_PREFIX=aaa
```

Do the same for `.env.test`. Calls to clearbit should always be stubbed out on test environments.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_test
PORT=
TWITTER_API_KEY=
TWITTER_KEY_SECRET=
```

Run the [database migrations](/db/migrations) for each.

```bash
> NODE_ENV=dev npm run knex migrate:latest
> NODE_ENV=test npm run knex migrate:latest
```

Start a redis server

```
> redis-server
```

Run end-to-end tests.

```bash
> npm test
```

The development environment requires a valid certificate. You can find a certificate [here](/certs/localhost.crt). This is a self-signed certificate so you need to tell your OS to trust it. See instructions [here](https://reactpaths.com/how-to-get-https-working-in-localhost-development-environment-f17de34af046#0fc3), but note that our certificate is called 'roar-server'. In addition, you might need to approve the certificate with your browser. If you see a warning message on Chrome, click on the "Advanced" button and then on the "Process to ... (unsafe)". If you see a warning message on Firefox, click on the "Advanced..." button and then on the "Accept the Risk and Continue".

Start a development server and watch source files in [/src](/src).

```bash
> npm run dev
```
