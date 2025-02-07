from .createDB import Base,engine,TravelSpot,Url
from sqlalchemy import or_
from sqlalchemy.orm import sessionmaker

'old_version'

Session = sessionmaker(bind=engine)
db_session=Session()


def connection_check():
    try:
        db_session.query(TravelSpot).filter_by(id=0).first()
    except:
        db_session.rollback()



def data_to_json(data):
    return {
        'id':data.id,
        'name':data.name,
        'category':data.category,
        "description": data.describe,
        "address": data.address,
        "transport": data.transport,
        "mrt": data.mrt,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "img":[i.url for i in data.url],
    }

def find_attraction_by_id(id):
    attraction = db_session.query(TravelSpot).filter_by(id=id).first()
    if not attraction:
        return None
    return data_to_json(attraction)

def find_attraction_all(page):
    data_count = db_session.query(TravelSpot).count()
    page_count = data_count//12 
    next_page = page+1 if page<page_count else None
    data = db_session.query(TravelSpot).slice(12*page,12*(page+1)).all()
    data_json = [data_to_json(i) for i in data]
    return {'nextPage':next_page,'data':data_json}


def find_attraction_by_name(name,page):
    data_count =  db_session.query(TravelSpot).filter(or_(TravelSpot.name.like(f'%{name}%'),TravelSpot.category.like(f'%{name}%'))).count()
    page_count = data_count//12
    next_page = page+1 if page<page_count else None
    data = db_session.query(TravelSpot).filter(or_(TravelSpot.name.like(f'%{name}%'),TravelSpot.category.like(f'%{name}%'))).slice(12*page,12*(page+1)).all()
    data_json = [data_to_json(i) for i in data]
    return {'nextPage':next_page,'data':data_json}

#print(find_attraction_all(0))