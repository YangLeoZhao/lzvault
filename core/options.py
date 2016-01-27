from tornado.options import define

def define_db():
    define('mongo_db', type=str, default='lzvault',
        help='The MongoDB to connect to.')
    define('mongo_host', type=str, default='127.0.0.1',
        help='Location of the MongoDB to connect to.')
