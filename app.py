from flask import *
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from model import *
from config import Config

app=Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app,db,compare_type=True)

# Pages
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@app.route("/booking")
def booking():
	if 'name' not in session:
		return redirect('/')
	return render_template("booking.html")

@app.route("/thankyou")
def thankyou():
	number = request.args.get('number')
	return render_template("thankyou.html")

from view.book_api import book_api
from view.attraction_api import att_api
from view.user_api import user_api
from view.order import order_api

app.register_blueprint(att_api)
app.register_blueprint(user_api)
app.register_blueprint(book_api)
app.register_blueprint(order_api)


if __name__ == '__main__':
	app.run(host='0.0.0.0',port=3000)
	