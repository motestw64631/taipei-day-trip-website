from flask import Blueprint,request
import json
from flask.globals import session
from flask.json import jsonify
import requests
from model import Order,db
import datetime
import os
from view.auth_utils import login_auth

order_api = Blueprint('order_api',__name__)

def clearBooking():
    session.pop('a_id',None)
    session.pop('date',None)
    session.pop('time',None)
    session.pop('price',None)


def post_to_tappay(prime,price,phone,name,email):
    header = {
        "Content-Type": "application/json",
        "x-api-key": "partner_ZZr4kSXAHWuZrcAUiQ00aDN6KCCjTgkfQiUVs1ExzNFmHmz4zcagUS5O"
    }
    body = {
        "prime": str(prime),
        "partner_key": "partner_ZZr4kSXAHWuZrcAUiQ00aDN6KCCjTgkfQiUVs1ExzNFmHmz4zcagUS5O",
        "merchant_id": "myweb_CTBC",
        "details":"TapPay Test",
        "amount": price,
        "cardholder": {
            "phone_number": "+886"+phone[1:],
            "name": name,
            "email": email,
        }
    }
    print(body)
    return requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',headers=header,data=json.dumps(body))


@order_api.route('/api/order',methods=['POST'])
@login_auth
def order():
    try:
        rq = request.get_json()
        number = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        prime = rq['prime']
        user_id = session['id']
        attraction_id = rq['order']['trip']['attraction']['id']
        price = rq['order']['price']
        state = 1 #尚未付款
        name = rq['order']['contract']['name']
        email = rq['order']['contract']['email']
        phone = rq['order']['contract']['phone']
        #
        od = Order(number,user_id,attraction_id,state,price,name,email,phone)
        db.session.add(od)
        db.session.commit()
        #
        result = post_to_tappay(prime,price,phone,name,email)
        result = result.json()
        print(result)
        if result['status']==0:
            od.state=1
            db.session.commit()
            clearBooking()
            return jsonify({
                "number":number,
                "payment":{
                    "status":0,
                    "message":"付款成功"
                }
            }),200
        return jsonify({
                    "number":number,
                    "payment":{
                        "status":1,
                        "message":"付款失敗"
                    }
                }),200
    except:
        return jsonify({
            "error":True,
            "message":"伺服器內部錯誤"
        }),500

@order_api.route('/api/order/<number>',methods=['GET'])
def getOrder(number):
    if 'name' not in session:
        return jsonify({
            "error": True,
            "message": "未登入系統"
        }),403
    order = db.session.query(Order).filter_by(number=number).first()
    return {
        "data":{
            "number":order.number,
            "price":order.price,
            "trip":{
                "attraction":{
                    "id":order.travelspot.id,
                    "name":order.travelspot.name,
                    "address":order.travelspot.address,
                    "images":order.travelspot.url[0].url
                },
                "date":order.date,
                "time":'afternoon' if (order.price==2500) else 'morning'
            },
            "contract":{
                "name":order.name,
                "email":order.email,
                "phone":order.phone
            },
            "status":order.state
        }
    }