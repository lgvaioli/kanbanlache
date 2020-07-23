# Completely recreates the static files from scratch
rm -rf staticfiles/
python manage.py collectstatic --no-input --clear
