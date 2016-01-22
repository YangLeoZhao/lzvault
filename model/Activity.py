import mongoengine.fields as f

from datetime import datetime
from utils.mongo import MongoMixin
from mongoengine import Document, EmbeddedDocument

class Activity(Document, MongoMixin):
    meta = MongoMixin.YES_INHERIT()
    meta['index'] = [
        {'keys': 'name:1'}
    ]
    meta['force_insert'] = True

    #Name of the activity
    name = f.StringField(required=True, db_field='name')

    #The duration of the default duration of the activity
    #Probably should be changed to embedded document after to have
    #different duration settings and periods.
    duration = f.IntField(required=True, db_field='duration')

    #The locations to notify when the timer runs out.
    #Probably should use list of embedded documents after.
    #Each embedded document is a friend and their notification settings
    notification = f.ListField(db_field='noti')

    #The color palettes to use. Could be changed to embedded document after
    #to add more information
    color = f.StringField(required=True, db_field='color', default='#FFFFFF')

    @property
    def get_activity_letter(self):
        return self.name[0]