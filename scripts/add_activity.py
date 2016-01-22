from bson import ObjectId
from model.Activity import *
from core.options import define_db
from server import db_config

def main():
    define_db()
    db_config()
    activity = Activity()
    activity.name = 'break'
    activity.duration = 5
    activity.color = '#FF0000'
    activity.save()

if __name__ == '__main__':
    main()