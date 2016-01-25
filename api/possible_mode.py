from api.base import BaseApi
from model.Activity import Activity

class possibleMode(BaseApi):
    def get(self):
        activities = Activity._get_collection().find({})
        return self.success(map(lambda a:str(a['name'][0]).upper(), activities))
