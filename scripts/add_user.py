from bson import ObjectId
from model.User import *
from core.options import define_db
from server import db_config

def main():
    define_db()
    db_config()
    n_user = User()
    n_user.gender = Gender.MALE
    n_user.email = 'leo.yang.zhao@gmail.com'
    n_user.location = 'Galaxy'
    n_user.temperature = 22
    n_user.save()

if __name__ == '__main__':
    main()