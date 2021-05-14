from flask import *
from data.utils import *
from flask_sqlalchemy import SQLAlchemy

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:motestw64631@localhost:3306/travelweb"
app.secret_key = 'whatever'

db = SQLAlchemy(app)
from model import *

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route('/api/attraction/<a_id>')
def attractionbyid(a_id):
	try:
		connection_check()
		data = find_attraction_by_id(a_id)
		if not data:
			return jsonify({
				'error':True,
				'message':f'Cannot find the ID {a_id}'
			}),400
		return jsonify({'data':data}),200
	except Exception as e:
		print(e)
		return jsonify({
				'error':True,
				'message':f'Internal server error'
				}),500

@app.route('/api/attractions')
def find_attractions():
	try:
		connection_check()
		page = request.args.get('page')
		keyword = request.args.get('keyword')
		page = int(page)
		if not keyword:
			return jsonify(find_attraction_all(page)),200
		return jsonify(find_attraction_by_name(keyword,page)),200
	except Exception as e:
		print(e)
		return jsonify({
			'error':True,
			'message':f'Internal server error'
			}),500

@app.route('/api/user',methods=['GET'])
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

@app.route('/api/user',methods=['POST'])
def create_user():
	try:
		rq = request.get_json()
		name = rq['name']
		email = rq['email']
		if check_if_user_duplicate(email):
			print('蝦')
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


@app.route('/api/user',methods=['DELETE'])
def user_logout():
	session.pop('id',None)
	session.pop('name',None)
	session.pop('email',None)
	return jsonify({
		'ok':True
	})

@app.route('/api/user',methods=['PATCH'])
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


if __name__ == '__main__':
	app.run(host='0.0.0.0',port=3000)