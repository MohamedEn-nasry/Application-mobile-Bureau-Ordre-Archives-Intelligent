from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from modules.archives.entities.archive_models import (
    Archive, ArchiveComment, ArchiveRequest, ArchiveActivity
)
from modules.archives.repositories.archive_repository import ArchiveRepository
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Archive)
def archive_created(sender, instance, created, **kwargs):
    """Handle archive creation signals."""
    if created:
        logger.info(f"New archive created: {instance.reference_number}")
        
        # Log activity
        ArchiveRepository.log_archive_activity(
            archive=instance,
            action='archive_created',
            description=f'Archive {instance.reference_number} created',
            user=instance.archived_by,
            ip_address='system'
        )


@receiver(post_save, sender=Archive)
def archive_updated(sender, instance, created, **kwargs):
    """Handle archive update signals."""
    if not created:
        logger.info(f"Archive updated: {instance.reference_number}")


@receiver(post_delete, sender=Archive)
def archive_deleted(sender, instance, **kwargs):
    """Handle archive deletion signals."""
    logger.info(f"Archive deleted: {instance.reference_number}")


@receiver(post_save, sender=ArchiveComment)
def archive_comment_created(sender, instance, created, **kwargs):
    """Handle archive comment creation signals."""
    if created:
        logger.info(f"Comment created for archive: {instance.archive.reference_number}")
        
        # Log activity
        ArchiveRepository.log_archive_activity(
            archive=instance.archive,
            action='comment_added',
            description=f'Comment added to archive {instance.archive.reference_number}',
            user=instance.author,
            ip_address='system'
        )


@receiver(post_save, sender=ArchiveRequest)
def archive_request_created(sender, instance, created, **kwargs):
    """Handle archive request creation signals."""
    if created:
        logger.info(f"Request created for archive: {instance.archive.reference_number}")
        
        # Log activity
        ArchiveRepository.log_archive_activity(
            archive=instance.archive,
            action='request_created',
            description=f'{instance.request_type} request created for archive {instance.archive.reference_number}',
            user=instance.requested_by,
            ip_address='system'
        )


@receiver(post_save, sender=ArchiveRequest)
def archive_request_updated(sender, instance, created, **kwargs):
    """Handle archive request update signals."""
    if not created and instance.status in ['approved', 'rejected', 'completed']:
        logger.info(f"Request {instance.request_type} for archive {instance.archive.reference_number} {instance.status}")
        
        # Log activity
        ArchiveRepository.log_archive_activity(
            archive=instance.archive,
            action=f'request_{instance.status}',
            description=f'{instance.request_type} request for archive {instance.archive.reference_number} {instance.status}',
            user=instance.processed_by,
            ip_address='system'
        )
