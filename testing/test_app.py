import flask 
import pytest

from app import app
from models import User,IncidentReport,MediaAttachment,db
from config import db    

app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'

class TestSignup:
               