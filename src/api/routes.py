"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Cart, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
        return jsonify({"msg": "Faltan datos obligatorios (name, price)"}), 400

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
