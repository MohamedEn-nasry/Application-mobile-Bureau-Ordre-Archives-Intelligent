from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
import uuid
from modules.archives.dto.archive_dto import (
    ArchiveCreateDTO, ArchiveUpdateDTO, ArchiveCommentDTO, ArchiveRequestDTO
)
from modules.archives.entities.archive_models import (
    Archive, ArchiveCategory, ArchiveAccess, ArchiveActivity,
    ArchiveComment, ArchiveRequest, ArchiveDestruction
)
from modules.users.entities import User
import logging

logger = logging.getLogger(__name__)


class ArchiveRepository:
    """Repository for archive data operations."""
    
    @staticmethod
    def get_archive_by_id(archive_id: int) -> Archive:
        """Get archive by ID."""
        try:
            return Archive.objects.select_related(
                'archived_by'
            ).prefetch_related(
                'comments', 'access_permissions', 'activities', 'requests'
            ).get(id=archive_id)
        except Archive.DoesNotExist:
            return None
    
    @staticmethod
    def get_all_archives():
        """Get all archives."""
        return Archive.objects.select_related('archived_by').order_by('-archived_at')
    
    @staticmethod
    def get_user_accessible_archives(user: User):
        """Get archives accessible to a user."""
        return Archive.objects.filter(
            Q(archived_by=user) |
            Q(is_public=True) |
            Q(access_permissions__user=user, access_permissions__is_active=True)
        ).select_related('archived_by').distinct().order_by('-archived_at')
    
    @staticmethod
    def get_user_archives(user: User):
        """Get archives created by a user."""
        return Archive.objects.filter(
            archived_by=user
        ).order_by('-archived_at')
    
    @staticmethod
    def generate_reference_number() -> str:
        """Generate unique reference number."""
        year = timezone.now().year
        month = timezone.now().month
        
        # Get count for this month
        count = Archive.objects.filter(
            archived_at__year=year,
            archived_at__month=month
        ).count()
        
        # Generate reference: ARC-YYYYMM-NNNN
        return f"ARC-{year}{month:02d}-{count+1:04d}"
    
    @staticmethod
    def calculate_expiry_date(retention_period: str) -> timezone.datetime:
        """Calculate expiry date based on retention period."""
        now = timezone.now()
        
        retention_mapping = {
            '1_year': now + timedelta(days=365),
            '3_years': now + timedelta(days=365*3),
            '5_years': now + timedelta(days=365*5),
            '7_years': now + timedelta(days=365*7),
            '10_years': now + timedelta(days=365*10),
            'permanent': None
        }
        
        return retention_mapping.get(retention_period)
    
    @staticmethod
    def create_archive(archive_dto: ArchiveCreateDTO, reference_number: str, expires_at, archived_by: User) -> Archive:
        """Create new archive."""
        archive = Archive.objects.create(
            title=archive_dto.title,
            description=archive_dto.description,
            archive_type=archive_dto.archive_type,
            reference_number=reference_number,
            original_item_id=archive_dto.original_item_id,
            original_item_type=archive_dto.original_item_type,
            archived_by=archived_by,
            retention_period=archive_dto.retention_period,
            expires_at=expires_at,
            is_public=archive_dto.is_public,
            access_level=archive_dto.access_level,
            storage_location=archive_dto.storage_location,
            storage_size=archive_dto.storage_size,
            category=archive_dto.category,
            tags=archive_dto.tags or [],
            priority=archive_dto.priority,
            original_date=archive_dto.original_date
        )
        
        return archive
    
    @staticmethod
    def update_archive(archive: Archive, archive_dto: ArchiveUpdateDTO, updated_by: User) -> Archive:
        """Update archive details."""
        # Update fields if provided
        if archive_dto.title is not None:
            archive.title = archive_dto.title
        if archive_dto.description is not None:
            archive.description = archive_dto.description
        if archive_dto.status is not None:
            archive.status = archive_dto.status
        if archive_dto.category is not None:
            archive.category = archive_dto.category
        if archive_dto.tags is not None:
            archive.tags = archive_dto.tags
        if archive_dto.priority is not None:
            archive.priority = archive_dto.priority
        if archive_dto.is_public is not None:
            archive.is_public = archive_dto.is_public
        if archive_dto.access_level is not None:
            archive.access_level = archive_dto.access_level
        if archive_dto.storage_location is not None:
            archive.storage_location = archive_dto.storage_location
        
        archive.save()
        return archive
    
    @staticmethod
    def delete_archive(archive: Archive):
        """Delete archive."""
        archive.delete()
    
    @staticmethod
    def update_archive_status(archive: Archive, new_status: str, updated_by: User) -> Archive:
        """Update archive status."""
        old_status = archive.status
        archive.status = new_status
        archive.save()
        return archive
    
    @staticmethod
    def get_archive_comments(archive_id: int):
        """Get archive comments."""
        return ArchiveComment.objects.filter(
            archive_id=archive_id
        ).select_related('author').order_by('created_at')
    
    @staticmethod
    def create_archive_comment(archive_id: int, comment_dto: ArchiveCommentDTO, author: User) -> ArchiveComment:
        """Create archive comment."""
        return ArchiveComment.objects.create(
            archive_id=archive_id,
            author=author,
            content=comment_dto.content,
            is_internal=comment_dto.is_internal
        )
    
    @staticmethod
    def create_archive_request(request_dto: ArchiveRequestDTO, requested_by: User) -> ArchiveRequest:
        """Create archive request."""
        return ArchiveRequest.objects.create(
            archive_id=request_dto.archive_id,
            request_type=request_dto.request_type,
            requested_by=requested_by,
            reason=request_dto.reason
        )
    
    @staticmethod
    def get_archive_requests(requesting_user: User):
        """Get archive requests for a user."""
        if requesting_user.is_admin:
            return ArchiveRequest.objects.select_related('archive', 'requested_by', 'processed_by').order_by('-requested_at')
        else:
            return ArchiveRequest.objects.filter(
                requested_by=requesting_user
            ).select_related('archive', 'processed_by').order_by('-requested_at')
    
    @staticmethod
    def get_archive_history(archive_id: int):
        """Get archive history."""
        return ArchiveActivity.objects.filter(
            archive_id=archive_id
        ).select_related('user').order_by('-timestamp')
    
    @staticmethod
    def log_archive_activity(archive: Archive, action: str, description: str, user: User, ip_address: str = None):
        """Log archive activity."""
        ArchiveActivity.objects.create(
            archive=archive,
            user=user,
            action=action,
            description=description,
            ip_address=ip_address
        )
    
    @staticmethod
    def can_user_access_archive(archive: Archive, user: User) -> bool:
        """Check if user can access archive."""
        if user.is_admin:
            return True
        
        # User can access if they created it, it's public, or they have explicit permission
        return (
            archive.archived_by == user or
            archive.is_public or
            archive.access_permissions.filter(
                user=user,
                is_active=True
            ).exists()
        )
    
    @staticmethod
    def can_user_edit_archive(archive: Archive, user: User) -> bool:
        """Check if user can edit archive."""
        if user.is_admin:
            return True
        
        # User can edit if they created it or have write/admin permission
        return (
            archive.archived_by == user or
            archive.access_permissions.filter(
                user=user,
                permission__in=['write', 'admin'],
                is_active=True
            ).exists()
        )
    
    @staticmethod
    def search_archives(query: str, requesting_user: User):
        """Search archives by query."""
        queryset = Archive.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(reference_number__icontains=query) |
            Q(tags__icontains=query)
        )
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(archived_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related('archived_by').distinct().order_by('-archived_at')[:50]  # Limit results
    
    @staticmethod
    def get_expired_archives(requesting_user: User):
        """Get expired archives."""
        now = timezone.now()
        queryset = Archive.objects.filter(expires_at__lt=now)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(archived_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related('archived_by').distinct().order_by('expires_at')
    
    @staticmethod
    def get_archive_statistics(requesting_user: User) -> dict:
        """Get archive statistics."""
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        queryset = Archive.objects.all()
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(archived_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        stats = {
            'total_archives': queryset.count(),
            'archives_by_status': list(
                queryset.values('status')
                .annotate(count=Count('id'))
                .order_by('status')
            ),
            'archives_by_type': list(
                queryset.values('archive_type')
                .annotate(count=Count('id'))
                .order_by('archive_type')
            ),
            'archives_by_retention': list(
                queryset.values('retention_period')
                .annotate(count=Count('id'))
                .order_by('retention_period')
            ),
            'archives_last_30_days': queryset.filter(archived_at__gte=thirty_days_ago).count(),
            'expired_archives': queryset.filter(expires_at__lt=now).count(),
            'public_archives': queryset.filter(is_public=True).count(),
            'total_storage_size': queryset.aggregate(total=Count('storage_size'))['total'] or 0,
        }
        
        return stats
    
    @staticmethod
    def serialize_archive(archive: Archive) -> dict:
        """Serialize archive object to dictionary."""
        return {
            'id': archive.id,
            'title': archive.title,
            'description': archive.description,
            'archive_type': archive.archive_type,
            'reference_number': archive.reference_number,
            'original_item_id': archive.original_item_id,
            'original_item_type': archive.original_item_type,
            'archived_by': {
                'id': archive.archived_by.id,
                'name': archive.archived_by.get_full_name(),
                'email': archive.archived_by.email
            } if archive.archived_by else None,
            'archived_at': archive.archived_at,
            'retention_period': archive.retention_period,
            'expires_at': archive.expires_at,
            'status': archive.status,
            'is_public': archive.is_public,
            'access_level': archive.access_level,
            'storage_location': archive.storage_location,
            'storage_size': archive.storage_size,
            'checksum': archive.checksum,
            'category': archive.category,
            'tags': archive.tags,
            'priority': archive.priority,
            'original_date': archive.original_date,
            'last_accessed': archive.last_accessed,
            'last_modified': archive.last_modified,
            'is_expired': archive.is_expired,
            'days_until_expiry': archive.days_until_expiry,
            'retention_years': archive.retention_years,
        }
    
    @staticmethod
    def grant_archive_access(archive: Archive, user: User, permission: str, granted_by: User, expires_at=None):
        """Grant archive access to user."""
        # Deactivate existing permissions
        ArchiveAccess.objects.filter(
            archive=archive,
            user=user
        ).update(is_active=False)
        
        # Create new permission
        ArchiveAccess.objects.create(
            archive=archive,
            user=user,
            permission=permission,
            granted_by=granted_by,
            expires_at=expires_at
        )
    
    @staticmethod
    def revoke_archive_access(archive: Archive, user: User):
        """Revoke archive access from user."""
        ArchiveAccess.objects.filter(
            archive=archive,
            user=user,
            is_active=True
        ).update(is_active=False)
    
    @staticmethod
    def get_archive_access_permissions(archive: Archive):
        """Get archive access permissions."""
        return ArchiveAccess.objects.filter(
            archive=archive,
            is_active=True
        ).select_related('user', 'granted_by')
    
    @staticmethod
    def get_archives_by_status(status: str, requesting_user: User):
        """Get archives by status."""
        queryset = Archive.objects.filter(status=status)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(archived_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related('archived_by').distinct().order_by('-archived_at')
    
    @staticmethod
    def get_archives_by_type(archive_type: str, requesting_user: User):
        """Get archives by type."""
        queryset = Archive.objects.filter(archive_type=archive_type)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(archived_by=requesting_user) |
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
            else:
                queryset = queryset.filter(
                    Q(is_public=True) |
                    Q(access_permissions__user=requesting_user, access_permissions__is_active=True)
                )
        
        return queryset.select_related('archived_by').distinct().order_by('-archived_at')
    
    @staticmethod
    def cleanup_expired_archives():
        """Mark expired archives as expired."""
        now = timezone.now()
        count = Archive.objects.filter(
            expires_at__lt=now,
            status='active'
        ).update(status='expired')
        logger.info(f"Marked {count} archives as expired")
        return count
    
    @staticmethod
    def archive_original_item(item_id: int, item_type: str, archive_dto: ArchiveCreateDTO, archived_by: User):
        """Archive an original item."""
        # Create archive
        reference_number = ArchiveRepository.generate_reference_number()
        expires_at = ArchiveRepository.calculate_expiry_date(archive_dto.retention_period)
        
        archive = ArchiveRepository.create_archive(archive_dto, reference_number, expires_at, archived_by)
        
        # Log activity
        ArchiveRepository.log_archive_activity(
            archive=archive,
            action='item_archived',
            description=f'{item_type.title()} {item_id} archived as {reference_number}',
            user=archived_by,
            ip_address='system'
        )
        
        return archive
