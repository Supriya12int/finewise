from app import create_app
from models import db, User

app = create_app()
with app.app_context():
    try:
        # Test basic query
        user_count = User.query.count()
        print(f"Current user count: {user_count}")
        print("Database connection works!")
    except Exception as e:
        print(f"Database error: {e}")
