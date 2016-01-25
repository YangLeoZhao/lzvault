import time

from bson import ObjectId
from api.base import BaseApi
from model.Activity import Activity
from model.ActivityHistory import PersonalActivityHistory

class selectMode(BaseApi):
    def post(self):
        mode = self.get_argument('mode')

        default_user = ObjectId("5678d62244b3b38af6575e1c")
        new_activity = PersonalActivityHistory()

        activity = Activity._get_collection().find({'short_form':mode})
        if not activity.count():
            self.failure("Couldn't find this type of activity.")
        else:
            activity = activity[0]

        cur_time = int(time.time())
        duration = int(activity['duration'])
        new_activity.uid = default_user
        new_activity.start_time = cur_time
        new_activity.expire_time = cur_time + duration*60
        new_activity.activity_type = mode
        new_activity.completion = False

        new_activity.save()

        self.success(duration)

