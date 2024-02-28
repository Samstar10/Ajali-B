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
        
class TestIncidentReportResource:
    def test_create_incident_report_with_all_fields(self, mocker):
        # Mocking dependencies
        mocker.patch('flask.request')
        mocker.patch('flask_jwt_extended.get_jwt_identity')
        mocker.patch('app.db.session.add')
        mocker.patch('app.db.session.commit')

        # Mocking request data
        request.form = {
            'title': 'Test Title',
            'description': 'Test Description',
            'location': 'Test Location',
            'latitude': 'Test Latitude',
            'longitude': 'Test Longitude'
        }

        # Mocking get_jwt_identity
        get_jwt_identity.return_value = 1

        # Mocking IncidentReport model
        incident_report_mock = mocker.Mock()
        incident_report_mock.id = 1
        incident_report_mock.title = 'Test Title'
        incident_report_mock.description = 'Test Description'
        incident_report_mock.location = 'Test Location'
        incident_report_mock.latitude = 'Test Latitude'
        incident_report_mock.longitude = 'Test Longitude'
        incident_report_mock.status = 'pending'
        incident_report_mock.media_attachments = []

        # Mocking db.session.add
        db.session.add.return_value = None

        # Mocking db.session.commit
        db.session.commit.return_value = None

        # Mocking IncidentReport query
        IncidentReport.query.filter_by.return_value.all.return_value = []

        # Creating an instance of IncidentReportResource
        resource = IncidentReportResource()

        # Calling the post method
        response = resource.post()

        # Assertions
        assert response[0]['message'] == 'Incident report created successfully'
        assert response[0]['id'] == 1
        assert response[0]['title'] == 'Test Title'
        assert response[0]['description'] == 'Test Description'
        assert response[0]['location'] == 'Test Location'
        assert response[0]['latitude'] == 'Test Latitude'
        assert response[0]['longitude'] == 'Test Longitude'
        assert response[0]['status'] == 'pending'
        assert response[0]['media_attachments'] == []

        # Verifying mock calls
        request.form.get.assert_called_once_with('title')
        request.form.get.assert_called_once_with('description')
        request.form.get.assert_called_once_with('location')
        request.form.get.assert_called_once_with('latitude')
        request.form.get.assert_called_once_with('longitude')
        get_jwt_identity.assert_called_once()
        IncidentReport.assert_called_once_with(title='Test Title', description='Test Description', location='Test Location', latitude='Test Latitude', longitude='Test Longitude', user_id=1)
        db.session.add.assert_called_once_with(incident_report_mock)
        db.session.commit.assert_called_once()
        IncidentReport.query.filter_by.assert_called_once_with(user_id=1)
        IncidentReport.query.filter_by.return_value.all.assert_called_once()
        
class TestallIncidents:
    def test_get_all_incidents_success(self, mocker):
        # Mock the IncidentReport.query.all() method
        mocker.patch('models.IncidentReport.query.all', return_value=[IncidentReport(id=1, title='Test Incident', description='Test Description', location='Test Location', latitude=0.0, longitude=0.0, status='pending', media_attachments=[MediaAttachment(id=1, file_url='test.jpg')])])

        # Create an instance of AllIncidents
        all_incidents = AllIncidents()

        # Invoke the get() method
        response = all_incidents.get()

        # Assert the response
        assert response == {
            'incident_reports': [{
                'id': 1,
                'title': 'Test Incident',
                'description': 'Test Description',
                'location': 'Test Location',
                'latitude': 0.0,
                'longitude': 0.0,
                'status': 'pending',
                'media_attachments': [
                    {
                        'id': 1,
                        'file_url': 'test.jpg'
                    }
                ]
            }]
        }, 200
        
        

