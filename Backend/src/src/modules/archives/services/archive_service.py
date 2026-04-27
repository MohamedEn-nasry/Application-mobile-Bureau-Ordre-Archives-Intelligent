from django.utils import timezone
from django.db.models import Q, Count
from modules.archives.dto.archive_dto import (
    ArchiveCreateDTO, ArchiveUpdateDTO, ArchiveCommentDTO, ArchiveRequestDTO
)
from modules.archives.repositories.archive_repository import ArchiveRepository
from modules.archives.entities.archive_models import Archive
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
import logging

logger = logging.getLogger(__name__)


class ArchiveService:
    """Service for archive management operations."""
    
    @staticmethod
    def get_archives_queryset(requesting_user):
        """Get archives queryset based on user permissions."""
        if requesting_user.is_admin:
            return ArchiveRepository.get_all_archives()
        elif requesting_user.is_agent:
            # Agents can see all archives they created or have access to
            return ArchiveRepository.get_user_accessible_archives(requesting_user)
        else:
            # Regular users can only see public archives or archives they have access to
            return ArchiveRepository.get_user_archives(requesting_user)
    
    @staticmethod
    def create_archive(archive_dto: ArchiveCreateDTO, archived_by) -> dict:
        """Create a new archive."""
        try:
            # Generate reference number
            reference_number = ArchiveRepository.generate_reference_number()
            
            # Calculate expiry date based on retention period
            expires_at = ArchiveRepository.calculate_expiry_date(archive_dto.retention_period)
            
            # Create archive
            archive = ArchiveRepository.create_archive(archive_dto, reference_number, expires_at, archived_by)
            
            # Log activity
            ArchiveRepository.log_archive_activity(
                archive=archive,
                action='archive_created',
                description=f'Archive {reference_number} created by {archived_by.email}',
                user=archived_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': archive.id,
                    'reference_number': archive.reference_number,
                    'title': archive.title,
                    'archive_type': archive.archive_type,
                    'status': archive.status,
                    'retention_period': archive.retention_period,
                    'expires_at': archive.expires_at,
                    'archived_at': archive.archived_at
                }
            }
            
        except Exception as e:
            logger.error(f"Archive creation service error: {e}")
            return {
                'success': False,
                'error': 'Archive creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_archive_by_id(archive_id: int, requesting_user) -> dict:
        """Get archive by ID with permission check."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_access_archive(archive, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this archive'
                }
            
            return {
                'success': True,
                'data': ArchiveRepository.serialize_archive(archive)
            }
            
        except Exception as e:
            logger.error(f"Archive retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Archive retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_archive(archive_id: int, archive_dto: ArchiveUpdateDTO, updated_by) -> dict:
        """Update archive details."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_edit_archive(archive, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to edit this archive'
                }
            
            # Update archive
            updated_archive = ArchiveRepository.update_archive(archive, archive_dto, updated_by)
            
            # Log activity
            ArchiveRepository.log_archive_activity(
                archive=updated_archive,
                action='archive_updated',
                description=f'Archive {updated_archive.reference_number} updated by {updated_by.email}',
                user=updated_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': ArchiveRepository.serialize_archive(updated_archive)
            }
            
        except Exception as e:
            logger.error(f"Archive update service error: {e}")
            return {
                'success': False,
                'error': 'Archive update failed',
                'details': str(e)
            }
    
    @staticmethod
    def delete_archive(archive_id: int, deleted_by) -> dict:
        """Delete an archive."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions (only admin can delete archives)
            if not deleted_by.is_admin:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only admin can delete archives'
                }
            
            # Log activity before deletion
            ArchiveRepository.log_archive_activity(
                archive=archive,
                action='archive_deleted',
                description=f'Archive {archive.reference_number} deleted by {deleted_by.email}',
                user=deleted_by,
                ip_address='system'
            )
            
            # Delete archive
            ArchiveRepository.delete_archive(archive)
            
            return {
                'success': True,
                'data': None
            }
            
        except Exception as e:
            logger.error(f"Archive deletion service error: {e}")
            return {
                'success': False,
                'error': 'Archive deletion failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_archive_status(archive_id: int, new_status: str, updated_by) -> dict:
        """Update archive status."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_edit_archive(archive, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to update this archive'
                }
            
            old_status = archive.status
            
            # Update status
            updated_archive = ArchiveRepository.update_archive_status(archive, new_status, updated_by)
            
            # Log activity
            ArchiveRepository.log_archive_activity(
                archive=updated_archive,
                action='status_changed',
                description=f'Archive {updated_archive.reference_number} status changed from {old_status} to {new_status} by {updated_by.email}',
                user=updated_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': updated_archive.id,
                    'reference_number': updated_archive.reference_number,
                    'status': updated_archive.status,
                    'updated_at': updated_archive.last_modified
                }
            }
            
        except Exception as e:
            logger.error(f"Status update service error: {e}")
            return {
                'success': False,
                'error': 'Status update failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_archive_comments(archive_id: int, requesting_user) -> dict:
        """Get archive comments."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_access_archive(archive, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this archive'
                }
            
            comments = ArchiveRepository.get_archive_comments(archive_id)
            
            comment_list = []
            for comment in comments:
                comment_list.append({
                    'id': comment.id,
                    'content': comment.content,
                    'is_internal': comment.is_internal,
                    'author': {
                        'id': comment.author.id,
                        'name': comment.author.get_full_name(),
                        'email': comment.author.email
                    } if comment.author else None,
                    'created_at': comment.created_at,
                    'updated_at': comment.updated_at
                })
            
            return {
                'success': True,
                'data': comment_list
            }
            
        except Exception as e:
            logger.error(f"Comments retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Comments retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def create_archive_comment(archive_id: int, comment_dto: ArchiveCommentDTO, author) -> dict:
        """Create archive comment."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_access_archive(archive, author):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to comment on this archive'
                }
            
            # Create comment
            comment = ArchiveRepository.create_archive_comment(archive_id, comment_dto, author)
            
            # Log activity
            ArchiveRepository.log_archive_activity(
                archive=archive,
                action='comment_added',
                description=f'Comment added to archive {archive.reference_number} by {author.email}',
                user=author,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': comment.id,
                    'content': comment.content,
                    'is_internal': comment.is_internal,
                    'author': {
                        'id': comment.author.id,
                        'name': comment.author.get_full_name(),
                        'email': comment.author.email
                    } if comment.author else None,
                    'created_at': comment.created_at
                }
            }
            
        except Exception as e:
            logger.error(f"Comment creation service error: {e}")
            return {
                'success': False,
                'error': 'Comment creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def create_archive_request(request_dto: ArchiveRequestDTO, requested_by) -> dict:
        """Create archive request."""
        try:
            archive = ArchiveRepository.get_archive_by_id(request_dto.archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_access_archive(archive, requested_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this archive'
                }
            
            # Create request
            request = ArchiveRepository.create_archive_request(request_dto, requested_by)
            
            # Log activity
            ArchiveRepository.log_archive_activity(
                archive=archive,
                action='request_created',
                description=f'{request_dto.request_type} request created for archive {archive.reference_number} by {requested_by.email}',
                user=requested_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': request.id,
                    'request_type': request.request_type,
                    'status': request.status,
                    'requested_at': request.requested_at,
                    'archive_reference': archive.reference_number
                }
            }
            
        except Exception as e:
            logger.error(f"Request creation service error: {e}")
            return {
                'success': False,
                'error': 'Request creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_archive_requests(requesting_user) -> dict:
        """Get archive requests."""
        try:
            requests = ArchiveRepository.get_archive_requests(requesting_user)
            
            request_list = []
            for req in requests:
                request_list.append({
                    'id': req.id,
                    'request_type': req.request_type,
                    'status': req.status,
                    'reason': req.reason,
                    'archive_reference': req.archive.reference_number,
                    'archive_title': req.archive.title,
                    'requested_at': req.requested_at,
                    'processed_at': req.processed_at,
                    'processing_notes': req.processing_notes
                })
            
            return {
                'success': True,
                'data': request_list
            }
            
        except Exception as e:
            logger.error(f"Requests retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Requests retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_archive_history(archive_id: int, requesting_user) -> dict:
        """Get archive history."""
        try:
            archive = ArchiveRepository.get_archive_by_id(archive_id)
            if not archive:
                return {
                    'success': False,
                    'error': 'Archive not found'
                }
            
            # Check permissions
            if not ArchiveRepository.can_user_access_archive(archive, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this archive'
                }
            
            history = ArchiveRepository.get_archive_history(archive_id)
            
            history_list = []
            for item in history:
                history_list.append({
                    'id': item.id,
                    'action': item.action,
                    'description': item.description,
                    'user': {
                        'id': item.user.id,
                        'name': item.user.get_full_name(),
                        'email': item.user.email
                    } if item.user else None,
                    'timestamp': item.timestamp,
                    'ip_address': item.ip_address
                })
            
            return {
                'success': True,
                'data': history_list
            }
            
        except Exception as e:
            logger.error(f"History retrieval service error: {e}")
            return {
                'success': False,
                'error': 'History retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_archive_statistics(requesting_user) -> dict:
        """Get archive statistics."""
        try:
            if not requesting_user.is_agent:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only agents can view archive statistics'
                }
            
            stats = ArchiveRepository.get_archive_statistics(requesting_user)
            
            return {
                'success': True,
                'data': stats
            }
            
        except Exception as e:
            logger.error(f"Statistics retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get archive statistics',
                'details': str(e)
            }
    
    @staticmethod
    def get_expired_archives(requesting_user) -> dict:
        """Get expired archives."""
        try:
            archives = ArchiveRepository.get_expired_archives(requesting_user)
            
            archive_list = []
            for archive in archives:
                archive_list.append({
                    'id': archive.id,
                    'reference_number': archive.reference_number,
                    'title': archive.title,
                    'archive_type': archive.archive_type,
                    'status': archive.status,
                    'expires_at': archive.expires_at,
                    'days_until_expiry': archive.days_until_expiry,
                    'archived_by': archive.archived_by.get_full_name() if archive.archived_by else None,
                })
            
            return {
                'success': True,
                'data': archive_list
            }
            
        except Exception as e:
            logger.error(f"Expired archives retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get expired archives',
                'details': str(e)
            }
    
    @staticmethod
    def search_archives(query: str, requesting_user) -> dict:
        """Search archives by query."""
        try:
            archives = ArchiveRepository.search_archives(query, requesting_user)
            
            archive_list = []
            for archive in archives:
                archive_list.append({
                    'id': archive.id,
                    'reference_number': archive.reference_number,
                    'title': archive.title,
                    'description': archive.description,
                    'archive_type': archive.archive_type,
                    'status': archive.status,
                    'archived_at': archive.archived_at,
                    'archived_by': archive.archived_by.get_full_name() if archive.archived_by else None,
                })
            
            return {
                'success': True,
                'data': archive_list
            }
            
        except Exception as e:
            logger.error(f"Archive search service error: {e}")
            return {
                'success': False,
                'error': 'Archive search failed',
                'details': str(e)
            }
