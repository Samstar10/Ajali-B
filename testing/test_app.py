import flask 
import pytest

from app import app
from models import User,IncidentReport,MediaAttachment,db
from config import db    

app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'

class TestSignup:
    def test_valid_user_creation(self):
        with app.test_client() as client:
            response = client.post('/signup', json={
                'username': 'testuser',
                'email': 'testuser@example.com',
                'role': 'user',
                'password': 'password123'
            })
            data = response.get_json()
        
            assert response.status_code == 201
            assert 'access_token' in data
            assert 'id' in data
            assert 'username' in data
            assert 'email' in data
            assert 'role' in data
            
    def test_existing_email_error(self):
        with app.test_client() as client:
            response = client.post('/signup', json={
                'username': 'testuser',
                'email': 'existinguser@example.com',
                'role': 'user',
                'password': 'password123'   
            })
                
            response = client.post('/signup', json={
                'username': 'testuser2',
                'email': 'existinguser@example.com',
                'role': 'user',
                'password': 'password456'
            })
            data = response.get_json()
            
            assert response.status_code == 400
            assert 'message' in data
            
class TestLogin
    def test_valid_username_and_password(self, mocker):
        # Mock the request.get_json() method to return a dictionary with valid username and password
        mocker.patch('flask.request.get_json', return_value={'username': 'test_user', 'password': 'test_password'})

        # Mock the User.query.filter_by().first() method to return a User object with valid username and password
        mocker.patch('models.User.query.filter_by().first', return_value=User(username='test_user', _password_hash='test_password_hash'))

        # Mock the create_access_token() method to return a valid access token
        mocker.patch('flask_jwt_extended.create_access_token', return_value='test_access_token')

        # Create an instance of the Login class
        login = Login()

        # Call the post() method of the Login class
        response = login.post()

        # Assert that the response contains the expected access token and user information
        assert response == {
            'access_token': 'test_access_token',
            'id': 'test_user_id',
            'username': 'test_user',
            'email': 'test_user@example.com'
        }