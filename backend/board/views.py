"""
FIXME: Do note that I haven't sanitized/checked any of the user's inputs, which
is plainly suicidal in production. Do NOT forget to add sanitizer code!

FIXME: Check that users only crud their OWN data! A user must not be able to
interfere with another user's data.

FIXME: Return proper REST responses instead of dumb 200 OKs.

FIXME: Check that *.objects.get functions actually return something. Do not just
let the exceptions propagate to the user, it's unprofessional.
"""

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist

import json

from .models import Board, Section, Task, BOARD_DEFAULTS


"""
Helper functions. These could be moved to another module
if they get big enough.
"""
def isFirstSection(section):
    """
    Checks whether a Section model is the first one in its board. The
    order is determined by ascending section id (i.e. the section
    with the lowest id is the first section).

    Parameters:
        section (board.models.Section): The section to check.

    Returns:
        True if section is the first section; False otherwise.
    """
    board = section.board
    sectionsQueryset = board.section_set.all()

    return section.id == sectionsQueryset[0].id


def isLastSection(section):
    """
    Checks whether a Section model is the last one in its board. The
    order is determined by ascending section id (i.e. the section
    with the highest id is the last section).

    Parameters:
        section (board.models.Section): The section to check.

    Returns:
        True if section is the last section; False otherwise.
    """
    board = section.board
    sectionsQueryset = board.section_set.all()
    numSections = len(sectionsQueryset)

    return section.id == sectionsQueryset[numSections - 1].id


def move_task_to_next_section(task):
    """
    Moves a task to the next section. Does not check whether the
    move is legal (i.e. whether current section is not the last one).

    Parameters:
        task (board.models.Task): The task to be moved to the next section.

    Returns:
        None.
    """
    sourceSection = task.section
    isDestinationSection = False    # flag to detect correct destination section
    board = task.section.board

    for section in board.section_set.all():
        if isDestinationSection:
            # Current section is destination section; update task and save it
            task.section = section
            task.save()
            return
        
        # If current section is sourceSection, that means the next section is
        # the destination section, so we set the flag
        if section.id == sourceSection.id:
            isDestinationSection = True


def move_task_to_previous_section(task):
    """
    Moves a task to the previous section. Does not check whether the
    move is legal (i.e. whether current section is not the first one).

    Parameters:
        task (board.models.Task): The task to be moved to the previous section.

    Returns:
        None.
    """
    sourceSection = task.section
    lastSection = None      # keeps track of the last seen section
    board = task.section.board

    for section in board.section_set.all():
        if section.id == sourceSection.id:
            # Current section is sourceSection, which means the last seen section,
            # i.e. lastSection, was the previous section, so we update task and save it.
            task.section = lastSection
            task.save()
            return
        else:
            # Current section is not sourceSection, update lastSection and keep going
            lastSection = section


def create_board_aggregate(board):
    """
    Creates a more convenient board aggregate wrapper around a Board model.

    Parameters:
        board (board.models.Board): The base Board model which will be wrapped.

    Returns:
        A dict with the following shape:
        {
            id: [boardId],
            name: [boardName],
            sections: [
                {
                    id: [firstSectionId],
                    name: [firstSectionName],
                    tasks: [
                        {
                            id: [firstTaskId],
                            text: [firstTaskText]
                        }
                    ]
                }
            ]
        }
    """

    data = {
        'id': board.id,
        'name': board.name,
        }

    # Build sectionList
    sectionList = []
    for section in board.section_set.all():
        # Build taskList
        taskList = []
        for task in section.task_set.all():
            # Each task is a dict { id: int, text: str }
            taskList.append({ 'id': task.id, 'text': task.text, })

        # Build current section entry and add it to sectionList
        sectionEntry = {
            'id': section.id,
            'name': section.name,
            'tasks': taskList,
        }
            
        sectionList.append(sectionEntry)

    data['sections'] = sectionList

    return data


def create_default_board(user):
    """
    Creates a default board with section names as defined
    in BOARD_DEFAULTS['SECTION_NAMES'] (board/models.py).

    Parameters:
        user (auth.models.User): The user for whom this board is created.

    Returns:
        A Board model object, as defined in board/models.py
    """

    # Create a new board
    board = Board(name=BOARD_DEFAULTS['NAME'], user=user)
    board.save()

    # Create the default sections in the board
    for sectionName in BOARD_DEFAULTS['SECTION_NAMES']:
        section = Section(name=sectionName, board=board)
        section.save()

    # Return created board
    return board


"""
Views proper. We should consider refactoring these into a class-based view, because
they are getting a little messy.
"""
@login_required
def promote_task(request, section_id, task_id):
    """
    Promotes a task, if possible. If task can't be promoted, does nothing.

    Parameters:
        task_id (int): The task to be promoted.

    Returns:
        HttpResponse indicating success or failure.
    """

    # Check HTTP method
    if request.method != 'POST':
        return HttpResponseNotAllowed('Method not allowed')

    task = Task.objects.get(pk=task_id)
    section = task.section
    board = section.board

    # Check if section is not last section
    if isLastSection(section) != True:
        # Section is not last section: Promote task, and return with success
        move_task_to_next_section(task)
        return HttpResponse('Task promoted')
    else:
        # Section is last section: Task can't be promoted, so return with error
        return HttpResponseBadRequest('Task could not be promoted: Task is in last section')


@login_required
def demote_task(request, section_id, task_id):
    """
    Demotes a task, if possible. If task can't be demoted, does nothing.

    Parameters:
        task_id: The task to be demoted.

    Returns:
        HttpResponse indicating success or failure.
    """

    # Check HTTP method
    if request.method != 'POST':
        return HttpResponseNotAllowed('Method not allowed')

    task = Task.objects.get(pk=task_id)
    section = task.section
    board = section.board

    # Check if section is not first section
    if isFirstSection(section) != True:
        # Section is not first section: Demote task, and return with success
        move_task_to_previous_section(task)
        return HttpResponse('Task demoted')
    else:
        # Section is first section: Task can't be demoted, so return with error
        return HttpResponseBadRequest('Task could not be demoted: Task is in first section')


@login_required
def board(request):
    """
    Returns a logged user's board/section/tasks as a JSON object. The
    returned object is not a direct mapping of the database objects,
    but rather a more convenient aggregate (see the related
    function create_board_aggregate). 
    
    If the user does not have a board, it creates and returns a new empty board.

    Parameters:
        request (HttpRequest): The client request.

    Returns:
        If the user has a board, returns a JsonResponse with the board aggregate
        as created by create_board_aggregate.
        If the user does not have a board, returns a HttpResponseNotFound.
    """

    try:
        board = Board.objects.get(user=request.user)
        return JsonResponse(create_board_aggregate(board))
    except ObjectDoesNotExist:
        # User has no board, create a new one and return aggregate
        board = create_default_board(request.user)
        return JsonResponse(create_board_aggregate(board))


@login_required
def add_task_to_section(request, section_id):
    """
    Adds (creates and appends) a task to a section.

    Parameters:
        request (HttpRequest): The client request, which must use the POST method.
        A 'text' field containing the text of the new task must exist in the request body.

        section_id (int): The id of the section to which the task will be added.

    Returns:
        An HttpResponse indicating success or failure.
    """

    if request.method == 'POST':
        # Parse body data
        data = json.loads(request.body.decode('utf-8'))

        if 'text' in data:
            # 'text' was passed in body, proceed with task creation

            # FIXME: Here we should check that the section actually belongs
            # to the logged in user! I think the cleanest way would be
            # to write a "check_legitimate_user" decorator or something like that.

            # Get section with id section_id
            section = Section.objects.get(pk=section_id)

            # Create and save task
            task = Task(text=data['text'], section=section)
            task.save()

            # Return created task as JSON
            return JsonResponse({
                'id': task.id,
                'text': task.text,
                })
        else:
            # 'text' was not passed in body, return error response
            return HttpResponseBadRequest('Missing "text" field in request body')
    else:
        # FIXME: use proper REST status code and whatnot
        return HttpResponseNotAllowed('Method not allowed')


@login_required
def update_task(request, task_id):
    """
    Updates a task.

    Parameters:
        request (HttpRequest): The client request, which must use the PUT method.
        A 'text' field containing the updated text of the task must exist
        in the request body.

        task_id (int): The id of the task to be udpated.

    Returns:
        An HttpResponse indicating success or failure.
    """

    if request.method == 'PUT':
        # Parse body data
        data = json.loads(request.body.decode('utf-8'))

        if 'text' in data:
            # 'text' was passed in body, proceed with task update

            # Get task with id task_id
            task = Task.objects.get(pk=task_id)

            # Update task text and save changes
            task.text = data['text']
            task.save()

            # Return updated task as JSON
            return JsonResponse({
                'id': task.id,
                'text': task.text,
                })
    else:
        return HttpResponseNotAllowed('Method not allowed')


@login_required
def delete_task(request, task_id):
    """
    Deletes a task.

    Parameters:
        request (HttpRequest): The client request, which must use the DELETE method.

        task_id (int): The id of the task to be deleted.

    Returns:
        An HttpResponse indicating success or failure.
    """

    if request.method == 'DELETE':
        # Get task with id task_id
        task = Task.objects.get(pk=task_id)

        # Delete task
        task.delete()

        # Return success response
        return HttpResponse('Task deleted')
    else:
        return HttpResponseNotAllowed('Method not allowed')


@login_required
def task_action_router(request, section_id, task_id):
    """
    Routes task actions which share a common function signature.

    Parameters:
        request: The client request. Must use one of the following
        methods: PUT, DELETE.

        section_id: The id of the section to which the affected task belongs.

        task_id: The id of the task to be affected.

    Returns:
        An HttpResponse indicating success or failure.
    """

    if request.method == 'PUT':
        return update_task(request, task_id)
    elif request.method == 'DELETE':
        return delete_task(request, task_id)
    else:
        # FIXME: Return proper RESTful response (i.e. not a happy 200 OK)
        return HttpResponseNotAllowed('Method not allowed')
