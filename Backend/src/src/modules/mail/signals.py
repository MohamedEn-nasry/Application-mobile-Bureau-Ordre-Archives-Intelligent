from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from modules.mail.entities.mail_models import Mail, MailComment, MailAttachment, MailHistory
from modules.mail.repositories.mail_repository import MailRepository
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Mail)
def mail_created(sender, instance, created, **kwargs):
    """Handle mail creation signals."""
    if created:
        logger.info(f"New mail created: {instance.reference_number}")
        
        # Log activity
        MailRepository.log_mail_activity(
            mail=instance,
            action='mail_created',
            description=f'Mail {instance.reference_number} created',
            performed_by=instance.created_by,
            ip_address='system'
        )


@receiver(post_save, sender=Mail)
def mail_updated(sender, instance, created, **kwargs):
    """Handle mail update signals."""
    if not created:
        logger.info(f"Mail updated: {instance.reference_number}")


@receiver(post_delete, sender=Mail)
def mail_deleted(sender, instance, **kwargs):
    """Handle mail deletion signals."""
    logger.info(f"Mail deleted: {instance.reference_number}")


@receiver(post_save, sender=MailComment)
def mail_comment_created(sender, instance, created, **kwargs):
    """Handle mail comment creation signals."""
    if created:
        logger.info(f"Comment created for mail: {instance.mail.reference_number}")
        
        # Log activity
        MailRepository.log_mail_activity(
            mail=instance.mail,
            action='comment_added',
            description=f'Comment added to mail {instance.mail.reference_number}',
            performed_by=instance.author,
            ip_address='system'
        )


@receiver(post_save, sender=MailAttachment)
def mail_attachment_created(sender, instance, created, **kwargs):
    """Handle mail attachment creation signals."""
    if created:
        logger.info(f"Attachment created for mail: {instance.mail.reference_number}")
        
        # Update attachments count
        mail = instance.mail
        mail.attachments_count = mail.attachments.count()
        mail.save(update_fields=['attachments_count'])
        
        # Log activity
        MailRepository.log_mail_activity(
            mail=mail,
            action='attachment_added',
            description=f'Attachment {instance.filename} added to mail {mail.reference_number}',
            performed_by=instance.uploaded_by,
            ip_address='system'
        )


@receiver(post_delete, sender=MailAttachment)
def mail_attachment_deleted(sender, instance, **kwargs):
    """Handle mail attachment deletion signals."""
    logger.info(f"Attachment deleted from mail: {instance.mail.reference_number}")
    
    # Update attachments count
    mail = instance.mail
    mail.attachments_count = mail.attachments.count()
    mail.save(update_fields=['attachments_count'])
    
    # Log activity
    MailRepository.log_mail_activity(
        mail=mail,
        action='attachment_removed',
        description=f'Attachment {instance.filename} removed from mail {mail.reference_number}',
        performed_by=None,  # We don't have the user who deleted it here
        ip_address='system'
    )
