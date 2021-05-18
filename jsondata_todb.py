import json
import sqlalchemy
from model import *
from sqlalchemy.orm import sessionmaker
from model import TravelSpot,Url

def image_site_split(s):
    a = s.split('http')
    a = ['http'+i for i in a]
    s = [i for i in a if i.upper().endswith('JPG') or i.upper().endswith('PNG')]
    return s  


with open('./data/taipei-attractions.json') as f:
    data = json.load(f)



def create():
    for i in data['result']['results']:
        id = i['_id']
        name = i['stitle']
        transport = i['info']
        category = i['CAT2']
        longitude = i['longitude']
        address = i['address']
        latitude = i['latitude']
        describe = i['xbody']
        mrt = i['MRT']
        images = image_site_split(i['file'])
        spt = TravelSpot(id,name,transport,category,longitude,latitude,address,describe,mrt)
        db.session.add(spt)
        for image in images:
            url = Url(id,image)
            db.session.add(url)
        db.session.commit()
    

#TravelSpot(name,transport,category,longitude,latitude,address,describe,mrt)
#Url()