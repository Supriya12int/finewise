import os
from datetime import timedelta

class Config:
    # Read database URL from environment, fallback to your current local SQL Server URI
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        "mssql+pyodbc://@supriya_janji/FineWise?"
        "driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration: read secret from environment or use a default (local only)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')

    # JWT token expiration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    # Flask app secret key for sessions: environment variable or fallback for local
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-app-secret-key')

    # Debug mode: turn off in production
    DEBUG = os.environ.get('FLASK_ENV') != 'production'
