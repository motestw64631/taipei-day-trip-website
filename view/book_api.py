from flask import Blueprint, json,session,request,jsonify
from view.auth_utils import login_auth
from view.att_utils import find_attraction_by_id

book_api = Blueprint('book_api',__name__)

@book_api.route('/api/booking',methods=['GET'])
@login_auth
def get_booking():
    if 'a_id' not in session:
        data=None
    else:
        att = find_attraction_by_id(session['a_id'])
        data={
            "attraction":{
                "id":att['id'],
                "name":att['name'],
                "address":att['address'],
                "image":att['img'][0]
            },
            "date":session['date'],
            "time":session['time'],
            "price":session['price']
        }
    return jsonify({'data':data})
    
    


@book_api.route('/api/booking',methods=['POST'])
@login_auth
def post_booking():
    try:
        req = request.get_json()
        if not(req.get('attractionId') and req.get('date') and req.get('time') and req.get('price')):
            return jsonify({
                'error':True,
                'message':'缺少keywords'
            }),400
        a_id = req['attractionId']
        date = req['date']
        time = req['time']
        price = req['price']
        session['a_id']=a_id
        session['date']=date
        session['time']=time
        session['price']=price
        return jsonify({
            'ok':True
        }),200
    except Exception as e:
        print(e)
        return jsonify({
            'error':True,
            'message':'伺服器內部錯誤'
        })

@book_api.route('/api/booking',methods=['DELETE'])
@login_auth
def deletem_booking():
    session.pop('a_id',None)
    session.pop('date',None)
    session.pop('time',None)
    session.pop('price',None)
    return jsonify({
        'ok':True
    }),200

@book_api.route('/c')
def a():
    print(session.keys())
    return 'ok'
