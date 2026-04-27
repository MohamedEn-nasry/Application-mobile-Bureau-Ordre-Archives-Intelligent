from django.apps import AppConfig


class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.auth'
    
    def ready(self):
        """App initialization."""
        import modules.auth.signals
