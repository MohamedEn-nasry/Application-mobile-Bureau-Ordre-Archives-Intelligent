from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from modules.documents.dto.document_dto import (
    DocumentCreateDTO, DocumentUpdateDTO, DocumentResponseDTO, DocumentListDTO,
    DocumentCommentDTO, DocumentShareDTO
)
from modules.documents.services.document_service import DocumentService
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
from common.guards.auth_guards import IsAgent
from common.dto.pagination_dto import CustomPagination
import logging

logger = logging.getLogger(__name__)


class DocumentListView(generics.ListAPIView):
    """List all documents with filtering and pagination."""
    permission_classes = [IsAuthenticated, IsAgent]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'file_name', 'tags']
    filterset_fields = ['status', 'document_type', 'uploaded_by', 'is_public']
    ordering_fields = ['uploaded_at', 'title', 'file_size', 'download_count']
    ordering = ['-uploaded_at']
    
    def get_queryset(self):
        """Get filtered queryset of documents."""
        return DocumentService.get_documents_queryset(self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List documents with pagination."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = DocumentListDTO(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = DocumentListDTO(queryset, many=True)
            return Response(
                SuccessResponseDTO(
                    message="Documents retrieved successfully",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Document list error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve documents",
                    details=str(e),
                    code='document_list_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentCreateView(generics.CreateAPIView):
    """Create new document."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def post(self, request):
        """Create a new document."""
        try:
            document_dto = DocumentCreateDTO(**request.data)
            result = DocumentService.create_document(document_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Document created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='document_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Document creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Document creation failed",
                    details=str(e),
                    code='document_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentDetailView(generics.RetrieveUpdateAPIView):
    """Get, update document details."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, document_id):
        """Get document details."""
        try:
            result = DocumentService.get_document_by_id(document_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Document retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='document_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Document retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Document retrieval failed",
                    details=str(e),
                    code='document_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, document_id):
        """Update document details."""
        try:
            document_dto = DocumentUpdateDTO(**request.data)
            result = DocumentService.update_document(document_id, document_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Document updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='document_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Document update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Document update failed",
                    details=str(e),
                    code='document_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentDeleteView(generics.DestroyAPIView):
    """Delete document (admin only or creator)."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def delete(self, request, document_id):
        """Delete a document."""
        try:
            result = DocumentService.delete_document(document_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Document deleted successfully"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='document_deletion_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Document deletion error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Document deletion failed",
                    details=str(e),
                    code='document_deletion_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentStatusUpdateView(generics.UpdateAPIView):
    """Update document status."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def put(self, request, document_id):
        """Update document status."""
        try:
            new_status = request.data.get('status')
            if not new_status:
                return Response(
                    ErrorResponseDTO(
                        error="Status is required",
                        code='status_required'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = DocumentService.update_document_status(document_id, new_status, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Document status updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='status_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Status update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Status update failed",
                    details=str(e),
                    code='status_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentCommentView(generics.ListCreateAPIView):
    """Get and create document comments."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, document_id):
        """Get document comments."""
        try:
            result = DocumentService.get_document_comments(document_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Comments retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='comments_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Comments retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Comments retrieval failed",
                    details=str(e),
                    code='comments_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request, document_id):
        """Create document comment."""
        try:
            comment_dto = DocumentCommentDTO(**request.data)
            result = DocumentService.create_document_comment(document_id, comment_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Comment created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='comment_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Comment creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Comment creation failed",
                    details=str(e),
                    code='comment_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentShareView(generics.CreateAPIView):
    """Create document share link."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def post(self, request, document_id):
        """Create share link for document."""
        try:
            share_dto = DocumentShareDTO(**request.data)
            result = DocumentService.create_document_share(document_id, share_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Share link created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='share_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Share creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Share creation failed",
                    details=str(e),
                    code='share_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentDownloadView(generics.RetrieveAPIView):
    """Download document."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, document_id):
        """Download document."""
        try:
            result = DocumentService.download_document(document_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Download link generated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='download_failed'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Document download error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Document download failed",
                    details=str(e),
                    code='document_download_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentHistoryView(generics.ListAPIView):
    """Get document history."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, document_id):
        """Get document history."""
        try:
            result = DocumentService.get_document_history(document_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="History retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='history_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"History retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="History retrieval failed",
                    details=str(e),
                    code='history_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentStatisticsView(generics.RetrieveAPIView):
    """Get document statistics."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request):
        """Get document statistics."""
        try:
            result = DocumentService.get_document_statistics(request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Statistics retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='statistics_not_available'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Statistics retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Statistics retrieval failed",
                    details=str(e),
                    code='statistics_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
