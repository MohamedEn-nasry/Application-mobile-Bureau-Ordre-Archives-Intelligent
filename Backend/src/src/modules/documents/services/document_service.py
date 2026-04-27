from django.utils import timezone
from django.db.models import Q, Count
from modules.documents.dto.document_dto import (
    DocumentCreateDTO, DocumentUpdateDTO, DocumentCommentDTO, DocumentShareDTO
)
from modules.documents.repositories.document_repository import DocumentRepository
from modules.documents.entities.document_models import Document
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
import logging

logger = logging.getLogger(__name__)


class DocumentService:
    """Service for document management operations."""
    
    @staticmethod
    def get_documents_queryset(requesting_user):
        """Get documents queryset based on user permissions."""
        if requesting_user.is_admin:
            return DocumentRepository.get_all_documents()
        elif requesting_user.is_agent:
            # Agents can see all documents they uploaded or have access to
            return DocumentRepository.get_user_accessible_documents(requesting_user)
        else:
            # Regular users can only see public documents or documents they have access to
            return DocumentRepository.get_user_documents(requesting_user)
    
    @staticmethod
    def create_document(document_dto: DocumentCreateDTO, uploaded_by) -> dict:
        """Create a new document."""
        try:
            # Create document
            document = DocumentRepository.create_document(document_dto, uploaded_by)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=document,
                action='document_created',
                description=f'Document {document.title} uploaded by {uploaded_by.email}',
                user=uploaded_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': document.id,
                    'title': document.title,
                    'file_name': document.file_name,
                    'document_type': document.document_type,
                    'status': document.status,
                    'version': document.version,
                    'uploaded_at': document.uploaded_at
                }
            }
            
        except Exception as e:
            logger.error(f"Document creation service error: {e}")
            return {
                'success': False,
                'error': 'Document creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_document_by_id(document_id: int, requesting_user) -> dict:
        """Get document by ID with permission check."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_access_document(document, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this document'
                }
            
            return {
                'success': True,
                'data': DocumentRepository.serialize_document(document)
            }
            
        except Exception as e:
            logger.error(f"Document retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Document retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_document(document_id: int, document_dto: DocumentUpdateDTO, updated_by) -> dict:
        """Update document details."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_edit_document(document, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to edit this document'
                }
            
            # Update document
            updated_document = DocumentRepository.update_document(document, document_dto, updated_by)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=updated_document,
                action='document_updated',
                description=f'Document {updated_document.title} updated by {updated_by.email}',
                user=updated_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': DocumentRepository.serialize_document(updated_document)
            }
            
        except Exception as e:
            logger.error(f"Document update service error: {e}")
            return {
                'success': False,
                'error': 'Document update failed',
                'details': str(e)
            }
    
    @staticmethod
    def delete_document(document_id: int, deleted_by) -> dict:
        """Delete a document."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions (only admin or creator can delete)
            if not deleted_by.is_admin and document.uploaded_by != deleted_by:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only admin or document creator can delete document'
                }
            
            # Log activity before deletion
            DocumentRepository.log_document_activity(
                document=document,
                action='document_deleted',
                description=f'Document {document.title} deleted by {deleted_by.email}',
                user=deleted_by,
                ip_address='system'
            )
            
            # Delete document
            DocumentRepository.delete_document(document)
            
            return {
                'success': True,
                'data': None
            }
            
        except Exception as e:
            logger.error(f"Document deletion service error: {e}")
            return {
                'success': False,
                'error': 'Document deletion failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_document_status(document_id: int, new_status: str, updated_by) -> dict:
        """Update document status."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_edit_document(document, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to update this document'
                }
            
            old_status = document.status
            
            # Update status
            updated_document = DocumentRepository.update_document_status(document, new_status, updated_by)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=updated_document,
                action='status_changed',
                description=f'Document {updated_document.title} status changed from {old_status} to {new_status} by {updated_by.email}',
                user=updated_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': updated_document.id,
                    'title': updated_document.title,
                    'status': updated_document.status,
                    'updated_at': updated_document.updated_at
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
    def get_document_comments(document_id: int, requesting_user) -> dict:
        """Get document comments."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_access_document(document, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this document'
                }
            
            comments = DocumentRepository.get_document_comments(document_id)
            
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
    def create_document_comment(document_id: int, comment_dto: DocumentCommentDTO, author) -> dict:
        """Create document comment."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_access_document(document, author):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to comment on this document'
                }
            
            # Create comment
            comment = DocumentRepository.create_document_comment(document_id, comment_dto, author)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=document,
                action='comment_added',
                description=f'Comment added to document {document.title} by {author.email}',
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
    def create_document_share(document_id: int, share_dto: DocumentShareDTO, created_by) -> dict:
        """Create document share link."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_share_document(document, created_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to share this document'
                }
            
            # Create share
            share = DocumentRepository.create_document_share(document_id, share_dto, created_by)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=document,
                action='share_created',
                description=f'Share link created for document {document.title} by {created_by.email}',
                user=created_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': share.id,
                    'share_token': share.share_token,
                    'expires_at': share.expires_at,
                    'download_limit': share.download_limit,
                    'created_at': share.created_at
                }
            }
            
        except Exception as e:
            logger.error(f"Share creation service error: {e}")
            return {
                'success': False,
                'error': 'Share creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def download_document(document_id: int, requesting_user) -> dict:
        """Download document."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_access_document(document, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this document'
                }
            
            # Increment download count
            DocumentRepository.increment_download_count(document)
            
            # Log activity
            DocumentRepository.log_document_activity(
                document=document,
                action='document_downloaded',
                description=f'Document {document.title} downloaded by {requesting_user.email}',
                user=requesting_user,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'download_url': document.file_path,
                    'file_name': document.file_name,
                    'file_size': document.file_size,
                    'mime_type': document.mime_type
                }
            }
            
        except Exception as e:
            logger.error(f"Document download service error: {e}")
            return {
                'success': False,
                'error': 'Document download failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_document_history(document_id: int, requesting_user) -> dict:
        """Get document history."""
        try:
            document = DocumentRepository.get_document_by_id(document_id)
            if not document:
                return {
                    'success': False,
                    'error': 'Document not found'
                }
            
            # Check permissions
            if not DocumentRepository.can_user_access_document(document, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this document'
                }
            
            history = DocumentRepository.get_document_history(document_id)
            
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
    def get_document_statistics(requesting_user) -> dict:
        """Get document statistics."""
        try:
            if not requesting_user.is_agent:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only agents can view document statistics'
                }
            
            stats = DocumentRepository.get_document_statistics(requesting_user)
            
            return {
                'success': True,
                'data': stats
            }
            
        except Exception as e:
            logger.error(f"Statistics retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get document statistics',
                'details': str(e)
            }
    
    @staticmethod
    def search_documents(query: str, requesting_user) -> dict:
        """Search documents by query."""
        try:
            documents = DocumentRepository.search_documents(query, requesting_user)
            
            document_list = []
            for document in documents:
                document_list.append({
                    'id': document.id,
                    'title': document.title,
                    'description': document.description,
                    'document_type': document.document_type,
                    'status': document.status,
                    'uploaded_at': document.uploaded_at,
                    'uploaded_by': document.uploaded_by.get_full_name() if document.uploaded_by else None,
                })
            
            return {
                'success': True,
                'data': document_list
            }
            
        except Exception as e:
            logger.error(f"Document search service error: {e}")
            return {
                'success': False,
                'error': 'Document search failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_expired_documents(requesting_user) -> dict:
        """Get expired documents."""
        try:
            documents = DocumentRepository.get_expired_documents(requesting_user)
            
            document_list = []
            for document in documents:
                document_list.append({
                    'id': document.id,
                    'title': document.title,
                    'status': document.status,
                    'expires_at': document.expires_at,
                    'uploaded_by': document.uploaded_by.get_full_name() if document.uploaded_by else None,
                })
            
            return {
                'success': True,
                'data': document_list
            }
            
        except Exception as e:
            logger.error(f"Expired documents retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get expired documents',
                'details': str(e)
            }
