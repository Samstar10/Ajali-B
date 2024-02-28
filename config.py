from datetime import timedelta
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
<<<<<<< HEAD
import os
from flask_cors import CORS
=======
from datetime import timedelta
>>>>>>> 052992f41e25741620616e0cd5fbd8d8f61a391f

load_dotenv()


cloudinary.config(
    cloud_name = 'ddorazyav',
    api_key = '265828958461461',
    api_secret = '_74ohm_8Mv7Z2eXUPJPKhIUpjHI'
)

app = Flask(__name__)
app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://ajali_backend_user:X0BxW1hUyJH1K3zCtRm7iSy0df9GytUu@dpg-cnendtgl5elc73dc7mp0-a.oregon-postgres.render.com/ajali_backend'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
<<<<<<< HEAD

=======
>>>>>>> 052992f41e25741620616e0cd5fbd8d8f61a391f

jwt = JWTManager(app)

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)
db.init_app(app)
CORS(app)

bcrypt = Bcrypt(app)

api = Api(app)