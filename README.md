# Kanbanlache

A simple Kanban board, powered by Django and React.

## Getting Started

Kanbanlache is designed to be easily deployable to Heroku, though deployment to localhost is also
possible, either manually or with Docker.

### Deploying to localhost with Docker

Follow these steps if you want to deploy to localhost with Docker (it uses PostgreSQL running in a container as a database):

1. Open backend/backend/settings.py and edit the following:

```
HEROKU_DEPLOY = True → HEROKU_DEPLOY = False

DOCKER_DEPLOY = False → DOCKER_DEPLOY = True
```

2. Spin up the containers with: `docker-compose up`

3. Open your browser and go to http://127.0.0.1:8000 and you should see the app running!

### Deploying to localhost manually

Follow these steps if you want to deploy to localhost with the default Django database driver (sqlite):

1. Create virtualenv: `virtualenv venv`

2. Activate it: `source venv/bin/activate`

3. Install dependencies (do NOT use pip with requirements.txt! That file is only meant to be used in a Heroku deploy): `pip install django`

4. Open backend/backend/settings.py and edit the following:

`HEROKU_DEPLOY = True → HEROKU_DEPLOY = False`

5. Apply Django's migrations with: `python manage.py migrate`

6. Run Django’s server with: `python manage.py runserver`

7. Open your browser and go to http://127.0.0.1:8000 and you should see the app running!

### Deploying to Heroku

1. Login to Heroku: `heroku login`

2. Create Heroku app: `heroku create`

3. Disable Django's collectstatic with: `heroku config:set DISABLE_COLLECTSTATIC=1`

4. Go to your Heroku's app dashboard (https://dashboard.heroku.com/) and provision the Heroku Postgres addon. You can check it worked by running: `heroku addons`

If it worked, you should see something like:

heroku-postgresql (postgresql-animated-84101)  hobby-dev  free   created
 └─ as DATABASE

5. Push changes to Heroku: `git push heroku`

6. Apply Django's migrations with: `heroku run "python backend/manage.py migrate"`

7. Check that it worked by running: `heroku open`

If everything went fine, a browser tab should open to the running app!