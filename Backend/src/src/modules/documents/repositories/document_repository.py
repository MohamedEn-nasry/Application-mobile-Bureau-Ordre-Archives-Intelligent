from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
import hashlib
import uuid
from modules.documents.dto.document_dto import (
    DocumentCreateDTO, DocumentUpdateDTO, DocumentCommentDTO, DocumentShareDTO
)
from modules.documents.entities.document_models import (
    Document, DocumentVersion, DocumentCategory, DocumentCategoryAssignment,
    DocumentAccess, DocumentActivity, DocumentComment, DocumentShare
)
from modules.users.entities import User
import logging

logger = logging.getLogger(__name__)


class DocumentRepository:
    """Repository for document data operations."""
    
    @staticmethod
    def get_document_by_id(document_id: int) -> Document:
        """Get document by ID."""
        try:
            return Document.objects.select_related(
                'uploaded_by', 'reviewed_by', 'approved_by'
            ).prefetch_related(
                'comments', 'versions', 'access_permissions', 'activities', 'shares'
            ).get(id=document_id)
        except Document.DoesNotExist:
            return None
    
    @staticmethod
    def get_all_documents():
        """Get all documents."""
        return Document.objects.select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).order_by('-uploaded_at')
    
    @staticmethod
    def get_user_accessible_documents(user: User):
        """Get documents accessible to a user."""
        return Document.objects.filter(
            Q(uploaded_by=user) |
            Q(is_public=True) |
            Q(access_permissions__user=user, access_permissions__is_active=True)
        ).select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).distinct().order_by('-uploaded_at')
    
    @staticmethod
    def get_user_documents(user: User):
        """Get documents uploaded by a user."""
        return Document.objects.filter(
            uploaded_by=user
        ).select_related(
            'reviewed_by', 'approved_by'
        ).order_by('-uploaded_at')
    
    @staticmethod
    def create_document(document_dto: DocumentCreateDTO, uploaded_by: User) -> Document:
        """Create new document."""
        # Generate checksum
        checksum = DocumentRepository.generate_checksum(document_dto.file_path)
        
        document = Document.objects.create(
            title=document_dto.title,
            description=document_dto.description,
            file_name=document_dto.file_name,
            file_path=document_dto.file_path,
            file_size=document_dto.file_size,
            file_type=document_dto.file_type,
            mime_type=document_dto.mime_type,
            document_type=document_dto.document_type,
            status=document_dto.status or 'draft',
            tags=document_dto.tags or [],
            uploaded_by=uploaded_by,
            expires_at=document_dto.expires_at,
            notes=document_dto.notes,
            is_public=document_dto.is_public,
            checksum=checksum
        )
        
        return document
    
    @staticmethod
    def update_document(document: Document, document_dto: DocumentUpdateDTO, updated_by: User) -> Document:
        """Update document details."""
        # Update fields if provided
        if document_dto.title is not None:
            document.title = document_dto.title
        if document_dto.description is not None:
            document.description = document_dto.description
        if document_dto.status is not None:
            document.status = document_dto.status
        if document_dto.tags is not None:
            document.tags = document_dto.tags
        if document_dto.expires_at is not None:
            document.expires_at = document_dto.expires_at
        if document_dto.notes is not None:
            document.notes = document_dto.notes
        if document_dto.is_public is not None:
            document.is_public = document_dto.is_public
        
        document.save()
        return document
    
    @staticmethod
    def delete_document(document: Document):
        """Delete document."""
        document.delete()
    
    @staticmethod
    def update_document_status(document: Document, new_status: str, updated_by: User) -> Document:
        """Update document status."""
        old_status = document.status
        document.status = new_status
        
        # Set reviewer/approver based on status
        if new_status == 'approved':
            document.approved_by = updated_by
            document.approved_at = timezone.now()
        elif new_status in ['pending', 'rejected']:
            document.reviewed_by = updated_by
            document.reviewed_at = timezone.now()
        
        document.save()
        return document
    
    @staticmethod
    def get_document_comments(document_id: int):
        """Get document comments."""
        return DocumentComment.objects.filter(
            document_id=document_id
        ).select_related('author').order_by('created_at')
    
    @staticmethod
    def create_document_comment(document_id: int, comment_dto: DocumentCommentDTO, author: User) -> DocumentComment:
        """Create document comment."""
        return DocumentComment.objects.create(
            document_id=document_id,
            author=author,
            content=comment_dto.content,
            is_internal=comment_dto.is_internal
        )
    
    @staticmethod
    def create_document_share(document_id: int, share_dto: DocumentShareDTO, created_by: User) -> DocumentShare:
        """Create document share."""
        share_token = DocumentRepository.generate_share_token()
        
        return DocumentShare.objects.create(
            document_id=document_id,
            share_token=share_token,
            created_by=created_by,
            expires_at=share_dto.expires_at,
            download_limit=share_dto.download_limit,
            password=share_dto.password
        )
    
    @staticmethod
    def get_document_history(document_id: int):
        """Get document history."""
        return DocumentActivity.objects.filter(
            document_id=document_id
        ).select_related('user').order_by('-timestamp')
    
    @staticmethod
    def log_document_activity(document: Document, action: str, description: str, user: User, ip_address: str = None):
        """Log document activity."""
        DocumentActivity.objects.create(
            document=document,
            user=user,
            action=action,
            description=description,
            ip_address=ip_address
        )
    
    @staticmethod
    def can_user_access_document(document: Document, user: User) -> bool:
        """Check if user can access document."""
        if user.is_admin:
            return True
        
        # User can access if they uploaded it, it's public, or they have explicit permission
        return (
            document.uploaded_by == user or
            document.is_public or
            document.access_permissions.filter(
                user=user,
                is_active=True
            ).exists()
        )
    
    @staticmethod
    def can_user_edit_document(document: Document, user: User) -> bool:
        """Check if user can edit document."""
        if user.is_admin:
            return True
        
        # User can edit if they uploaded it or have write/admin permission
        return (
            document.uploaded_by == user or
            document.access_permissions.filter(
                user=user,
                permission__in=['write', 'admin'],
                is_active=True
            ).exists()
        )
    
    @staticmethod
    def can_user_share_document(document: Document, user: User) -> bool:
        """Check if user can share document."""
        if user.is_admin:
            return True
        
        # User can share if they uploaded it or have admin permission
        return (
            document.uploaded_by == user or
            document.access_permissions.filter(
                user=user,
                permission='admin',
                is_active=True
            ).exists()
        )
    
    @staticmethod
    def search_documents(query: str, requesting_user: User):
        """Search documents by query."""
        queryset = Document.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(file_name__icontains=query) |
            Q(tags__icontains=query)
        )
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(uploaded_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).distinct().order_by('-uploaded_at')[:50]  # Limit results
    
    @staticmethod
    def get_expired_documents(requesting_user: User):
        """Get expired documents."""
        now = timezone.now()
        queryset = Document.objects.filter(expires_at__lt=now)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(uploaded_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).distinct().order_by('expires_at')
    
    @staticmethod
    def get_document_statistics(requesting_user: User) -> dict:
        """Get document statistics."""
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        queryset = Document.objects.all()
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(uploaded_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        stats = {
            'total_documents': queryset.count(),
            'documents_by_status': list(
                queryset.values('status')
                .annotate(count=Count('id'))
                .order_by('status')
            ),
            'documents_by_type': list(
                queryset.values('document_type')
                .annotate(count=Count('id'))
                .order_by('document_type')
            ),
            'documents_last_30_days': queryset.filter(uploaded_at__gte=thirty_days_ago).count(),
            'expired_documents': queryset.filter(expires_at__lt=now).count(),
            'public_documents': queryset.filter(is_public=True).count(),
            'total_downloads': queryset.aggregate(total=Count('download_count'))['total'] or 0,
            'total_file_size': queryset.aggregate(total=Avg('file_size'))['total'] or 0,
        }
        
        return stats
    
    @staticmethod
    def serialize_document(document: Document) -> dict:
        """Serialize document object to dictionary."""
        return {
            'id': document.id,
            'title': document.title,
            'description': document.description,
            'file_name': document.file_name,
            'file_path': document.file_path,
            'file_size': document.file_size,
            'file_type': document.file_type,
            'mime_type': document.mime_type,
            'document_type': document.document_type,
            'version': document.version,
            'status': document.status,
            'tags': document.tags,
            'uploaded_by': {
                'id': document.uploaded_by.id,
                'name': document.uploaded_by.get_full_name(),
                'email': document.uploaded_by.email
            } if document.uploaded_by else None,
            'reviewed_by': {
                'id': document.reviewed_by.id,
                'name': document.reviewed_by.get_full_name(),
                'email': document.reviewed_by.email
            } if document.reviewed_by else None,
            'approved_by': {
                'id': document.approved_by.id,
                'name': document.approved_by.get_full_name(),
                'email': document.approved_by.email
            } if document.approved_by else None,
            'uploaded_at': document.uploaded_at,
            'reviewed_at': document.reviewed_at,
            'approved_at': document.approved_at,
            'expires_at': document.expires_at,
            'notes': document.notes,
            'is_public': document.is_public,
            'download_count': document.download_count,
            'checksum': document.checksum,
            'is_expired': document.is_expired,
            'file_extension': document.file_extension,
            'formatted_file_size': document.formatted_file_size,
        }
    
    @staticmethod
    def increment_download_count(document: Document):
        """Increment document download count."""
        document.download_count += 1
        document.save(update_fields=['download_count'])
    
    @staticmethod
    def generate_checksum(file_path: str) -> str:
        """Generate file checksum."""
        # This is a simplified version - in production, you'd read the actual file
        return hashlib.sha256(file_path.encode()).hexdigest()
    
    @staticmethod
    def generate_share_token() -> str:
        """Generate unique share token."""
        return str(uuid.uuid4())
    
    @staticmethod
    def get_documents_by_status(status: str, requesting_user: User):
        """Get documents by status."""
        queryset = Document.objects.filter(status=status)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(uploaded_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).distinct().order_by('-uploaded_at')
    
    @staticmethod
    def get_documents_by_type(document_type: str, requesting_user: User):
        """Get documents by type."""
        queryset = Document.objects.filter(document_type=document_type)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(uploaded_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related(
            'uploaded_by', 'reviewed_by', 'approved_by'
        ).distinct().order_by('-uploaded_at')
    
    @staticmethod
    def grant_document_access(document: Document, user: User, permission: str, granted_by: User, expires_at=None):
        """Grant document access to user."""
        # Deactivate existing permissions
        DocumentAccess.objects.filter(
            document=document,
            user=user
        ).update(is_active=False)
        
        # Create new permission
        DocumentAccess.objects.create(
            document=document,
            user=user,
            permission=permission,
            granted_by=granted_by,
            expires_at=expires_at
        )
    
    @staticmethod
    def revoke_document_access(document: Document, user: User):
        """Revoke document access from user."""
        DocumentAccess.objects.filter(
            document=document,
            user=user,
            is_active=True
        ).update(is_active=False)
    
    @staticmethod
    def get_document_access_permissions(document: Document):
        """Get document access permissions."""
        return DocumentAccess.objects.filter(
            document=document,
            is_active=True
        ).select_related('user', 'granted_by')
    
    @staticmethod
    def cleanup_expired_shares():
        """Clean up expired share links."""
        now = timezone.now()
        count = DocumentShare.objects.filter(
            expires_at__lt=now,
            is_active=True
        ).update(is_active=False)
        logger.info(f"Deactivated {count} expired share links")
        return count
    
    @staticmethod
    def cleanup_expired_documents():
        """Archive expired documents."""
        now = timezone.now()
        count = Document.objects.filter(
            expires_at__lt=now,
            status__in=['draft', 'pending', 'approved']
        ).update(status='archived')
        logger.info(f"Archived {count} expired documents")
        return count
