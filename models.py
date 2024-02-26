from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.schema import CheckConstraint

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default='user')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    incident_reports = db.relationship('IncidentReport', backref='user', lazy=True)

    __tableargs__ = (
        CheckConstraint(role.in_(('admin', 'user')), name='valid_role'),
    )

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<User {self.username}>'
    
class IncidentReport(db.Model, SerializerMixin):
    __tablename__ = 'incident_reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    media_attachments = db.relationship('MediaAttachment', backref='incident_report', lazy=True)

    def __repr__(self):
        return f'<IncidentReport {self.title}>'
    
class MediaAttachment(db.Model, SerializerMixin):
    __tablename__ = 'media_attachments'

    id = db.Column(db.Integer, primary_key=True)
    file_url = db.Column(db.String, nullable=False)
    incident_report_id = db.Column(db.Integer, db.ForeignKey('incident_reports.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<MediaAttachment {self.url}>'