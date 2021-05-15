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
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


from view.attraction_api import att_api
from view.user_api import user_api

app.register_blueprint(att_api)
app.register_blueprint(user_api)


if __name__ == '__main__':
	app.run(host='0.0.0.0',port=3000)
	