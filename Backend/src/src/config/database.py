"""
Database configuration and utilities.
"""
import os
from django.conf import settings
from django.db import connection


class DatabaseConfig:
    """Database configuration manager."""
    
    @staticmethod
    def get_database_config():
        """Get current database configuration."""
        return settings.DATABASES['default']
    
    @staticmethod
    def is_postgresql():
        """Check if using PostgreSQL."""
        return settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql'
    
    @staticmethod
    def is_mysql():
        """Check if using MySQL."""
        return settings.DATABASES['default']['ENGINE'] == 'django.db.backends.mysql'
    
    @staticmethod
    def is_sqlite():
        """Check if using SQLite."""
        return settings.DATABASES['default']['ENGINE'] == 'django.db.backends.sqlite3'
    
    @staticmethod
    def test_connection():
        """Test database connection."""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return True
        except Exception as e:
            print(f"Database connection error: {e}")
            return False
    
    @staticmethod
    def get_database_info():
        """Get database information."""
        try:
            with connection.cursor() as cursor:
                if DatabaseConfig.is_postgresql():
                    cursor.execute("SELECT version()")
                    version = cursor.fetchone()[0]
                    return f"PostgreSQL - {version}"
                elif DatabaseConfig.is_mysql():
                    cursor.execute("SELECT VERSION()")
                    version = cursor.fetchone()[0]
                    return f"MySQL - {version}"
                elif DatabaseConfig.is_sqlite():
                    cursor.execute("SELECT sqlite_version()")
                    version = cursor.fetchone()[0]
                    return f"SQLite - {version}"
                else:
                    return "Unknown database"
        except Exception as e:
            return f"Error getting database info: {e}"


def create_database_if_not_exists():
    """Create database if it doesn't exist (for PostgreSQL/MySQL)."""
    if DatabaseConfig.is_sqlite():
        return  # SQLite creates the file automatically
    
    config = DatabaseConfig.get_database_config()
    db_name = config['NAME']
    
    try:
        with connection.cursor() as cursor:
            if DatabaseConfig.is_postgresql():
                cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
                if not cursor.fetchone():
                    cursor.execute(f'CREATE DATABASE "{db_name}"')
                    print(f"Created PostgreSQL database: {db_name}")
            elif DatabaseConfig.is_mysql():
                cursor.execute(f"SHOW DATABASES LIKE '{db_name}'")
                if not cursor.fetchone():
                    cursor.execute(f'CREATE DATABASE `{db_name}`')
                    print(f"Created MySQL database: {db_name}")
    except Exception as e:
        print(f"Error creating database: {e}")


def run_migrations_safely():
    """Run migrations with error handling."""
    try:
        from django.core.management import call_command
        call_command('migrate', verbosity=2)
        print("Migrations completed successfully")
        return True
    except Exception as e:
        print(f"Migration error: {e}")
        return False
