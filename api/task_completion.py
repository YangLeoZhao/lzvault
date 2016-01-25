import time

from bson import ObjectId
from api.base import BaseApi
from model.Activity import Activity
from model.ActivityHistory import PersonalActivityHistory

class taskCompletion(BaseApi):
    def post(self):
        short_form = self.get_argument('mode')
        PersonalActivityHistory.objects(activity_type=short_form).order_by('-expire_time').limit(1)[0].update(completion=True)

        cur_time = int(time.time())
        PersonalActivityHistory.objects(expire_time__gte=cur_time).order_by('-expire_time').update(expire_time=cur_time)
        self.success('Yey!')
