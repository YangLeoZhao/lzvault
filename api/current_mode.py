import time

from api.base import BaseApi
from model.ActivityHistory import PersonalActivityHistory

class curMode(BaseApi):
    def get(self):
        cur_time = int(time.time())
        #Find the ongoing activity that ends the latest
        cur_activity = PersonalActivityHistory._get_collection().find({}).sort('expire_time', -1).limit(1)     
        if not cur_activity.count():
            self.success((None, 0))
        else:
            self.success((cur_activity[0]['type'], cur_activity[0]['expire_time'] - cur_time))