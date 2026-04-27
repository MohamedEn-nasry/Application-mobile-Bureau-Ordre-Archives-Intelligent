from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for handling email and push notifications."""
    
    @staticmethod
    def send_email_notification(
        subject: str,
        message: str,
        recipient_list: List[str],
        html_message: Optional[str] = None,
        from_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send email notification.
        
        Args:
            subject: Email subject
            message: Email message (plain text)
            recipient_list: List of recipient email addresses
            html_message: HTML message (optional)
            from_email: Sender email (optional)
            
        Returns:
            Dictionary containing send result
        """
        try:
            # Use default from email if not provided
            if not from_email:
                from_email = settings.DEFAULT_FROM_EMAIL
            
            # Send email
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                html_message=html_message,
                fail_silently=False
            )
            
            logger.info(f"Email sent successfully to {recipient_list}")
            
            return {
                'success': True,
                'data': {
                    'subject': subject,
                    'recipients': recipient_list,
                    'sent_at': timezone.now()
                }
            }
            
        except Exception as e:
            logger.error(f"Email send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send email',
                'details': str(e),
                'code': 'email_send_error'
            }
    
    @staticmethod
    def send_template_email(
        template_name: str,
        context: Dict[str, Any],
        subject: str,
        recipient_list: List[str],
        from_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send email using Django template.
        
        Args:
            template_name: Name of the template file
            context: Context variables for the template
            subject: Email subject
            recipient_list: List of recipient email addresses
            from_email: Sender email (optional)
            
        Returns:
            Dictionary containing send result
        """
        try:
            # Render template
            html_message = render_to_string(template_name, context)
            
            # Also render plain text version (could use a separate template)
            plain_message = render_to_string(template_name.replace('.html', '.txt'), context)
            
            # Send email
            return NotificationService.send_email_notification(
                subject=subject,
                message=plain_message,
                recipient_list=recipient_list,
                html_message=html_message,
                from_email=from_email
            )
            
        except Exception as e:
            logger.error(f"Template email send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send template email',
                'details': str(e),
                'code': 'template_email_error'
            }
    
    @staticmethod
    def send_welcome_email(user_email: str, user_name: str) -> Dict[str, Any]:
        """
        Send welcome email to new user.
        
        Args:
            user_email: User's email address
            user_name: User's name
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = "Welcome to Bureau d'Ordre Archives"
            
            context = {
                'user_name': user_name,
                'user_email': user_email,
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/welcome.html',
                context=context,
                subject=subject,
                recipient_list=[user_email]
            )
            
        except Exception as e:
            logger.error(f"Welcome email send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send welcome email',
                'details': str(e),
                'code': 'welcome_email_error'
            }
    
    @staticmethod
    def send_password_reset_email(user_email: str, user_name: str, reset_token: str) -> Dict[str, Any]:
        """
        Send password reset email.
        
        Args:
            user_email: User's email address
            user_name: User's name
            reset_token: Password reset token
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = "Password Reset Request"
            
            context = {
                'user_name': user_name,
                'reset_token': reset_token,
                'reset_url': f"{settings.FRONTEND_URL}/reset-password?token={reset_token}",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/password_reset.html',
                context=context,
                subject=subject,
                recipient_list=[user_email]
            )
            
        except Exception as e:
            logger.error(f"Password reset email send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send password reset email',
                'details': str(e),
                'code': 'password_reset_email_error'
            }
    
    @staticmethod
    def send_email_verification_email(user_email: str, user_name: str, verification_token: str) -> Dict[str, Any]:
        """
        Send email verification email.
        
        Args:
            user_email: User's email address
            user_name: User's name
            verification_token: Email verification token
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = "Email Verification"
            
            context = {
                'user_name': user_name,
                'verification_token': verification_token,
                'verification_url': f"{settings.FRONTEND_URL}/verify-email?token={verification_token}",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/email_verification.html',
                context=context,
                subject=subject,
                recipient_list=[user_email]
            )
            
        except Exception as e:
            logger.error(f"Email verification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send email verification email',
                'details': str(e),
                'code': 'email_verification_error'
            }
    
    @staticmethod
    def send_mail_notification(
        recipient_email: str,
        recipient_name: str,
        mail_reference: str,
        mail_subject: str,
        action: str = 'created'
    ) -> Dict[str, Any]:
        """
        Send mail notification email.
        
        Args:
            recipient_email: Recipient's email address
            recipient_name: Recipient's name
            mail_reference: Mail reference number
            mail_subject: Mail subject
            action: Action that triggered notification
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = f"Mail {action.title()}: {mail_reference}"
            
            context = {
                'recipient_name': recipient_name,
                'mail_reference': mail_reference,
                'mail_subject': mail_subject,
                'action': action,
                'dashboard_url': f"{settings.FRONTEND_URL}/dashboard",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/mail_notification.html',
                context=context,
                subject=subject,
                recipient_list=[recipient_email]
            )
            
        except Exception as e:
            logger.error(f"Mail notification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send mail notification email',
                'details': str(e),
                'code': 'mail_notification_error'
            }
    
    @staticmethod
    def send_document_notification(
        recipient_email: str,
        recipient_name: str,
        document_title: str,
        action: str = 'uploaded'
    ) -> Dict[str, Any]:
        """
        Send document notification email.
        
        Args:
            recipient_email: Recipient's email address
            recipient_name: Recipient's name
            document_title: Document title
            action: Action that triggered notification
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = f"Document {action.title()}: {document_title}"
            
            context = {
                'recipient_name': recipient_name,
                'document_title': document_title,
                'action': action,
                'documents_url': f"{settings.FRONTEND_URL}/documents",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/document_notification.html',
                context=context,
                subject=subject,
                recipient_list=[recipient_email]
            )
            
        except Exception as e:
            logger.error(f"Document notification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send document notification email',
                'details': str(e),
                'code': 'document_notification_error'
            }
    
    @staticmethod
    def send_archive_notification(
        recipient_email: str,
        recipient_name: str,
        archive_reference: str,
        archive_title: str,
        action: str = 'created'
    ) -> Dict[str, Any]:
        """
        Send archive notification email.
        
        Args:
            recipient_email: Recipient's email address
            recipient_name: Recipient's name
            archive_reference: Archive reference number
            archive_title: Archive title
            action: Action that triggered notification
            
        Returns:
            Dictionary containing send result
        """
        try:
            subject = f"Archive {action.title()}: {archive_reference}"
            
            context = {
                'recipient_name': recipient_name,
                'archive_reference': archive_reference,
                'archive_title': archive_title,
                'action': action,
                'archives_url': f"{settings.FRONTEND_URL}/archives",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/archive_notification.html',
                context=context,
                subject=subject,
                recipient_list=[recipient_email]
            )
            
        except Exception as e:
            logger.error(f"Archive notification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send archive notification email',
                'details': str(e),
                'code': 'archive_notification_error'
            }
    
    @staticmethod
    def send_system_notification(
        recipient_emails: List[str],
        subject: str,
        message: str,
        notification_type: str = 'system'
    ) -> Dict[str, Any]:
        """
        Send system notification to multiple recipients.
        
        Args:
            recipient_emails: List of recipient email addresses
            subject: Notification subject
            message: Notification message
            notification_type: Type of notification
            
        Returns:
            Dictionary containing send result
        """
        try:
            context = {
                'message': message,
                'notification_type': notification_type,
                'dashboard_url': f"{settings.FRONTEND_URL}/dashboard",
                'current_year': timezone.now().year
            }
            
            return NotificationService.send_template_email(
                template_name='emails/system_notification.html',
                context=context,
                subject=subject,
                recipient_list=recipient_emails
            )
            
        except Exception as e:
            logger.error(f"System notification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send system notification email',
                'details': str(e),
                'code': 'system_notification_error'
            }
    
    @staticmethod
    def send_bulk_notification(
        recipient_emails: List[str],
        subject: str,
        message: str,
        html_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send bulk notification to multiple recipients.
        
        Args:
            recipient_emails: List of recipient email addresses
            subject: Notification subject
            message: Notification message
            html_message: HTML message (optional)
            
        Returns:
            Dictionary containing send result
        """
        try:
            # Split recipients into batches to avoid email limits
            batch_size = 50
            total_sent = 0
            failed_batches = []
            
            for i in range(0, len(recipient_emails), batch_size):
                batch = recipient_emails[i:i + batch_size]
                
                result = NotificationService.send_email_notification(
                    subject=subject,
                    message=message,
                    recipient_list=batch,
                    html_message=html_message
                )
                
                if result['success']:
                    total_sent += len(batch)
                else:
                    failed_batches.append({
                        'batch_index': i // batch_size,
                        'error': result['error'],
                        'recipients': batch
                    })
            
            return {
                'success': len(failed_batches) == 0,
                'data': {
                    'total_recipients': len(recipient_emails),
                    'total_sent': total_sent,
                    'failed_batches': failed_batches,
                    'sent_at': timezone.now()
                }
            }
            
        except Exception as e:
            logger.error(f"Bulk notification send error: {e}")
            return {
                'success': False,
                'error': 'Failed to send bulk notification',
                'details': str(e),
                'code': 'bulk_notification_error'
            }
    
    @staticmethod
    def validate_email_settings() -> Dict[str, Any]:
        """
        Validate email settings.
        
        Returns:
            Dictionary containing validation result
        """
        try:
            required_settings = [
                'EMAIL_HOST',
                'EMAIL_PORT',
                'EMAIL_HOST_USER',
                'DEFAULT_FROM_EMAIL'
            ]
            
            missing_settings = []
            for setting in required_settings:
                if not hasattr(settings, setting) or not getattr(settings, setting):
                    missing_settings.append(setting)
            
            if missing_settings:
                return {
                    'success': False,
                    'error': 'Missing email settings',
                    'details': f'Missing settings: {", ".join(missing_settings)}',
                    'code': 'missing_email_settings'
                }
            
            return {
                'success': True,
                'data': {
                    'email_host': settings.EMAIL_HOST,
                    'email_port': settings.EMAIL_PORT,
                    'email_use_tls': getattr(settings, 'EMAIL_USE_TLS', False),
                    'default_from_email': settings.DEFAULT_FROM_EMAIL
                }
            }
            
        except Exception as e:
            logger.error(f"Email settings validation error: {e}")
            return {
                'success': False,
                'error': 'Failed to validate email settings',
                'details': str(e),
                'code': 'email_settings_validation_error'
            }
