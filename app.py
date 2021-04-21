from flask import *
from data.utils import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

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
		data = find_attraction_by_id(a_id)
		if not data:
			return jsonify({
				'error':True,
				'message':f'Cannot find the ID {a_id}'
			}),400
		return jsonify({'data':data}),200
	except:
		return jsonify({
				'error':True,
				'message':f'Internal server error'
				}),500

@app.route('/api/attractions')
def find_attractions():
	try:
		page = request.args.get('page')
		keyword = request.args.get('keyword')
		page = int(page)
		if not keyword:
			return jsonify(find_attraction_all(page)),200
		return jsonify(find_attraction_by_name(keyword,page)),200
	except:
		return jsonify({
			'error':True,
			'message':f'Internal server error'
			}),500

app.run(port=3000)