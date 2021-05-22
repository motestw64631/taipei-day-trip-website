from flask_sqlalchemy import SQLAlchemy
import datetime
from werkzeug.security import generate_password_hash,check_password_hash

db = SQLAlchemy()

class TravelSpot(db.Model):
    # 表的名字
    __tablename__ = 'travel_spot'
    __table_args__ = {'extend_existing': True}
    # 表的結構
    id = db.Column(db.Integer, primary_key=True,autoincrement=False)
    name = db.Column(db.String(255),nullable=False)
    transport = db.Column(db.Text(8000),nullable=True)
    category = db.Column(db.Text(1000),nullable=False)
    longitude = db.Column(db.Float,nullable=False)
    latitude = db.Column(db.Float,nullable=False)
    address = db.Column(db.Text(1000),nullable=False)
    describe = db.Column(db.Text(9000),nullable=False)
    mrt = db.Column(db.Text(1000),nullable=True)
    db_url = db.relationship('Url',backref='travelspot')
    def __init__(self,id,name,transport,category,longitude,latitude,address,describe,mrt):
        self.id = id
        self.name = name
        self.transport = transport
        self.category = category
        self.longitude = longitude
        self.latitude = latitude
        self.address = address
        self.describe = describe
        self.mrt = mrt
    def __repr__(self):
        return "<Spot('%s')>" % (self.name)

class Url(db.Model):
    __tablename__ = 'url'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    spot_id = db.Column(db.Integer, db.ForeignKey('travel_spot.id'))
    url = db.Column(db.Text(8000),nullable=False)
    db_travel_spot = db.relationship('TravelSpot',backref='url')
    def __init__(self,spot_id,url):
        self.spot_id = spot_id
        self.url = url
    def __repr__(self):
        return f"<url {self.spot_id}>"


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password_hash = db.Column(db.String(500))
    provider = db.Column(db.String(100))
    date = db.Column(db.DateTime,default=datetime.datetime.utcnow)
    def __init__(self,name,email,password,provider):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password) if password is not None else None
        self.provider = provider

    def __repr__(self):
        return f'<user {self.name}>'







if __name__ == '__main__': 
    db.create_all()
    #print(find_name_by_email('yuyu@qq'))