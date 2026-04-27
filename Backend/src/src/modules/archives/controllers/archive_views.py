from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from modules.archives.dto.archive_dto import (
    ArchiveCreateDTO, ArchiveUpdateDTO, ArchiveResponseDTO, ArchiveListDTO,
    ArchiveCommentDTO, ArchiveRequestDTO
)
from modules.archives.services.archive_service import ArchiveService
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
from common.guards.auth_guards import IsAgent
from common.dto.pagination_dto import CustomPagination
import logging

logger = logging.getLogger(__name__)


class ArchiveListView(generics.ListAPIView):
    """List all archives with filtering and pagination."""
    permission_classes = [IsAuthenticated, IsAgent]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'reference_number', 'tags']
    filterset_fields = ['status', 'archive_type', 'archived_by', 'category', 'priority']
    ordering_fields = ['archived_at', 'title', 'expires_at', 'priority']
    ordering = ['-archived_at']
    
    def get_queryset(self):
        """Get filtered queryset of archives."""
        return ArchiveService.get_archives_queryset(self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List archives with pagination."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = ArchiveListDTO(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = ArchiveListDTO(queryset, many=True)
            return Response(
                SuccessResponseDTO(
                    message="Archives retrieved successfully",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Archive list error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve archives",
                    details=str(e),
                    code='archive_list_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArchiveCreateView(generics.CreateAPIView):
    """Create new archive."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def post(self, request):
        """Create a new archive."""
        try:
            archive_dto = ArchiveCreateDTO(**request.data)
            result = ArchiveService.create_archive(archive_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Archive created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='archive_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Archive creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Archive creation failed",
                    details=str(e),
                    code='archive_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArchiveDetailView(generics.RetrieveUpdateAPIView):
    """Get, update archive details."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, archive_id):
        """Get archive details."""
        try:
            result = ArchiveService.get_archive_by_id(archive_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Archive retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='archive_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Archive retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Archive retrieval failed",
                    details=str(e),
                    code='archive_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, archive_id):
        """Update archive details."""
        try:
            archive_dto = ArchiveUpdateDTO(**request.data)
            result = ArchiveService.update_archive(archive_id, archive_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Archive updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='archive_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Archive update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Archive update failed",
                    details=str(e),
                    code='archive_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArchiveDeleteView(generics.DestroyAPIView):
    """Delete archive (admin only)."""
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, archive_id):
        """Delete an archive."""
        try:
            result = ArchiveService.delete_archive(archive_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Archive deleted successfully"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='archive_deletion_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Archive deletion error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Archive deletion failed",
                    details=str(e),
                    code='archive_deletion_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArchiveStatusUpdateView(generics.UpdateAPIView):
    """Update archive status."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def put(self, request, archive_id):
        """Update archive status."""
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
            
            result = ArchiveService.update_archive_status(archive_id, new_status, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Archive status updated successfully",
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


class ArchiveCommentView(generics.ListCreateAPIView):
    """Get and create archive comments."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, archive_id):
        """Get archive comments."""
        try:
            result = ArchiveService.get_archive_comments(archive_id, request.user)
            
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
    
    def post(self, request, archive_id):
        """Create archive comment."""
        try:
            comment_dto = ArchiveCommentDTO(**request.data)
            result = ArchiveService.create_archive_comment(archive_id, comment_dto, request.user)
            
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


class ArchiveRequestView(generics.ListCreateAPIView):
    """Get and create archive requests."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get archive requests."""
        try:
            result = ArchiveService.get_archive_requests(request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Requests retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='requests_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Requests retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Requests retrieval failed",
                    details=str(e),
                    code='requests_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """Create archive request."""
        try:
            request_dto = ArchiveRequestDTO(**request.data)
            result = ArchiveService.create_archive_request(request_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Request created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='request_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Request creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Request creation failed",
                    details=str(e),
                    code='request_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArchiveHistoryView(generics.ListAPIView):
    """Get archive history."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, archive_id):
        """Get archive history."""
        try:
            result = ArchiveService.get_archive_history(archive_id, request.user)
            
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


class ArchiveStatisticsView(generics.RetrieveAPIView):
    """Get archive statistics."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request):
        """Get archive statistics."""
        try:
            result = ArchiveService.get_archive_statistics(request.user)
            
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


class ArchiveExpiredView(generics.ListAPIView):
    """Get expired archives."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request):
        """Get expired archives."""
        try:
            result = ArchiveService.get_expired_archives(request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Expired archives retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='expired_archives_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Expired archives retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve expired archives",
                    details=str(e),
                    code='expired_archives_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
