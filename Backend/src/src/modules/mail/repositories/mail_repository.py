from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
import uuid
from modules.mail.dto.mail_dto import (
    MailCreateDTO, MailUpdateDTO, MailCommentDTO, MailForwardDTO
)
from modules.mail.entities.mail_models import (
    Mail, MailAttachment, MailComment, MailHistory,
    MailCategory, MailCategoryAssignment, MailForward
)
from modules.users.entities import User
import logging

logger = logging.getLogger(__name__)


class MailRepository:
    """Repository for mail data operations."""
    
    @staticmethod
    def get_mail_by_id(mail_id: int) -> Mail:
        """Get mail by ID."""
        try:
            return Mail.objects.select_related(
                'sender', 'recipient', 'created_by', 'last_modified_by'
            ).prefetch_related(
                'attachments', 'comments', 'history', 'forwards'
            ).get(id=mail_id)
        except Mail.DoesNotExist:
            return None
    
    @staticmethod
    def get_all_mails():
        """Get all mails."""
        return Mail.objects.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def get_user_accessible_mails(user: User):
        """Get mails accessible to a user."""
        return Mail.objects.filter(
            Q(sender=user) | Q(recipient=user) | Q(created_by=user)
        ).select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def get_user_received_mails(user: User):
        """Get mails received by a user."""
        return Mail.objects.filter(
            recipient=user
        ).select_related(
            'sender', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def get_user_sent_mails(user: User):
        """Get mails sent by a user."""
        return Mail.objects.filter(
            sender=user
        ).select_related(
            'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def generate_reference_number() -> str:
        """Generate unique reference number."""
        year = timezone.now().year
        month = timezone.now().month
        
        # Get count for this month
        count = Mail.objects.filter(
            created_at__year=year,
            created_at__month=month
        ).count()
        
        # Generate reference: REF-YYYYMM-NNNN
        return f"REF-{year}{month:02d}-{count+1:04d}"
    
    @staticmethod
    def create_mail(mail_dto: MailCreateDTO, reference_number: str, created_by: User) -> Mail:
        """Create new mail."""
        mail = Mail.objects.create(
            reference_number=reference_number,
            subject=mail_dto.subject,
            content=mail_dto.content,
            mail_type=mail_dto.mail_type,
            priority=mail_dto.priority,
            status=mail_dto.status or 'draft',
            sender=mail_dto.sender,
            recipient=mail_dto.recipient,
            external_sender=mail_dto.external_sender,
            external_recipient=mail_dto.external_recipient,
            external_email=mail_dto.external_email,
            sent_date=mail_dto.sent_date,
            received_date=mail_dto.received_date,
            due_date=mail_dto.due_date,
            notes=mail_dto.notes,
            tags=mail_dto.tags or [],
            created_by=created_by,
            last_modified_by=created_by
        )
        
        return mail
    
    @staticmethod
    def update_mail(mail: Mail, mail_dto: MailUpdateDTO, updated_by: User) -> Mail:
        """Update mail details."""
        # Update fields if provided
        if mail_dto.subject is not None:
            mail.subject = mail_dto.subject
        if mail_dto.content is not None:
            mail.content = mail_dto.content
        if mail_dto.priority is not None:
            mail.priority = mail_dto.priority
        if mail_dto.status is not None:
            mail.status = mail_dto.status
        if mail_dto.sender is not None:
            mail.sender = mail_dto.sender
        if mail_dto.recipient is not None:
            mail.recipient = mail_dto.recipient
        if mail_dto.external_sender is not None:
            mail.external_sender = mail_dto.external_sender
        if mail_dto.external_recipient is not None:
            mail.external_recipient = mail_dto.external_recipient
        if mail_dto.external_email is not None:
            mail.external_email = mail_dto.external_email
        if mail_dto.sent_date is not None:
            mail.sent_date = mail_dto.sent_date
        if mail_dto.received_date is not None:
            mail.received_date = mail_dto.received_date
        if mail_dto.due_date is not None:
            mail.due_date = mail_dto.due_date
        if mail_dto.notes is not None:
            mail.notes = mail_dto.notes
        if mail_dto.tags is not None:
            mail.tags = mail_dto.tags
        
        mail.last_modified_by = updated_by
        mail.save()
        
        return mail
    
    @staticmethod
    def delete_mail(mail: Mail):
        """Delete mail."""
        mail.delete()
    
    @staticmethod
    def update_mail_status(mail: Mail, new_status: str, updated_by: User) -> Mail:
        """Update mail status."""
        old_status = mail.status
        mail.status = new_status
        mail.last_modified_by = updated_by
        
        # Set completed date if status is completed
        if new_status == 'completed' and old_status != 'completed':
            mail.completed_date = timezone.now()
        
        mail.save()
        return mail
    
    @staticmethod
    def get_mail_comments(mail_id: int):
        """Get mail comments."""
        return MailComment.objects.filter(
            mail_id=mail_id
        ).select_related('author').order_by('created_at')
    
    @staticmethod
    def create_mail_comment(mail_id: int, comment_dto: MailCommentDTO, author: User) -> MailComment:
        """Create mail comment."""
        return MailComment.objects.create(
            mail_id=mail_id,
            author=author,
            content=comment_dto.content,
            is_internal=comment_dto.is_internal
        )
    
    @staticmethod
    def forward_mail(mail_id: int, forward_dto: MailForwardDTO, forwarded_by: User) -> MailForward:
        """Create mail forward record."""
        return MailForward.objects.create(
            mail_id=mail_id,
            forwarded_by=forwarded_by,
            forwarded_to=forward_dto.forwarded_to,
            external_recipient=forward_dto.external_recipient,
            external_email=forward_dto.external_email,
            forward_notes=forward_dto.forward_notes
        )
    
    @staticmethod
    def get_mail_history(mail_id: int):
        """Get mail history."""
        return MailHistory.objects.filter(
            mail_id=mail_id
        ).select_related('performed_by').order_by('-timestamp')
    
    @staticmethod
    def log_mail_activity(mail: Mail, action: str, description: str, performed_by: User, 
                        old_status: str = None, new_status: str = None, ip_address: str = None):
        """Log mail activity."""
        MailHistory.objects.create(
            mail=mail,
            action=action,
            description=description,
            performed_by=performed_by,
            old_status=old_status,
            new_status=new_status,
            ip_address=ip_address
        )
    
    @staticmethod
    def can_user_access_mail(mail: Mail, user: User) -> bool:
        """Check if user can access mail."""
        if user.is_admin:
            return True
        
        # User can access if they are sender, recipient, creator, or involved in forwards
        return (
            mail.sender == user or
            mail.recipient == user or
            mail.created_by == user or
            mail.last_modified_by == user or
            mail.forwards.filter(
                Q(forwarded_by=user) | Q(forwarded_to=user)
            ).exists()
        )
    
    @staticmethod
    def can_user_edit_mail(mail: Mail, user: User) -> bool:
        """Check if user can edit mail."""
        if user.is_admin:
            return True
        
        # User can edit if they created the mail or are the sender (for outgoing mails)
        return (
            mail.created_by == user or
            (mail.sender == user and mail.mail_type in ['outgoing', 'internal'])
        )
    
    @staticmethod
    def search_mails(query: str, requesting_user: User):
        """Search mails by query."""
        queryset = Mail.objects.filter(
            Q(reference_number__icontains=query) |
            Q(subject__icontains=query) |
            Q(content__icontains=query) |
            Q(external_sender__icontains=query) |
            Q(external_recipient__icontains=query) |
            Q(notes__icontains=query)
        )
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        return queryset.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')[:50]  # Limit results
    
    @staticmethod
    def get_overdue_mails(requesting_user: User):
        """Get overdue mails."""
        now = timezone.now()
        queryset = Mail.objects.filter(
            due_date__lt=now,
            status__in=['sent', 'received', 'in_progress']
        )
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        return queryset.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('due_date')
    
    @staticmethod
    def get_mail_statistics(requesting_user: User) -> dict:
        """Get mail statistics."""
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        queryset = Mail.objects.all()
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        stats = {
            'total_mails': queryset.count(),
            'mails_by_status': list(
                queryset.values('status')
                .annotate(count=Count('id'))
                .order_by('status')
            ),
            'mails_by_priority': list(
                queryset.values('priority')
                .annotate(count=Count('id'))
                .order_by('-priority')
            ),
            'mails_by_type': list(
                queryset.values('mail_type')
                .annotate(count=Count('id'))
                .order_by('mail_type')
            ),
            'mails_last_30_days': queryset.filter(created_at__gte=thirty_days_ago).count(),
            'overdue_mails': queryset.filter(
                due_date__lt=now,
                status__in=['sent', 'received', 'in_progress']
            ).count(),
            'completed_mails': queryset.filter(status='completed').count(),
        }
        
        return stats
    
    @staticmethod
    def serialize_mail(mail: Mail) -> dict:
        """Serialize mail object to dictionary."""
        return {
            'id': mail.id,
            'reference_number': mail.reference_number,
            'subject': mail.subject,
            'content': mail.content,
            'mail_type': mail.mail_type,
            'priority': mail.priority,
            'status': mail.status,
            'sender': {
                'id': mail.sender.id,
                'name': mail.sender.get_full_name(),
                'email': mail.sender.email
            } if mail.sender else None,
            'recipient': {
                'id': mail.recipient.id,
                'name': mail.recipient.get_full_name(),
                'email': mail.recipient.email
            } if mail.recipient else None,
            'external_sender': mail.external_sender,
            'external_recipient': mail.external_recipient,
            'external_email': mail.external_email,
            'sent_date': mail.sent_date,
            'received_date': mail.received_date,
            'due_date': mail.due_date,
            'completed_date': mail.completed_date,
            'notes': mail.notes,
            'tags': mail.tags,
            'attachments_count': mail.attachments_count,
            'created_by': {
                'id': mail.created_by.id,
                'name': mail.created_by.get_full_name(),
                'email': mail.created_by.email
            } if mail.created_by else None,
            'created_at': mail.created_at,
            'updated_at': mail.updated_at,
            'last_modified_by': {
                'id': mail.last_modified_by.id,
                'name': mail.last_modified_by.get_full_name(),
                'email': mail.last_modified_by.email
            } if mail.last_modified_by else None,
            'is_overdue': mail.is_overdue,
            'days_until_due': mail.days_until_due,
        }
    
    @staticmethod
    def get_mails_by_status(status: str, requesting_user: User):
        """Get mails by status."""
        queryset = Mail.objects.filter(status=status)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        return queryset.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def get_mails_by_priority(priority: str, requesting_user: User):
        """Get mails by priority."""
        queryset = Mail.objects.filter(priority=priority)
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        return queryset.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def get_mails_by_date_range(start_date, end_date, requesting_user: User):
        """Get mails within date range."""
        queryset = Mail.objects.filter(
            created_at__gte=start_date,
            created_at__lte=end_date
        )
        
        # Apply user permissions
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.filter(
                    Q(sender=requesting_user) |
                    Q(recipient=requesting_user) |
                    Q(created_by=requesting_user)
                )
            else:
                queryset = queryset.filter(recipient=requesting_user)
        
        return queryset.select_related(
            'sender', 'recipient', 'created_by'
        ).order_by('-created_at')
    
    @staticmethod
    def cleanup_old_mail_history(days: int = 365):
        """Clean up old mail history."""
        cutoff = timezone.now() - timedelta(days=days)
        count = MailHistory.objects.filter(timestamp__lt=cutoff).delete()[0]
        logger.info(f"Cleaned up {count} old mail history records")
        return count
