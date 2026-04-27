# Bureau d'Ordre Archives Backend

A professional Django REST API backend for managing mail correspondence, documents, and archives with comprehensive authentication, authorization, and file management capabilities.

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user lifecycle management with profiles and permissions
- **Mail Management**: Full-featured mail/courrier system with tracking and forwarding
- **Document Management**: Secure document storage with version control and access permissions
- **Archive Management**: Comprehensive archiving system with retention policies

### Technical Features
- **Modular Architecture**: Clean, scalable structure following Django best practices
- **RESTful API**: Complete REST API with DRF and comprehensive documentation
- **File Upload/Storage**: Secure file handling with support for local and cloud storage
- **Notifications**: Email notification system with templated emails
- **Security**: Advanced security features including rate limiting and CORS
- **Logging & Monitoring**: Comprehensive logging and activity tracking
- **Database Support**: PostgreSQL, MySQL, and SQLite support

## 📁 Project Structure

```
src/
├───common              # Global core logic
│   ├───decorators      # Custom decorators (@GetUser, @Roles)
│   ├───dto             # Global Data Transfer Objects
│   ├───filters         # Exception handling
│   ├───guards          # Route protection
│   ├───interceptors    # Data transformation, Logging
│   └───middleware      # Request logging, Body parsing
│
├───config              # Configuration
│   ├───settings.py     # Django settings
│   ├───urls.py         # Main URL configuration
│   └───database.py     # Database utilities
│
├───modules             # Business logic modules
│   ├───auth            # Authentication Module
│   │   ├───controllers # API Endpoints
│   │   ├───services    # Business Logic
│   │   ├───entities    # Database Models
│   │   ├───repositories# Data Access Layer
│   │   └───dto         # Data Transfer Objects
│   │
│   ├───users           # User Management & Permissions
│   ├───mail            # Mail/Courier Management
│   ├───documents       # Document Management
│   └───archives        # Archiving Module
│
├───shared              # Shared cross-module services
│   ├───file-upload     # S3/Local storage upload service
│   └───notifications   # Email notifications service
│
├───main.py             # Application Entry Point
└───requirements.txt    # Python dependencies
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- PostgreSQL/MySQL/SQLite
- Redis (optional, for caching and Celery)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend/src
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the server**
   ```bash
   python main.py runserver
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure in `.env`:

```bash
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=bureau_ordre_archives
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Token refresh
- `GET /api/auth/profile/` - Get user profile

### User Management Endpoints
- `GET /api/users/` - List users (admin/agent only)
- `POST /api/users/create/` - Create user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (admin only)

### Mail Management Endpoints
- `GET /api/mail/` - List mails
- `POST /api/mail/create/` - Create mail
- `GET /api/mail/{id}/` - Get mail details
- `PUT /api/mail/{id}/` - Update mail
- `POST /api/mail/{id}/status/` - Update mail status
- `POST /api/mail/{id}/forward/` - Forward mail

### Document Management Endpoints
- `GET /api/documents/` - List documents
- `POST /api/documents/create/` - Upload document
- `GET /api/documents/{id}/` - Get document details
- `PUT /api/documents/{id}/` - Update document
- `GET /api/documents/{id}/download/` - Download document

### Archive Management Endpoints
- `GET /api/archives/` - List archives
- `POST /api/archives/create/` - Create archive
- `GET /api/archives/{id}/` - Get archive details
- `PUT /api/archives/{id}/` - Update archive
- `GET /api/archives/expired/` - Get expired archives

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Agent, and Lecteur roles
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Django ORM protection
- **File Upload Security**: Secure file handling with validation

## 📊 Database Schema

The application uses the following main models:

### Users
- `User` - Custom user model with roles and profiles
- `UserProfile` - Extended user information
- `UserActivity` - User activity tracking
- `UserPermission` - Custom permissions

### Mail
- `Mail` - Mail/courrier management
- `MailAttachment` - Mail attachments
- `MailComment` - Mail comments
- `MailHistory` - Mail activity history

### Documents
- `Document` - Document management
- `DocumentVersion` - Document versioning
- `DocumentComment` - Document comments
- `DocumentShare` - Document sharing

### Archives
- `Archive` - Archive management
- `ArchiveRequest` - Archive access requests
- `ArchiveActivity` - Archive activity tracking

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   export DEBUG=False
   export ALLOWED_HOSTS=your-domain.com
   export SECURE_SSL_REDIRECT=True
   ```

2. **Database Migration**
   ```bash
   python manage.py migrate --settings=config.settings
   ```

3. **Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Run with Gunicorn**
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000
   ```

### Docker Deployment

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🧪 Testing

Run tests with:
```bash
python manage.py test
```

Run with coverage:
```bash
pytest --cov=modules tests/
```

## 📝 Development

### Code Style
- Use Black for code formatting
- Use isort for import sorting
- Follow PEP 8 guidelines
- Write comprehensive tests

### Adding New Modules
1. Create module directory under `modules/`
2. Follow the established structure:
   - `controllers/` - API views
   - `services/` - Business logic
   - `entities/` - Database models
   - `repositories/` - Data access
   - `dto/` - Data transfer objects
3. Add URL configuration
4. Add to `INSTALLED_APPS` in settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added document management
- **v1.2.0** - Added archive management
- **v1.3.0** - Enhanced security and performance
