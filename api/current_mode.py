import time

from api.base import BaseApi
from model.ActivityHistory import PersonalActivityHistory

class curMode(BaseApi):
    def get(self):
        cur_time = int(time.time())
        cur_activity = PersonalActivityHistory._get_collection().find({'expire_time': {'$gt': cur_time}})
        if not cur_activity.count():
            self.success((None, 0))
        else:
            self.success((cur_activity[0]['type'], cur_activity[0]['expire_time'] - cur_time))