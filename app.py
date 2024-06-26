import base64
from flask import request, session, jsonify
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from cloudinary.uploader import upload
from werkzeug.datastructures import FileStorage

from config import app, db, api
from models import User, IncidentReport, MediaAttachment

parser = reqparse.RequestParser()
parser.add_argument('files', type=FileStorage, location='files', action='append')

@app.route('/')
def index():
    return 'Hello, World!'

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        role = data.get('role')
        password = data.get('password')

        if not username or not email or not password:
            return {'message': 'Username, email and password are required'}, 400

        try:
            user = User(username=username, email=email, role=role)
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
            'email': user.email,
            'role': user.role
        }, 201
    

    def patch(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        user = User.query.filter_by(email=email).first()
        
        user._password_hash = generate_password_hash(password)
        db.session.commit()

        return {
            'message': 'Password updated successfully',
            'id': user.id,
            'username': user.username,
            'email': user.email
        }, 200
        
        
    
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username and password are required'}, 400

        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user._password_hash, password):
            return {'message': 'Invalid username or password'}, 401

        metadata = {
            'username': user.username,
            'id': user.id,
            'role': user.role
        }
        access_token = create_access_token(identity=user.id, additional_claims=metadata)
        return {
            'access_token': access_token,
            'id': user.id,
            'username': user.username,
            'email': user.email
        }, 200

class IncidentReportResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        # data = request.form
        title = data.get('title')
        description = data.get('description')
        location = data.get('location')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        user_id = get_jwt_identity()

        if not title or not description or not location or not latitude or not longitude:
            return {'message': 'Title, description, location, latitude, and longitude are required'}, 400

        try:
            incident_report = IncidentReport(title=title, description=description, location=location, latitude=latitude, longitude=longitude, user_id=user_id)
            db.session.add(incident_report)
            db.session.commit()
        except IntegrityError:
            return {'message': 'Incident report already exists'}, 400

        return {
            'message': 'Incident report created successfully',
            'id': incident_report.id,
            'title': incident_report.title,
            'description': incident_report.description,
            'location': incident_report.location,
            'latitude': incident_report.latitude,
            'longitude': incident_report.longitude,
            'status': incident_report.status,
            'media_attachments': [
                {
                    'id': media_attachment.id,
                    'file_url': media_attachment.file_url
                } for media_attachment in incident_report.media_attachments
            ]
        }, 201
    
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        incident_reports = IncidentReport.query.filter_by(user_id=user_id).all()
        return {
            'incident_reports': [{
                'id': incident_report.id,
                'title': incident_report.title,
                'description': incident_report.description,
                'location': incident_report.location,
                'latitude': incident_report.latitude,
                'longitude': incident_report.longitude,
                'status': incident_report.status,
                'media_attachments': [
                    {
                        'id': media_attachment.id,
                        'file_url': media_attachment.file_url
                    } for media_attachment in incident_report.media_attachments
                ]
            } for incident_report in incident_reports]
        }, 200


class Users(Resource):
    # @jwt_required()
    def get(self):
        users = User.query.all()
        return {
            'users': [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            } for user in users]
        }, 200

class IncidentByID(Resource):
    @jwt_required()
    def get(self, id):
        user_id = get_jwt_identity()
        incident_report = IncidentReport.query.filter_by(id=id, user_id=user_id).first()
        if not incident_report:
            return {'message': 'Incident report not found'}, 404
        return {
            'id': incident_report.id,
            'title': incident_report.title,
            'description': incident_report.description,
            'location': incident_report.location,
            'latitude': incident_report.latitude,
            'longitude': incident_report.longitude,
            'status': incident_report.status,
            'media_attachments': [
                {
                    'id': media_attachment.id,
                    'file_url': media_attachment.file_url
                } for media_attachment in incident_report.media_attachments
            ]
        }, 200
    
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()

        incident_report = IncidentReport.query.filter_by(id=id, user_id=user_id).first()

        if not incident_report:
            return {'message': 'Incident report not found'}, 404        
        data = request.get_json()
        
        for key, value in data.items():
            if value is not None and value != '':
                setattr(incident_report, key, value)

        db.session.commit()
        return {
            'message': 'Incident report updated successfully',
            'id': incident_report.id,
            'title': incident_report.title,
            'description': incident_report.description,
            'location': incident_report.location,
            'latitude': incident_report.latitude,
            'longitude': incident_report.longitude,
            'status': incident_report.status,
            'media_attachments': [
                {
                    'id': media_attachment.id,
                    'file_url': media_attachment.file_url
                } for media_attachment in incident_report.media_attachments
            ]
        }, 200
    
    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()
        incident_report = IncidentReport.query.filter_by(id=id, user_id=user_id).first()
        if not incident_report:
            return {'message': 'Incident report not found'}, 404
        try:
            MediaAttachment.query.filter_by(incident_report_id=id).delete()
            db.session.delete(incident_report)
            db.session.commit()
            return {'message': 'Incident report deleted successfully'}, 200
        except IntegrityError:
            db.session.rollback()
            return {'message': 'Failed to delete incident report'}, 500
    
class AllIncidents(Resource):
    def get(self):
        incident_reports = IncidentReport.query.all()
        return {
            'incident_reports': [{
                'id': incident_report.id,
                'title': incident_report.title,
                'description': incident_report.description,
                'location': incident_report.location,
                'latitude': incident_report.latitude,
                'longitude': incident_report.longitude,
                'status': incident_report.status,
                'user_id': incident_report.user_id,
                'media_attachments': [
                    {
                        'id': media_attachment.id,
                        'file_url': media_attachment.file_url
                    } for media_attachment in incident_report.media_attachments
                ]
            } for incident_report in incident_reports]
        }, 200
        
    def patch(self):
        data = request.get_json()
        incident_report = IncidentReport.query.filter_by(id=data.get('id'), user_id=data.get('user_id')).first()

        if not incident_report:
            return {'message': 'Incident report not found'}, 404        
        
        incident_report.status = data.get('status')

        db.session.commit()
        return {
            'message': 'Incident report updated successfully',
            'id': incident_report.id,
            'title': incident_report.title,
            'description': incident_report.description,
            'location': incident_report.location,
            'latitude': incident_report.latitude,
            'longitude': incident_report.longitude,
            'status': incident_report.status,
            'media_attachments': [
                {
                    'id': media_attachment.id,
                    'file_url': media_attachment.file_url
                } for media_attachment in incident_report.media_attachments
            ]
        }, 200        
    
class MediaUpload(Resource):
    @jwt_required()
    def post(self, id):
        uploaded_files = request.files.getlist('files')

        if not uploaded_files:
            return {'message': 'No files uploaded'}, 400
        
        uploaded_urls = []

        if uploaded_files:
            for uploaded_file in uploaded_files:
                binary_image = uploaded_file.read()
                encoded_image = base64.b64encode(binary_image).decode('utf-8')
                uploaded_urls.append(encoded_image)

                new_media = MediaAttachment(file_url=encoded_image, incident_report_id=id)
                db.session.add(new_media)

                db.session.commit()

        return {
            'message': 'Files uploaded successfully',
            'uploaded_urls': uploaded_urls
        }, 201
    
    @jwt_required()
    def get(self, id):
        media_attachments = MediaAttachment.query.filter_by(incident_report_id=id).all()
        return {
            'media_attachments': [{
                'id': media_attachment.id,
                'file_url': media_attachment.file_url
            } for media_attachment in media_attachments]
        }, 200


    # def post(self, incident_id):
    #     args = parser.parse_args()
    #     uploaded_file = args['file']

    #     if uploaded_file:
    #         result = upload(uploaded_file.stream, folder=f"incident_reports/{incident_id}")
    #         file_url = result.get('secure_url')

    #         new_media = MediaAttachment(file_url=file_url, incident_report_id=incident_id)
    #         db.session.add(new_media)
    #         db.session.commit()

    #         return {
    #             'message': 'File uploaded successfully',
    #             'file_url': file_url
    #         }, 201
        
    #     return {'message': 'No file uploaded'}, 400


class Logout(Resource):
    @jwt_required()
    def delete(self):
        pass

        

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(IncidentReportResource, '/incidents')
api.add_resource(IncidentByID, '/incidents/<int:id>')
api.add_resource(AllIncidents, '/all_incidents')
api.add_resource(MediaUpload, '/incidents/media/<int:id>')
api.add_resource(Users, '/users')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
