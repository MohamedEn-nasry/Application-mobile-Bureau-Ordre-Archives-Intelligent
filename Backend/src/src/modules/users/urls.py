from django.urls import path
from modules.users.controllers.user_views import (
    UserListView, UserCreateView, UserDetailView, UserDeleteView,
    UserProfileView, UserActivityView, UserToggleStatusView
)

app_name = 'users'

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('<int:user_id>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('<int:user_id>/toggle-status/', UserToggleStatusView.as_view(), name='user-toggle-status'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('<int:user_id>/activities/', UserActivityView.as_view(), name='user-activities'),
    path('activities/', UserActivityView.as_view(), name='my-activities'),
]
