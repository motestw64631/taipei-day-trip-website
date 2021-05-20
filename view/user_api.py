from model import *
from view.user_utils import *
from flask import json, session,Blueprint,jsonify,request
from google.oauth2 import id_token
from google.auth.transport import requests

user_api = Blueprint('user_api',__name__)
google_client_id = '37565685858-clffd8eho5vui87639gjhnjmtie9eu5i.apps.googleusercontent.com'

@user_api.route('/api/user',methods=['GET'])
def get_user():
	if 'name' not in session:
		return jsonify({'data':None})
	user_id = session['id']
	name = session['name']
	email = session['email']
	return jsonify({
		'data':
		{
		"id":user_id,
		'name':name,
		'email':email}
		})

@user_api.route('/api/user',methods=['POST'])
def create_user():
	try:
		rq = request.get_json()
		name = rq['name']
		email = rq['email']
		provider = 'native'
		if check_if_user_duplicate(email,provider='native'):
			return jsonify({
			'error':True,
			'message':'電子信箱已存在',
		}),400
		password = rq['password']
		addUser(name,email,password,provider)
		return jsonify({
			'ok':True
		}),200
	except Exception as e:
		print(e)
		return jsonify({
			"error": True,
			"message":'伺服器內部錯誤'
		}),500


@user_api.route('/api/user',methods=['DELETE'])
def user_logout():
	session.clear()
	return jsonify({
		'ok':True
	})

@user_api.route('/api/user',methods=['PATCH'])
def user_login():
	try:
		rq = request.get_json()
		email = rq['email']
		password = rq['password']
		if not login_check(email,password):
			return jsonify({
			"error": True,
			"message":'帳號或密碼錯誤'
		}),400
		user_id,name,email = find_name_by_email(email,'native')
		session['id'] = user_id
		session['name'] = name
		session['email'] = email
		return jsonify({
			"ok": True
		}),200
	except Exception as e:
		print(e)
		return jsonify({
			"error": True,
			"message":'伺服器內部錯誤'
		}),500


@user_api.route('/google_login',methods=['POST'])
def google_login():
	'''
	login with google api
	'''
	token = request.json['id_token']
	try:
		id_info = id_token.verify_oauth2_token(token,requests.Request(),google_client_id)
		email = id_info['email']
		name = id_info['name']
		if not check_if_user_duplicate(email,provider='google'):
			user = User(name,email,None,'google')
			db.session.add(user)
			db.session.commit()
		user_id,name,email = find_name_by_email(email,'google')
		session['id'] = user_id
		session['name'] = name
		session['email'] = email
		if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
			raise ValueError('Wrong issuer.')
		return jsonify({
			'ok':True
		})
	except Exception as e:
		return jsonify({
			'error':True
		})

'''
    try:
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            google_client_id
        )
		print)
        print(id_info.keys())
        print(id_info['email'])
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
    except ValueError:
        # Invalid token
        raise ValueError('Invalid token')
'''