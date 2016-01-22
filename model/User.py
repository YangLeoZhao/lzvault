import mongoengine.fields as f

from enum import Enum
from datetime import datetime
from utils.mongo import MongoMixin
from mongoengine import Document, EmbeddedDocument

class Gender():
    MALE         = 1
    FEMALE       = 2
    UNDISCOLOSED = 3

class User(Document, MongoMixin):
    meta = MongoMixin.NO_INHERIT()
    meta['index'] = [
        {'keys': 'uid:hashed'}
    ]
    meta['force_insert'] = True

    #Gender of the user
    gender = f.IntField(require=True, db_field='gender')

    #Email of the user
    email = f.StringField(require=True, db_field='email')

    #Last known location
    location = f.StringField(db_field='location')

    #Last known temperature
    temperature = f.IntField(db_field='temperature')
