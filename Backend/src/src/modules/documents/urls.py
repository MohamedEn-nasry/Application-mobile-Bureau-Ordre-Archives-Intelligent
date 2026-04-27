from django.urls import path
from modules.documents.controllers.document_views import (
    DocumentListView, DocumentCreateView, DocumentDetailView, DocumentDeleteView,
    DocumentStatusUpdateView, DocumentCommentView, DocumentShareView,
    DocumentDownloadView, DocumentHistoryView, DocumentStatisticsView
)

app_name = 'documents'

urlpatterns = [
    path('', DocumentListView.as_view(), name='document-list'),
    path('create/', DocumentCreateView.as_view(), name='document-create'),
    path('<int:document_id>/', DocumentDetailView.as_view(), name='document-detail'),
    path('<int:document_id>/delete/', DocumentDeleteView.as_view(), name='document-delete'),
    path('<int:document_id>/status/', DocumentStatusUpdateView.as_view(), name='document-status-update'),
    path('<int:document_id>/comments/', DocumentCommentView.as_view(), name='document-comments'),
    path('<int:document_id>/share/', DocumentShareView.as_view(), name='document-share'),
    path('<int:document_id>/download/', DocumentDownloadView.as_view(), name='document-download'),
    path('<int:document_id>/history/', DocumentHistoryView.as_view(), name='document-history'),
    path('statistics/', DocumentStatisticsView.as_view(), name='document-statistics'),
]
