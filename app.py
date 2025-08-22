from flask_migrate import Migrate
from models import db  # Import the db instance from models
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# Initialize other extensions globally (but NOT db - it comes from models)
jwt = JWTManager()
migrate = Migrate()  # Initialize here without arguments

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with app
    db.init_app(app)  # Use the db instance from models.py
    migrate.init_app(app, db)  # Initialize Migrate with app and db here
    jwt.init_app(app)
    CORS(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.expenses import expenses_bp
    from routes.categories import categories_bp
    # from routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(expenses_bp, url_prefix='/api/v1/expenses')
    app.register_blueprint(categories_bp, url_prefix='/api/v1/categories')
    # app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')

    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': {
                'code': 'BAD_REQUEST',
                'message': 'Invalid request data'
            }
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': {
                'code': 'UNAUTHORIZED',
                'message': 'Authentication required'
            }
        }), 401

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Resource not found'
            }
        }), 404

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
