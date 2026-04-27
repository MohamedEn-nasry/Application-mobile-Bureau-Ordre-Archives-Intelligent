from django.apps import AppConfig


class ArchivesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.archives'
    
    def ready(self):
        """App initialization."""
        import modules.archives.signals
