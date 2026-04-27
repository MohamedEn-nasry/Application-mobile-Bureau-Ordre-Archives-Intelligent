from django.urls import path
from modules.auth.controllers.auth_views import (
    LoginView, RegisterView, LogoutView, RefreshTokenView,
    ChangePasswordView, ProfileView
)

app_name = 'auth'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh-token'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
