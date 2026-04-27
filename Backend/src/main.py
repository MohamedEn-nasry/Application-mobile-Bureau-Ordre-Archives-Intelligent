#!/usr/bin/env python
"""
Main entry point for the Django application.
This script provides a convenient way to run the Django server
with proper environment setup and configuration.
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
django.setup()


def main():
    """Main entry point for the application."""
    try:
        # Check if we're in development or production mode
        if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
            print("🚀 Starting Bureau d'Ordre Archives Backend Server...")
            print(f"📍 Environment: {'Development' if settings.DEBUG else 'Production'}")
            print(f"🌐 Server will be available at: http://127.0.0.1:8000")
            print(f"📚 API Documentation: http://127.0.0.1:8000/api/docs/")
            print(f"🔧 Admin Panel: http://127.0.0.1:8000/admin/")
            print("-" * 50)
        
        # Execute Django management command
        execute_from_command_line(sys.argv)
        
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
