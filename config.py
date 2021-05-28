import os

class Config():
    JSON_AS_ASCII=False
    TEMPLATES_AUTO_RELOAD=True
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:motestw64631@localhost:3306/travelweb"
    SECRET_KEY = 'asd'
    ENV = 'development'