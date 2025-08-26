# Use official slim Python base image
FROM python:3.11-slim

# Install dependencies and Microsoft ODBC Driver 17 for SQL Server
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory to /app
WORKDIR /app

# Copy all backend code to container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 (or your app port)
EXPOSE 5000

# Start the app using gunicorn (adjust entry point as needed)
CMD ["gunicorn", "wsgi:app", "-b", "0.0.0.0:5000"]
