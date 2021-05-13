from app import db
import datetime


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    password = db.Column(db.String(50))
    date = db.Column(db.DateTime,default=datetime.datetime.utcnow)
    def __init__(self,name,email,password):
        self.name = name
        self.email = email
        self.password = password




def addUser(name,email,password):
    user = User(name,email,password)
    db.session.add(user)
    db.session.commit()

def check_if_user_duplicate(email):
    if  db.session.query(User).filter_by(email=email).count()==0:
        db.session.remove()
        return False
    db.session.remove()
    return True

def login_check(email,password):
    if db.session.query(User).filter_by(email=email,password=password).count()==1:
        db.session.remove()
        return True
    db.session.remove()
    return False

def find_name_by_email(email):
    user = db.session.query(User).filter_by(email=email).first()
    db.session.remove()
    return user.id,user.name,user.email




if __name__ == '__main__': 
    #db.create_all()
    print(find_name_by_email('yuyu@qq'))