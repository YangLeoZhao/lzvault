from api.base import BaseApi
from model.Activity import Activity

class possibleMode(BaseApi):
    def post(self):
        remaining_time = self.get_argument('cnt_down_timer')
        cur_mode = self.get_argument('cur_mode')
        activities = Activity._get_collection().find({})
        return self.success(map(lambda a:str(a['name'][0]).upper(), activities))
