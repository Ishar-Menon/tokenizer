from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_simple import (
    JWTManager, jwt_required, create_jwt, get_jwt_identity
)
from flask import request
import jwt
import pymongo
import bcrypt
from time import time
try:
    from flask import _app_ctx_stack as ctx_stack
except ImportError:
    from flask import _request_ctx_stack as ctx_stack



# Config (Rember to put in json file)
config = {
    "mongoURI": "mongodb://localhost:27017/",
    "jwtSecret": "secretforjwttoken"
}


# Mongo client
dbClient = pymongo.MongoClient(config["mongoURI"])
mongoDB = dbClient["token_sale"]
userCollection = mongoDB["User"]
productCollection = mongoDB["Product"]


app = Flask(__name__)
CORS(app)


@app.route('/api/user/login', methods=['POST', 'OPTIONS'])
def login():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    try:
        params = request.get_json()

        email = params['email']
        password = params['password']

        # Check if user exist
        user = userCollection.find_one({"email": email})
        if(user == None):
            return jsonify({'errors': {'general': 'User does not exist'}}), 400

        # verify password
        if(not bcrypt.checkpw(password.encode(), user["password"])):
            return jsonify({'errors': {'general': 'Wrong email or password'}}), 400

        # Generate token
        token = jwt.encode({'email': email, 'exp': time() + 36000},
                           config["jwtSecret"], algorithm='HS256')

        return jsonify({"token": token}), 200

    # catch JSON format and missing keys (email / password)
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Please provide both email and password'}}), 400


# -----------------------------------------------------------------------
#                       Middleware


def auth(fn):
    def wrapper(*args, **kwargs):
        try:
            token = request.headers.get('x-auth-token')
            payload = jwt.decode(
                token, config["jwtSecret"], algorithms=['HS256'])
            ctx_stack.top.jwtPayload = payload
        except Exception as e:
            print(e)
            return jsonify({'errors': {'general': 'Invalid token'}}), 400
        return fn(*args, **kwargs)
    return wrapper


# -----------------------------------------------------------------------
#                       Database setup and routes

#   User is of 2 types : 1.Buyer 2.Seller
#   Email used as unique identification for user
#   User schema : {
#               name : "Name"
#               email: "Email",
#               "password" : "messi"
#               Eth_wallet_id:"Wallet id"
#               tokens_bought: "No of tokens bought"
#               role : "Buyer/Seller"
#                  }
#  Product schema : {
#                   product_name : "name",
#                   totalTokens : "total number of tokens for this product",
#                   tokenPrice : "Price of each token"
#                   productOwner : "Seller"
#                   productImages : ["base64ImageString"]
#
#               }

def db_init():
    # Check if the required collection exist
    # if not create it

    element = userCollection.find_one()
    if(not element):
        # Add dummy user
        user = {"username": "John Doe",
                "email": "johndoe@example.com",
                "password": "messi",
                "Eth_wallet_id": "xxxxxx",
                "tokens_bought": 0,
                "role": "Buyer"}
        userCollection.insert_one(user)

    element = productCollection.find_one()
    if(not element):
        # Add dummy product
        product = {"product_name": "name",
                   "totalTokens": 0,
                   "tokenPrice": 0,
                   "productOwner": "emailOfOwner",
                   "productDescription": "dummy product",
                   "productImages": ["image 1", "Image 2"]
                   }
        productCollection.insert_one(product)

# -----------------------------------------------------------------------
#                       User routes


@app.route('/user/create', methods=['POST'])
def createUser():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    username = email = password = None

    try:
        params = request.get_json()
        username = params["username"]
        password = bcrypt.hashpw(params["password"].encode(), bcrypt.gensalt())
        email = params["email"]
        Eth_wallet_id = params["Eth_wallet_id"]
        tokens_bought = 0
        role = params["role"]

        # Check if the user exist:
        users = userCollection.find({"email": email})

        if(users.count() != 0):
            return jsonify({'errors': {'general': 'User with the same email already exist !'}}), 400

        newUser = {"username": username,
                   "password": password,
                   "email": email,
                   "Eth_wallet_id": Eth_wallet_id,
                   "tokens_bought": 0,
                   "role": role}
    except:
        return jsonify({'errors': {'general': 'Please provide all details'}}), 400

    try:
        userCollection.insert_one(newUser)
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    return jsonify({'msg': 'user successfully created'}), 201


@app.route('/user', methods=['GET'])
@auth
def getAllUsers():
    try:
        payload = ctx_stack.top.jwtPayload
        print(payload)

        return jsonify({"users": "somevalue"}), 200
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500


if __name__ == '__main__':
    db_init()
    app.run(host='0.0.0.0', debug=True)
