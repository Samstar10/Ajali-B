from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from config import app, db, api
from models import User, IncidentReport, MediaAttachment

@app.route('/')
def index():
    return 'Hello, World!'

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return {'message': 'Username, email and password are required'}, 400

        try:
            user = User(username=username, email=email)
            user._password_hash = generate_password_hash(password)
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            return {'message': 'User with that email already exists'}, 400
        
        access_token = create_access_token(identity=user.id)
        return {
            'access_token': access_token,
            'id': user.id,
            'username': user.username,
            'email': user.email
        }, 201
    
    @jwt_required()
    def patch(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return {'message': 'User not found'}, 404
        
        data = request.get_json()
        password = data.get('password')
        if not password:
            return {'message': 'Password is required'}, 400

        user._password_hash = generate_password_hash(password)
        db.session.commit()
        return {
            'message': 'Password updated successfully',
            'id': user.id,
            'username': user.username,
            'email': user.email
        }, 200
        
    
class Login(Resource):
    pass


api.add_resource(Signup, '/signup')

if __name__ == '__main__':
    app.run(port=5555, debug=True)