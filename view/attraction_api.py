from flask import *
from view.att_utils import *

att_api = Blueprint('att_api',__name__)

@att_api.route('/api/attraction/<a_id>')
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

@att_api.route('/api/attractions')
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