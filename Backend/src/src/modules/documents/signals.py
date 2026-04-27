from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from modules.documents.entities.document_models import (
    Document, DocumentComment, DocumentShare, DocumentActivity
)
from modules.documents.repositories.document_repository import DocumentRepository
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Document)
def document_created(sender, instance, created, **kwargs):
    """Handle document creation signals."""
    if created:
        logger.info(f"New document created: {instance.title}")
        
        # Log activity
        DocumentRepository.log_document_activity(
            document=instance,
            action='document_created',
            description=f'Document {instance.title} uploaded',
            user=instance.uploaded_by,
            ip_address='system'
        )


@receiver(post_save, sender=Document)
def document_updated(sender, instance, created, **kwargs):
    """Handle document update signals."""
    if not created:
        logger.info(f"Document updated: {instance.title}")


@receiver(post_delete, sender=Document)
def document_deleted(sender, instance, **kwargs):
    """Handle document deletion signals."""
    logger.info(f"Document deleted: {instance.title}")


@receiver(post_save, sender=DocumentComment)
def document_comment_created(sender, instance, created, **kwargs):
    """Handle document comment creation signals."""
    if created:
        logger.info(f"Comment created for document: {instance.document.title}")
        
        # Log activity
        DocumentRepository.log_document_activity(
            document=instance.document,
            action='comment_added',
            description=f'Comment added to document {instance.document.title}',
            user=instance.author,
            ip_address='system'
        )


@receiver(post_save, sender=DocumentShare)
def document_share_created(sender, instance, created, **kwargs):
    """Handle document share creation signals."""
    if created:
        logger.info(f"Share link created for document: {instance.document.title}")
        
        # Log activity
        DocumentRepository.log_document_activity(
            document=instance.document,
            action='share_created',
            description=f'Share link created for document {instance.document.title}',
            user=instance.created_by,
            ip_address='system'
        )


@receiver(post_delete, sender=DocumentShare)
def document_share_deleted(sender, instance, **kwargs):
    """Handle document share deletion signals."""
    logger.info(f"Share link deleted for document: {instance.document.title}")
    
    # Log activity
    DocumentRepository.log_document_activity(
        document=instance.document,
        action='share_deleted',
        description=f'Share link deleted for document {instance.document.title}',
        user=None,  # We don't have the user who deleted it here
        ip_address='system'
    )
