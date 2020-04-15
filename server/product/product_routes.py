from flask import Blueprint, jsonify, request
from flask import current_app as app
from database.db import userCollection, productCollection
from middleware.middleware import auth
try:
    from flask import _app_ctx_stack as ctx_stack
except ImportError:
    from flask import _request_ctx_stack as ctx_stack

product_bp = Blueprint('product_bp', __name__)

# Create a new product(done by authorized user)
@product_bp.route('/api/product/create', methods=['POST'])
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
        shortDescription = params["shortDescription"]
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
                      "shortDescription": shortDescription,
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
@product_bp.route('/api/product/list', methods=['POST'])
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
@product_bp.route('/api/product/listUser', methods=['GET'])
@auth
def listUsersProduct():

    payload = ctx_stack.top.jwtPayload
    productOwner = payload["email"]

    try:
        products = productCollection.find(
            {"productOwner": productOwner}
        )
    except:
        return jsonify({'errors': {'general': 'Server error'}}), 500

    productInfo = {"products": []}

    for product in products:
        product.pop("_id")
        productInfo["products"].append(product)

    return jsonify(productInfo), 200

# Testing route 2
@product_bp.route('/product', methods=['GET'])
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
