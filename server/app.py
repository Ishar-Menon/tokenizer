from flask import Flask
from flask_cors import CORS
from database.db import db_init
from user import user_routes
from product import product_routes
from timeSeriesAnalysis import timeSeriesAnalysis_routes



# Config (Rember to put in a json file)
# config = {
#     "mongoURI": "mongodb://localhost:27017/",
#     "jwtSecret": "secretforjwttoken"
# }


app = Flask(__name__)
CORS(app)
app.register_blueprint(user_routes.user_bp)
app.register_blueprint(product_routes.product_bp)
app.register_blueprint(timeSeriesAnalysis_routes.timeSeries_bp)

if __name__ == '__main__':
    db_init()
    app.run(host='0.0.0.0', debug=True)
