from model import *
from werkzeug.security import check_password_hash

def addUser(name,email,password,provider):
    user = User(name,email,password,provider)
    db.session.add(user)
    db.session.commit()

def check_if_user_duplicate(email,provider):
    if  db.session.query(User).filter_by(email=email,provider=provider).count()==0:
        db.session.remove()
        return False
    db.session.remove()
    return True

def login_check(email,password):
    user = db.session.query(User).filter_by(email=email,provider='native').first()
    db.session.remove()
    if user:
        return check_password_hash(user.password_hash,password)

def find_name_by_email(email,provider):
    user = db.session.query(User).filter_by(email=email,provider=provider).first()
    db.session.remove()
    return user.id,user.name,user.email