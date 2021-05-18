from model import *
from view.user_utils import *
from flask import session,Blueprint,jsonify,request

user_api = Blueprint('user_api',__name__)

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
		if check_if_user_duplicate(email):
			return jsonify({
			'error':True,
			'message':'電子信箱已存在',
		}),400
		password = rq['password']
		addUser(name,email,password)
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
	session.pop('id',None)
	session.pop('name',None)
	session.pop('email',None)
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
		user_id,name,email = find_name_by_email(email)
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