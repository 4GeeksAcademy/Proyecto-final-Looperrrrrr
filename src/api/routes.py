"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Cart, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)


CORS(api)


@api.route('/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    results = list(map(lambda product: product.serialize(), products))
    return jsonify(results), 200


@api.route('/products/<int:product_id>', methods=['GET'])
def get_single_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"msg": "Zapatilla no encontrada"}), 404
    return jsonify(product.serialize()), 200


@api.route('/products', methods=['POST'])
def create_product():
    body = request.get_json()
    if 'name' not in body or 'price' not in body:
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    new_product = Product(
        name=body['name'],
        description=body.get('description', 'Sin descripción'),
        price=body['price'],
        image_url=body.get('image_url', 'https://via.placeholder.com/300'),
        size=body.get('size', 42.0),
        condition=body.get('condition', 'Good'),
        original_box=body.get('original_box', True),
        is_sold=False
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"msg": "Zapatilla creada correctamente", "product": new_product.serialize()}), 201


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()

    if 'email' not in body or 'password' not in body:
        return jsonify({"msg": "Falta email o contraseña"}), 400

    user_exists = User.query.filter_by(email=body['email']).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    secure_password = generate_password_hash(body['password'])

    new_user = User(
        email=body['email'],
        password=secure_password,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado con éxito"}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    user = User.query.filter_by(email=body['email']).first()

    if user and check_password_hash(user.password, body['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "user_id": user.id}), 200

    return jsonify({"msg": "Email o contraseña incorrectos"}), 401
