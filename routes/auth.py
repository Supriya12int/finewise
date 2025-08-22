from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
import logging

auth_bp = Blueprint('auth', __name__)

# Logger setup (optional)
logger = logging.getLogger(__name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Required fields validation
        if not data:
            return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Missing JSON body'}}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        phone = data.get('phone', '').strip() if data.get('phone') else None

        if not email or not password:
            return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email and password are required'}}), 400

        if len(password) < 6:
            return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Password must be at least 6 characters'}}), 400

        # Optional: validate phone format if needed

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': {'code': 'USER_EXISTS', 'message': 'Email already registered'}}), 400

        # Create new User object and set password hash
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        user.set_password(password)  # Should hash password internally

        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'token': access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {e}", exc_info=True)
        return jsonify({'error': {'code': 'SERVER_ERROR', 'message': 'Registration failed'}}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Missing JSON body'}}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'error': {'code': 'VALIDATION_ERROR', 'message': 'Email and password are required'}}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Invalid email or password'}}), 401

        if not user.is_active:
            return jsonify({'error': {'code': 'ACCOUNT_DISABLED', 'message': 'Account is disabled'}}), 401

        access_token = create_access_token(identity=user.id)

        return jsonify({'message': 'Login successful', 'user': user.to_dict(), 'token': access_token}), 200

    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return jsonify({'error': {'code': 'SERVER_ERROR', 'message': 'Login failed'}}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': {'code': 'USER_NOT_FOUND', 'message': 'User not found'}}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        logger.error(f"Profile fetch error: {e}", exc_info=True)
        return jsonify({'error': {'code': 'SERVER_ERROR', 'message': 'Failed to fetch profile'}}), 500
