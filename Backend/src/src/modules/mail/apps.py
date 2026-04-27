from django.apps import AppConfig


class MailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.mail'
    
    def ready(self):
        """App initialization."""
        import modules.mail.signals
