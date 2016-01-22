import mongoengine.fields as f

from datetime import datetime
from utils.mongo import MongoMixin
from mongoengine import Document, EmbeddedDocument

class PersonalActivityHistory(Document, MongoMixin):
    meta = MongoMixin.NO_INHERIT()
    meta['index'] = [
        {'keys': 'uid:hashed'}
    ]
 
    meta['force_insert'] = True

    #User identifier
    uid = f.ObjectIdField(required=True, db_field='uid')

    #Start time of the activity
    start_time = f.FloatField(require=True, db_field='start_time')

    #End time of the activity
    expire_time = f.FloatField(require=True, db_field='expire_time')

    #Type of activity
    activity_type = f.StringField(require=True, db_field='type')

    @property
    def get_duration(self):
        return end_time - start_time

    @property
    def get_type(self):
        return activity_type