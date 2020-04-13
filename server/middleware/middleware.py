from flask import request, jsonify
import jwt
import pymongo
import bcrypt
try:
    from flask import _app_ctx_stack as ctx_stack
except ImportError:
    from flask import _request_ctx_stack as ctx_stack


def auth(fn):
    def wrapper(*args, **kwargs):
        try:
            token = request.headers.get('x-auth-token')
            payload = jwt.decode(
                token, "secretforjwttoken", algorithms=['HS256'])
            ctx_stack.top.jwtPayload = payload
        except Exception as e:
            print(e)
            return jsonify({'errors': {'general': 'Invalid token'}}), 400
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper
