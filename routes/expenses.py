
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Expense, Category
from datetime import datetime, date
import json

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters for filtering
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search')
        
        # Build query
        query = Expense.query.filter_by(user_id=user_id)
        
        # Apply filters
        if start_date:
            query = query.filter(Expense.transaction_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        if end_date:
            query = query.filter(Expense.transaction_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
        if category_id:
            query = query.filter_by(category_id=category_id)
        if search:
            query = query.filter(
                db.or_(
                    Expense.description.contains(search),
                    Expense.vendor_name.contains(search)
                )
            )
        
        # Order by date (newest first)
        query = query.order_by(Expense.transaction_date.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        expenses = pagination.items
        
        # Calculate summary
        total_query = Expense.query.filter_by(user_id=user_id)
        if start_date:
            total_query = total_query.filter(Expense.transaction_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        if end_date:
            total_query = total_query.filter(Expense.transaction_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
        
        total_amount = db.session.query(db.func.sum(Expense.amount)).filter_by(user_id=user_id).scalar() or 0
        
        return jsonify({
            'expenses': [expense.to_dict() for expense in expenses],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': pagination.total,
                'pages': pagination.pages
            },
            'summary': {
                'total_amount': float(total_amount),
                'count': pagination.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'Failed to fetch expenses'
            }
        }), 500

@expenses_bp.route('', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        if not data or not data.get('amount') or not data.get('description'):
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Amount and description are required'
                }
            }), 400
        
        # Create expense
        expense = Expense(
            user_id=user_id,
            amount=data['amount'],
            description=data['description'],
            transaction_date=datetime.strptime(data.get('transaction_date', str(date.today())), '%Y-%m-%d').date(),
            payment_method=data.get('payment_method'),
            vendor_name=data.get('vendor_name'),
            location=data.get('location'),
            category_id=data.get('category_id'),
            notes=data.get('notes')
        )
        
        # Set tags if provided
        if data.get('tags'):
            expense.set_tags(data['tags'])
        
        # AI Categorization (if no category provided)
        if not data.get('category_id'):
            ai_category = suggest_category(data['description'], data.get('vendor_name'))
            if ai_category:
                expense.category_id = ai_category['category_id']
                expense.is_ai_categorized = True
                expense.confidence_score = ai_category['confidence']
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict(),
            'ai_suggestion': ai_category if 'ai_category' in locals() else None
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'Failed to create expense'
            }
        }), 500

@expenses_bp.route('/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Expense not found'
                }
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if 'amount' in data:
            expense.amount = data['amount']
        if 'description' in data:
            expense.description = data['description']
        if 'category_id' in data:
            expense.category_id = data['category_id']
            expense.is_ai_categorized = False  # User manually changed category
        if 'transaction_date' in data:
            expense.transaction_date = datetime.strptime(data['transaction_date'], '%Y-%m-%d').date()
        if 'payment_method' in data:
            expense.payment_method = data['payment_method']
        if 'vendor_name' in data:
            expense.vendor_name = data['vendor_name']
        if 'location' in data:
            expense.location = data['location']
        if 'notes' in data:
            expense.notes = data['notes']
        if 'tags' in data:
            expense.set_tags(data['tags'])
        
        expense.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'Failed to update expense'
            }
        }), 500

@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Expense not found'
                }
            }), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'Failed to delete expense'
            }
        }), 500



def suggest_category(description, vendor_name=None):
    """
    Basic AI categorization logic
    In production, you'd use a trained ML model
    """
    description_lower = description.lower()
    vendor_lower = (vendor_name or '').lower()
    
    # Simple keyword-based categorization
    food_keywords = ['restaurant', 'cafe', 'grocery', 'food', 'lunch', 'dinner', 'breakfast', 'starbucks', 'mcdonalds']
    transport_keywords = ['uber', 'taxi', 'gas', 'fuel', 'metro', 'bus', 'train']
    shopping_keywords = ['amazon', 'mall', 'store', 'shop', 'buy', 'purchase']
    
    if any(keyword in description_lower or keyword in vendor_lower for keyword in food_keywords):
        return {'category_id': 1, 'confidence': 0.85}
    elif any(keyword in description_lower or keyword in vendor_lower for keyword in transport_keywords):
        return {'category_id': 2, 'confidence': 0.80}
    elif any(keyword in description_lower or keyword in vendor_lower for keyword in shopping_keywords):
        return {'category_id': 3, 'confidence': 0.75}
    
    return {'category_id': 9, 'confidence': 0.30}  # Uncategorized