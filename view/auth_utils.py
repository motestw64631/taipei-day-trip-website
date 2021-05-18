from flask import session,redirect,jsonify
from functools import wraps

def login_auth(func):
    @wraps(func)
    def wrap():
        if 'name' not in session:
            return jsonify({
                "error": True,
                "message": "未登入系統"
            }),403
        return func()
    return wrap
