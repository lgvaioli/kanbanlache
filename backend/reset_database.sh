# Completely recreates the database from scratch, this _will_ erase all data!
rm -rf accounts/migrations/__pycache__
rm -rf board/migrations/__pycache__
rm board/migrations/0001_initial.py
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
