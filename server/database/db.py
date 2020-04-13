import pymongo


# Mongo client
dbClient = pymongo.MongoClient("mongodb://localhost:27017/")
mongoDB = dbClient["token_sale"]
userCollection = mongoDB["User"]
productCollection = mongoDB["Product"]


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
