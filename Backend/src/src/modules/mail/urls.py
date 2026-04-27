from django.urls import path
from modules.mail.controllers.mail_views import (
    MailListView, MailCreateView, MailDetailView, MailDeleteView,
    MailStatusUpdateView, MailCommentView, MailForwardView,
    MailHistoryView, MailStatisticsView
)

app_name = 'mail'

urlpatterns = [
    path('', MailListView.as_view(), name='mail-list'),
    path('create/', MailCreateView.as_view(), name='mail-create'),
    path('<int:mail_id>/', MailDetailView.as_view(), name='mail-detail'),
    path('<int:mail_id>/delete/', MailDeleteView.as_view(), name='mail-delete'),
    path('<int:mail_id>/status/', MailStatusUpdateView.as_view(), name='mail-status-update'),
    path('<int:mail_id>/comments/', MailCommentView.as_view(), name='mail-comments'),
    path('<int:mail_id>/forward/', MailForwardView.as_view(), name='mail-forward'),
    path('<int:mail_id>/history/', MailHistoryView.as_view(), name='mail-history'),
    path('statistics/', MailStatisticsView.as_view(), name='mail-statistics'),
]
