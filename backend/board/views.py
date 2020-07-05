from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from .models import Board


@login_required
def index(request):
    """
    We don't want to return more detail than necessary, so we return
    just what the frontend needs to do its job. The returned JSON
    looks like this:
    {
        'board': 'Awesome Board Name',
        'sections': [
            {
                name: 'firstSection',
                tasks: [
                    'first task',
                    ...
                    'last task',
                ]
            },
            ...
            {
                name: 'lastSection',
                tasks: [
                    'first task',
                    ...
                    'last task',
                ]
            },
        ]
    }
    """

    board = Board.objects.get(user=request.user)

    data = {
        'board': board.name,
    }

    # Add sections and their tasks
    sectionList = []

    for section in board.section_set.all():
        taskList = []
        for task in section.task_set.all():
            taskList.append(task.text)

        sectionEntry = {
            'name': str(section),
            'tasks': taskList,
        }
        
        sectionList.append(sectionEntry)

    data['sections'] = sectionList

    return JsonResponse(data)
