import json
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, create_engine,Integer,ForeignKey,Float
from sqlalchemy.orm import sessionmaker,relationship,backref


Base = declarative_base()

engine = create_engine('mysql+mysqlconnector://root:motestw64631@localhost:3306/travelweb', pool_pre_ping=True,pool_recycle=10)


class TravelSpot(Base):
    # 表的名字
    __tablename__ = 'travel_spot'
    # 表的結構
    id = Column(Integer, primary_key=True,autoincrement=False)
    name = Column(String(255),nullable=False)
    transport = Column(String(8000),nullable=True)
    category = Column(String(1000),nullable=False)
    longitude = Column(Float,nullable=False)
    latitude = Column(Float,nullable=False)
    address = Column(String(1000),nullable=False)
    describe = Column(String(9000),nullable=False)
    mrt = Column(String(1000),nullable=True)
    db_url = relationship('Url',backref='travelspot')
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

class Url(Base):
    __tablename__ = 'url'
    id = Column(Integer, primary_key=True,autoincrement=True)
    spot_id = Column(Integer, ForeignKey('travel_spot.id'))
    url = Column(String(8000),nullable=False)
    db_travel_spot = relationship('TravelSpot',backref='url')
    def __init__(self,spot_id,url):
        self.spot_id = spot_id
        self.url = url
    def __repr__(self):
        return f"<url {self.spot_id}>"

#Base.metadata.create_all(engine)