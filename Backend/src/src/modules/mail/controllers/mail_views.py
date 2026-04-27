from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from modules.mail.dto.mail_dto import (
    MailCreateDTO, MailUpdateDTO, MailResponseDTO, MailListDTO,
    MailCommentDTO, MailForwardDTO
)
from modules.mail.services.mail_service import MailService
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
from common.guards.auth_guards import IsAgent
from common.dto.pagination_dto import CustomPagination
import logging

logger = logging.getLogger(__name__)


class MailListView(generics.ListAPIView):
    """List all mails with filtering and pagination."""
    permission_classes = [IsAuthenticated, IsAgent]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['reference_number', 'subject', 'content', 'external_sender']
    filterset_fields = ['status', 'priority', 'mail_type', 'sender', 'recipient']
    ordering_fields = ['created_at', 'sent_date', 'due_date', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get filtered queryset of mails."""
        return MailService.get_mails_queryset(self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List mails with pagination."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = MailListDTO(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = MailListDTO(queryset, many=True)
            return Response(
                SuccessResponseDTO(
                    message="Mails retrieved successfully",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Mail list error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve mails",
                    details=str(e),
                    code='mail_list_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MailCreateView(generics.CreateAPIView):
    """Create new mail."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def post(self, request):
        """Create a new mail."""
        try:
            mail_dto = MailCreateDTO(**request.data)
            result = MailService.create_mail(mail_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='mail_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Mail creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Mail creation failed",
                    details=str(e),
                    code='mail_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MailDetailView(generics.RetrieveUpdateAPIView):
    """Get, update mail details."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, mail_id):
        """Get mail details."""
        try:
            result = MailService.get_mail_by_id(mail_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='mail_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Mail retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Mail retrieval failed",
                    details=str(e),
                    code='mail_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, mail_id):
        """Update mail details."""
        try:
            mail_dto = MailUpdateDTO(**request.data)
            result = MailService.update_mail(mail_id, mail_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='mail_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Mail update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Mail update failed",
                    details=str(e),
                    code='mail_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MailDeleteView(generics.DestroyAPIView):
    """Delete mail (admin only or creator)."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def delete(self, request, mail_id):
        """Delete a mail."""
        try:
            result = MailService.delete_mail(mail_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail deleted successfully"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='mail_deletion_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Mail deletion error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Mail deletion failed",
                    details=str(e),
                    code='mail_deletion_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MailStatusUpdateView(generics.UpdateAPIView):
    """Update mail status."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def put(self, request, mail_id):
        """Update mail status."""
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
            
            result = MailService.update_mail_status(mail_id, new_status, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail status updated successfully",
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


class MailCommentView(generics.ListCreateAPIView):
    """Get and create mail comments."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, mail_id):
        """Get mail comments."""
        try:
            result = MailService.get_mail_comments(mail_id, request.user)
            
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
    
    def post(self, request, mail_id):
        """Create mail comment."""
        try:
            comment_dto = MailCommentDTO(**request.data)
            result = MailService.create_mail_comment(mail_id, comment_dto, request.user)
            
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


class MailForwardView(generics.CreateAPIView):
    """Forward mail to another user."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def post(self, request, mail_id):
        """Forward mail."""
        try:
            forward_dto = MailForwardDTO(**request.data)
            result = MailService.forward_mail(mail_id, forward_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Mail forwarded successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='mail_forward_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Mail forward error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Mail forward failed",
                    details=str(e),
                    code='mail_forward_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MailHistoryView(generics.ListAPIView):
    """Get mail history."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request, mail_id):
        """Get mail history."""
        try:
            result = MailService.get_mail_history(mail_id, request.user)
            
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


class MailStatisticsView(generics.RetrieveAPIView):
    """Get mail statistics."""
    permission_classes = [IsAuthenticated, IsAgent]
    
    def get(self, request):
        """Get mail statistics."""
        try:
            result = MailService.get_mail_statistics(request.user)
            
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
