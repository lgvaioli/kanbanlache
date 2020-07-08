from django.urls import path
from . import views


urlpatterns = [
    path('', views.board, name='board'),
    path('section/<int:section_id>/task', views.add_task_to_section, name='add_task_to_section'),
    # Maybe we should replace the functional views with class-based views. I forgot that URLconf is a piece
    # of s*** that doesn't take into account the HTTP method, and I hate having to hack around with
    # helper "router" functions like this.
    path('section/<int:section_id>/task/<int:task_id>', views.task_action_router, name='task_action_router'),
]
