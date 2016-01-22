from api.base import BaseApi

class displayTemperature(BaseApi):
    def post(self):
        latitude = self.get_argument('latitude')
        longitude = self.get_argument('longitude')
        url = 'http://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid='%(latitude, longitude)
        res = self.GET(url, 'open_weather_map_api_key')
        temp = ''
        res = res.get('main')
        if res and res.has_key('temp'):
            temp = '%sC'%str(int(res.get('temp')) - 273)
        return self.success(temp)