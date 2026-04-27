from django.apps import AppConfig


class DocumentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.documents'
    
    def ready(self):
        """App initialization."""
        import modules.documents.signals
