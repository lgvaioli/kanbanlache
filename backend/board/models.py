from django.db import models
from django.contrib.auth.models import User


# Max length of Board/Section names
NAME_MAXLENGTH = 250

# Max length of Task text
TEXT_MAXLENGTH = 250

# Board defaults
BOARD_DEFAULTS = {
    'NAME': 'Default Board',
    'SECTION_NAMES': [
        'TODO',
        'DOING',
        'DONE',
    ],
}


class Board(models.Model):
    name = models.CharField(max_length=NAME_MAXLENGTH)
    user = models.ForeignKey(User, on_delete=models.CASCADE) 

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=NAME_MAXLENGTH)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Task(models.Model):
    text = models.CharField(max_length=TEXT_MAXLENGTH)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    def __str__(self):
        return self.text
