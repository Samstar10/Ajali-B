from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

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
            user._password_hash = password
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

api.add_resource(Signup, '/signup')

if __name__ == '__main__':
    app.run(port=5555, debug=True)