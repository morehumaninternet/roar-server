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

Create a `.env.dev` file at the root level of the project with the connection information for the database you created. You may optionally specify a port. By default, the dev server runs on `5004` and the test server runs on `5005`.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_dev
PORT=
```

Do the same for `.env.test`.

```
DB_HOST=localhost
DB_PASS=
DB_USER=$your_user
DB_NAME=roar_test
PORT=
```

Run the [database migrations](/db/migrations) for each.

```bash
> NODE_ENV=dev npm run knex migrate:latest
> NODE_ENV=test npm run knex migrate:latest
```

Run end-to-end tests.

```bash
> npm test
```

Start a development server and watch source files in [/src](/src).

```bash
> npm run dev
```
