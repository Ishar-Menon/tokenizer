from flask import Blueprint, jsonify, request
from flask import current_app as app
from database.db import userCollection, productCollection
from middleware.middleware import auth
import jwt
import bcrypt
from time import time
try:
    from flask import _app_ctx_stack as ctx_stack
except ImportError:
    from flask import _request_ctx_stack as ctx_stack
user_bp = Blueprint('user_bp', __name__)


# Create a new user
@user_bp.route('/api/user/create', methods=['POST'])
def createUser():

    if not request.is_json:
        return jsonify({'errors': {'general': 'format error (expected JSON)'}}), 400

    username = email = password = None

    try:
        params = request.get_json()
        username = params["username"]
        password = bcrypt.hashpw(
            params["password"].encode(), bcrypt.gensalt())
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
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Please provide all details'}}), 400

    try:
        userCollection.insert_one(newUser)

        # Generate token
        token = jwt.encode({'email': email, 'exp': time() + 36000},
                           "secretforjwttoken", algorithm='HS256').decode('utf-8')

    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    return jsonify({"token": token}), 200


@user_bp.route('/api/user/login', methods=['POST', 'OPTIONS'])
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
                           "secretforjwttoken", algorithm='HS256').decode('utf-8')

        return jsonify({"token": token}), 200

    # catch JSON format and missing keys (email / password)
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Please provide both email and password'}}), 400

# Get information of the authorized user
@user_bp.route('/api/user/info', methods=['GET'])
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
@user_bp.route('/api/user/buyTokens', methods=['POST'])
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
@user_bp.route('/user', methods=['GET'])
def getAllUsers():
    try:
        users = userCollection.find()
        userInfo = {"users": []}
        for user in users:
            user.pop("_id")
            userInfo["users"].append(user)
            print(user)

        for user in userInfo["users"]:
            user["password"] = user["password"].decode('utf-8')

        return jsonify(userInfo), 200
    except Exception as e:
        print(e)
        return jsonify({'errors': {'general': 'Server error'}}), 500
