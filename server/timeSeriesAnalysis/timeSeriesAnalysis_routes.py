from flask import Blueprint
from flask import current_app as app
from middleware.middleware import auth

timeSeries_bp = Blueprint('timeSeries_bp', __name__)

# List products with their information
# (Inforamtion passed from client - items to skip)
@timeSeries_bp.route('/api/predict', methods=['GET'])
@auth
def predict():
    pass
