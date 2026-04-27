from django.urls import path
from modules.archives.controllers.archive_views import (
    ArchiveListView, ArchiveCreateView, ArchiveDetailView, ArchiveDeleteView,
    ArchiveStatusUpdateView, ArchiveCommentView, ArchiveRequestView,
    ArchiveHistoryView, ArchiveStatisticsView, ArchiveExpiredView
)

app_name = 'archives'

urlpatterns = [
    path('', ArchiveListView.as_view(), name='archive-list'),
    path('create/', ArchiveCreateView.as_view(), name='archive-create'),
    path('<int:archive_id>/', ArchiveDetailView.as_view(), name='archive-detail'),
    path('<int:archive_id>/delete/', ArchiveDeleteView.as_view(), name='archive-delete'),
    path('<int:archive_id>/status/', ArchiveStatusUpdateView.as_view(), name='archive-status-update'),
    path('<int:archive_id>/comments/', ArchiveCommentView.as_view(), name='archive-comments'),
    path('requests/', ArchiveRequestView.as_view(), name='archive-requests'),
    path('<int:archive_id>/history/', ArchiveHistoryView.as_view(), name='archive-history'),
    path('statistics/', ArchiveStatisticsView.as_view(), name='archive-statistics'),
    path('expired/', ArchiveExpiredView.as_view(), name='archive-expired'),
]
