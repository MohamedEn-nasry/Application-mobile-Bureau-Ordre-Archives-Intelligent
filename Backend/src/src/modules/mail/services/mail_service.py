from django.utils import timezone
from django.db.models import Q, Count
from modules.mail.dto.mail_dto import (
    MailCreateDTO, MailUpdateDTO, MailCommentDTO, MailForwardDTO
)
from modules.mail.repositories.mail_repository import MailRepository
from modules.mail.entities.mail_models import Mail
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
import logging

logger = logging.getLogger(__name__)


class MailService:
    """Service for mail management operations."""
    
    @staticmethod
    def get_mails_queryset(requesting_user):
        """Get mails queryset based on user permissions."""
        if requesting_user.is_admin:
            return MailRepository.get_all_mails()
        elif requesting_user.is_agent:
            # Agents can see all mails they created, sent, or received
            return MailRepository.get_user_accessible_mails(requesting_user)
        else:
            # Regular users can only see mails sent to them
            return MailRepository.get_user_received_mails(requesting_user)
    
    @staticmethod
    def create_mail(mail_dto: MailCreateDTO, created_by) -> dict:
        """Create a new mail."""
        try:
            # Generate reference number
            reference_number = MailRepository.generate_reference_number()
            
            # Create mail
            mail = MailRepository.create_mail(mail_dto, reference_number, created_by)
            
            # Log activity
            MailRepository.log_mail_activity(
                mail=mail,
                action='mail_created',
                description=f'Mail {reference_number} created by {created_by.email}',
                performed_by=created_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': mail.id,
                    'reference_number': mail.reference_number,
                    'subject': mail.subject,
                    'status': mail.status,
                    'priority': mail.priority,
                    'mail_type': mail.mail_type,
                    'created_at': mail.created_at
                }
            }
            
        except Exception as e:
            logger.error(f"Mail creation service error: {e}")
            return {
                'success': False,
                'error': 'Mail creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_mail_by_id(mail_id: int, requesting_user) -> dict:
        """Get mail by ID with permission check."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_access_mail(mail, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this mail'
                }
            
            return {
                'success': True,
                'data': MailRepository.serialize_mail(mail)
            }
            
        except Exception as e:
            logger.error(f"Mail retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Mail retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_mail(mail_id: int, mail_dto: MailUpdateDTO, updated_by) -> dict:
        """Update mail details."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_edit_mail(mail, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to edit this mail'
                }
            
            # Update mail
            updated_mail = MailRepository.update_mail(mail, mail_dto, updated_by)
            
            # Log activity
            MailRepository.log_mail_activity(
                mail=updated_mail,
                action='mail_updated',
                description=f'Mail {updated_mail.reference_number} updated by {updated_by.email}',
                performed_by=updated_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': MailRepository.serialize_mail(updated_mail)
            }
            
        except Exception as e:
            logger.error(f"Mail update service error: {e}")
            return {
                'success': False,
                'error': 'Mail update failed',
                'details': str(e)
            }
    
    @staticmethod
    def delete_mail(mail_id: int, deleted_by) -> dict:
        """Delete a mail."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions (only admin or creator can delete)
            if not deleted_by.is_admin and mail.created_by != deleted_by:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only admin or mail creator can delete mail'
                }
            
            # Log activity before deletion
            MailRepository.log_mail_activity(
                mail=mail,
                action='mail_deleted',
                description=f'Mail {mail.reference_number} deleted by {deleted_by.email}',
                performed_by=deleted_by,
                ip_address='system'
            )
            
            # Delete mail
            MailRepository.delete_mail(mail)
            
            return {
                'success': True,
                'data': None
            }
            
        except Exception as e:
            logger.error(f"Mail deletion service error: {e}")
            return {
                'success': False,
                'error': 'Mail deletion failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_mail_status(mail_id: int, new_status: str, updated_by) -> dict:
        """Update mail status."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_edit_mail(mail, updated_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to update this mail'
                }
            
            old_status = mail.status
            
            # Update status
            updated_mail = MailRepository.update_mail_status(mail, new_status, updated_by)
            
            # Log activity
            MailRepository.log_mail_activity(
                mail=updated_mail,
                action='status_changed',
                description=f'Mail {updated_mail.reference_number} status changed from {old_status} to {new_status} by {updated_by.email}',
                performed_by=updated_by,
                old_status=old_status,
                new_status=new_status,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': updated_mail.id,
                    'reference_number': updated_mail.reference_number,
                    'status': updated_mail.status,
                    'updated_at': updated_mail.updated_at
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
    def get_mail_comments(mail_id: int, requesting_user) -> dict:
        """Get mail comments."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_access_mail(mail, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this mail'
                }
            
            comments = MailRepository.get_mail_comments(mail_id)
            
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
    def create_mail_comment(mail_id: int, comment_dto: MailCommentDTO, author) -> dict:
        """Create mail comment."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_access_mail(mail, author):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to comment on this mail'
                }
            
            # Create comment
            comment = MailRepository.create_mail_comment(mail_id, comment_dto, author)
            
            # Log activity
            MailRepository.log_mail_activity(
                mail=mail,
                action='comment_added',
                description=f'Comment added to mail {mail.reference_number} by {author.email}',
                performed_by=author,
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
    def forward_mail(mail_id: int, forward_dto: MailForwardDTO, forwarded_by) -> dict:
        """Forward mail to another user."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_access_mail(mail, forwarded_by):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to forward this mail'
                }
            
            # Create forward record
            forward = MailRepository.forward_mail(mail_id, forward_dto, forwarded_by)
            
            # Log activity
            MailRepository.log_mail_activity(
                mail=mail,
                action='mail_forwarded',
                description=f'Mail {mail.reference_number} forwarded by {forwarded_by.email}',
                performed_by=forwarded_by,
                ip_address='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': forward.id,
                    'forwarded_to': {
                        'id': forward.forwarded_to.id,
                        'name': forward.forwarded_to.get_full_name(),
                        'email': forward.forwarded_to.email
                    } if forward.forwarded_to else None,
                    'external_recipient': forward.external_recipient,
                    'external_email': forward.external_email,
                    'forwarded_at': forward.forwarded_at
                }
            }
            
        except Exception as e:
            logger.error(f"Mail forward service error: {e}")
            return {
                'success': False,
                'error': 'Mail forward failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_mail_history(mail_id: int, requesting_user) -> dict:
        """Get mail history."""
        try:
            mail = MailRepository.get_mail_by_id(mail_id)
            if not mail:
                return {
                    'success': False,
                    'error': 'Mail not found'
                }
            
            # Check permissions
            if not MailRepository.can_user_access_mail(mail, requesting_user):
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You do not have permission to access this mail'
                }
            
            history = MailRepository.get_mail_history(mail_id)
            
            history_list = []
            for item in history:
                history_list.append({
                    'id': item.id,
                    'action': item.action,
                    'description': item.description,
                    'old_status': item.old_status,
                    'new_status': item.new_status,
                    'performed_by': {
                        'id': item.performed_by.id,
                        'name': item.performed_by.get_full_name(),
                        'email': item.performed_by.email
                    } if item.performed_by else None,
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
    def get_mail_statistics(requesting_user) -> dict:
        """Get mail statistics."""
        try:
            if not requesting_user.is_agent:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only agents can view mail statistics'
                }
            
            stats = MailRepository.get_mail_statistics(requesting_user)
            
            return {
                'success': True,
                'data': stats
            }
            
        except Exception as e:
            logger.error(f"Statistics retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get mail statistics',
                'details': str(e)
            }
    
    @staticmethod
    def search_mails(query: str, requesting_user) -> dict:
        """Search mails by query."""
        try:
            mails = MailRepository.search_mails(query, requesting_user)
            
            mail_list = []
            for mail in mails:
                mail_list.append({
                    'id': mail.id,
                    'reference_number': mail.reference_number,
                    'subject': mail.subject,
                    'status': mail.status,
                    'priority': mail.priority,
                    'mail_type': mail.mail_type,
                    'created_at': mail.created_at,
                    'sender': mail.sender.get_full_name() if mail.sender else mail.external_sender,
                    'recipient': mail.recipient.get_full_name() if mail.recipient else mail.external_recipient,
                })
            
            return {
                'success': True,
                'data': mail_list
            }
            
        except Exception as e:
            logger.error(f"Mail search service error: {e}")
            return {
                'success': False,
                'error': 'Mail search failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_overdue_mails(requesting_user) -> dict:
        """Get overdue mails."""
        try:
            mails = MailRepository.get_overdue_mails(requesting_user)
            
            mail_list = []
            for mail in mails:
                mail_list.append({
                    'id': mail.id,
                    'reference_number': mail.reference_number,
                    'subject': mail.subject,
                    'status': mail.status,
                    'priority': mail.priority,
                    'due_date': mail.due_date,
                    'days_overdue': mail.days_until_due * -1 if mail.days_until_due else 0,
                    'assigned_to': mail.recipient.get_full_name() if mail.recipient else None,
                })
            
            return {
                'success': True,
                'data': mail_list
            }
            
        except Exception as e:
            logger.error(f"Overdue mails retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get overdue mails',
                'details': str(e)
            }
