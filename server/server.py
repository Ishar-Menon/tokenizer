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


# Config (Rember to put in a json file)
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
    wrapper.__name__ = fn.__name__
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
#               tokens_owned: [{productname,no of tokens}]
#               role : "Buyer/Seller"
#                  }
#  Product schema : {
#                   product_name : "name",
#                   totalTokens : "total number of tokens for this product",
#                   tokenPrice : "Price of each token"
#                   productOwner : "Seller"
#                   productImages : ["base64ImageString"]
#                   productDescription : "dummy product"
#                   shortDecription : ""
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
                "tokens_owned": [],
                "role": "Buyer"}
        userCollection.insert_one(user)

    element = productCollection.find_one()
    if(not element):
        # Add dummy product
        product = {"product_name": "name",
                   "totalTokens": 0,
                   "tokenPrice": 0,
                   "productOwner": "emailOfOwner",
                   "shortDecription": "",
                   "productDescription": "dummy product",
                   "productImages": ["image 1", "Image 2"]
                   }
        productCollection.insert_one(product)

# -----------------------------------------------------------------------
#                       User routes

# Create a new user
@app.route('/api/user/create', methods=['POST'])
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
        role = params["role"]

        # Check if the user exist:
        users = userCollection.find({"email": email})

        if(users.count() != 0):
            return jsonify({'errors': {'general': 'User with the same email already exist !'}}), 400

        newUser = {"username": username,
                   "password": password,
                   "email": email,
                   "Eth_wallet_id": Eth_wallet_id,
                   "tokens_owned": [],
                   "role": role}
    except:
        return jsonify({'errors': {'general': 'Please provide all details'}}), 400

    try:
        userCollection.insert_one(newUser)
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    return jsonify({'msg': 'user successfully created'}), 201


# Get information of the authorized user
@app.route('/api/user/info', methods=['GET'])
@auth
def getUserInfo():
    try:
        payload = ctx_stack.top.jwtPayload
        user = userCollection.find_one({"email": payload["email"]})
        user.pop('_id')
        user.pop('password')
        return jsonify(user), 200

    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Server error'}}), 500

# Get information of the authorizeuserd user
# tokensBought = { product_name: "",noTokensBought:0}
@app.route('/api/user/buyTokens', methods=['POST'])
@auth
def buyTokens():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    payload = ctx_stack.top.jwtPayload
    user = userCollection.find_one({"email": payload["email"]})

    try:
        params = request.get_json()
        tokensBought = params["tokensBought"]

        productPresent = False

        # User already has some tokens for the product add more
        for product in user["tokens_owned"]:
            if(product["product_name"] == tokensBought["product_name"]):
                product["noTokensBought"] += tokensBought["noTokensBought"]
                productPresent = True

        # If not bought append to list of products
        if(not productPresent):
            user["tokens_owned"].append(tokensBought)

        newvalues = {"$set": {"tokens_owned": user["tokens_owned"]}}
        userCollection.update_one({"email": payload["email"]}, newvalues)

        return jsonify({"msg": "successful update"}), 200
    except:
        return jsonify({'errors': {'general': 'Please provide all details'}}), 400


# Testing route 1
@app.route('/user', methods=['GET'])
def getAllUsers():
    try:
        users = userCollection.find()
        userInfo = {"users": []}
        for user in users:
            user.pop("_id")
            userInfo["users"].append(user)

        return jsonify(userInfo), 200
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Server error'}}), 500


# -----------------------------------------------------------------------
#                       Product routes

# Create a new product(done by authorized user)
@app.route('/api/product/create', methods=['POST'])
@auth
def createProduct():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    payload = ctx_stack.top.jwtPayload
    productOwner = payload["email"]

    try:
        params = request.get_json()
        product_name = params["product_name"]
        totalTokens = params["totalTokens"]
        tokenPrice = params["tokenPrice"]
        shortDecription = params["shortDecription"]
        productDescription = params["productDescription"]
        productImages = params["productImages"]

        # Check if the product with same name exist
        # (Can be changed to check using a product id later):
        users = userCollection.find({"product_name": product_name})

        if(users.count() != 0):
            return jsonify({'errors': {'general': 'Product with same name exist already exist !'}}), 400

        newProduct = {"product_name": product_name,
                      "totalTokens": totalTokens,
                      "tokenPrice": tokenPrice,
                      "productOwner": productOwner,
                      "shortDecription": shortDecription,
                      "productDescription": productDescription,
                      "productImages": productImages
                      }
    except:
        return jsonify({'errors': {'general': 'Please provide all details'}}), 400

    try:
        productCollection.insert_one(newProduct)
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    return jsonify({'msg': 'product successfully created'}), 201

# List products with their information
# (Inforamtion passed from client - items to skip)
@app.route('/api/product/list', methods=['GET'])
def listProduct():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    try:
        params = request.get_json()
        skipAmount = params["skipAmount"]

    except:
        return jsonify({'errors': {'general': 'Please provide skip amount'}}), 400

    try:
        products = productCollection.find().skip(skipAmount).limit(10)
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    productInfo = {"products": []}

    for product in products:
        product.pop("_id")
        print(product)
        productInfo["products"].append(product)

    return jsonify(productInfo), 200


# List products with their information
# (Inforamtion passed from client - items to skip)
@app.route('/api/product/listUser', methods=['GET'])
@auth
def listUsersProduct():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    payload = ctx_stack.top.jwtPayload
    productOwner = payload["email"]

    try:
        params = request.get_json()
        skipAmount = params["skipAmount"]

    except:
        return jsonify({'errors': {'general': 'Please provide skip amount'}}), 400

    try:
        products = productCollection.find(
            {"productOwner": productOwner}
        ).skip(skipAmount).limit(10)
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    productInfo = {"products": []}

    for product in products:
        product.pop("_id")
        productInfo["products"].append(product)

    return jsonify(productInfo), 200

# Testing route 2
@app.route('/product', methods=['GET'])
def getAllProducts():
    try:
        products = productCollection.find()
        productInfo = {"products": []}
        for product in products:
            product.pop("_id")
            productInfo["products"].append(product)
        return jsonify(productInfo), 200
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Server error'}}), 500
# -----------------------------------------------------------------------
#                       Price prediction routes
# List products with their information
# (Inforamtion passed from client - items to skip)
@app.route('/api/predict', methods=['GET'])
@auth
def predict():
    pass


if __name__ == '__main__':
    db_init()
    app.run(host='0.0.0.0', debug=True)
