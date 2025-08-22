import os
from datetime import timedelta

class Config:
    # Database Configuration for SQL Server
    SQLALCHEMY_DATABASE_URI = (
        "mssql+pyodbc://@supriya_janji/FineWise?"
        "driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_SECRET_KEY = 'your-secret-key-change-this-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    # App Configuration
    SECRET_KEY = 'your-app-secret-key'
    DEBUG = True
