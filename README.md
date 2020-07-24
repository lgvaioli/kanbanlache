# Kanbanlache

A simple Kanban board, powered by Django and React.

Checkout the [live version](https://kanbanlache.herokuapp.com/)!

## Getting Started

Kanbanlache is designed to be easily deployable to Heroku, though deployment to localhost is also
possible, either manually or with Docker.

The different kinds of deploy have different characteristics:
* Manual deploy to localhost: Runs with Django's development server (*runserver* command) in debug mode (DEBUG = True). It uses Django's default database (sqlite). Hot reloading is enabled (i.e. if you edit the Python source code, the Django server automatically reloads, reflecting your changes).

* Docker deploy to localhost: Also runs with Django's *runserver* in debug mode. As a database, it uses a Docker service (container) running PostgreSQL. The project's directory is mounted as a volume, so hot reloading also works in this deploy.

* Heroku deploy: Runs with gunicorn and whitenoise in production mode (DEBUG = False). It uses Heroku's Postgres addon as a database (or any other database service that provides a Django-compatible DATABASE_URL, to be more precise). Hot reloading is not supported; you have to manually upload your changes to Heroku.

### Deploying to localhost with Docker

Follow these steps if you want to deploy to localhost with Docker:

1. Open backend/backend/settings.py and edit the following:

```
HEROKU_DEPLOY = True → HEROKU_DEPLOY = False

DOCKER_DEPLOY = False → DOCKER_DEPLOY = True
```

If you wish to use a SECRET_KEY different from the default one, you can either manually edit the `SECRET_KEY` line to use a different secret key, or set a `SECRET_KEY` environment variable.


2. Spin up the containers with: `docker-compose up`

3. Open your browser and go to http://127.0.0.1:8000 and you should see the app running!

### Deploying to localhost manually

Follow these steps if you want to deploy to localhost manually:

1. Create virtualenv: `virtualenv venv`

2. Activate it: `source venv/bin/activate`

3. Install dependencies (do NOT use pip with requirements.txt! That file is only meant to be used in a Heroku deploy): `pip install django`

4. Open backend/backend/settings.py and edit the following:

`HEROKU_DEPLOY = True → HEROKU_DEPLOY = False`

If you wish to use a SECRET_KEY different from the default one, you can either manually edit the `SECRET_KEY` line to use a different secret key, or set a `SECRET_KEY` environment variable.

5. Apply Django's migrations with: `python manage.py migrate`

6. Run Django’s server with: `python manage.py runserver`

7. Open your browser and go to http://127.0.0.1:8000 and you should see the app running!

### Deploying to Heroku

1. Login to Heroku: `heroku login`

2. Create Heroku app: `heroku create`

3. Go to your Heroku's app dashboard (https://dashboard.heroku.com/) and provision the Heroku Postgres addon. You can check it worked by running: `heroku addons`

If it worked, you should see something like:

heroku-postgresql (postgresql-animated-84101)  hobby-dev  free   created
 └─ as DATABASE

4. When deploying to Heroku, you should really use a SECRET_KEY different from the default one. You can do this easily with the following command: `heroku config:set SECRET_KEY=some_strong_key` (you should obviously replace *some_strong_key* with an actual, strong key)

5. Push changes to Heroku: `git push heroku`

6. Apply Django's migrations with: `heroku run "python backend/manage.py migrate"`

7. Check that it worked by running: `heroku open`

If everything went fine, a browser tab should open to the running app!