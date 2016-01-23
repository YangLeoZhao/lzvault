import mongoengine.fields as f

from datetime import datetime
from utils.mongo import MongoMixin
from mongoengine import Document, EmbeddedDocument

class PersonalActivityHistory(Document, MongoMixin):
    meta = MongoMixin.NO_INHERIT()
    meta['index'] = [
        {'keys': 'uid:hashed'},
        {'keys': 'expire_time:1'},
        {'keys': 'activity_type:1'},
        {'keys': 'completion:1'}
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

    #The completion of the activity
    completion = f.BooleanField(require=True, db_field='completion')

    @property
    def get_duration(self):
        return end_time - start_time

    @property
    def get_type(self):
        return activity_type