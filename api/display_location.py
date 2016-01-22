from api.base import BaseApi

class displayPosition(BaseApi):
    def post(self):
        latitude = self.get_argument('latitude')
        longitude = self.get_argument('longitude')
        url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&key='%(latitude, longitude)
        res = self.GET(url, 'google_api_key')
        res = res.get('results')
        location = ''
        for addr_component in res:
            geo = addr_component.get('geometry')
            if geo and geo.get('location_type') == 'APPROXIMATE':
                addrs = addr_component.get('address_components')
                for addr in addrs:
                    if 'locality' in addr.get('types'):
                        location = str(addr.get('long_name'))
                        break
            else:
                continue
        return self.success(location)
        