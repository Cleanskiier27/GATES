from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

PORT = 4288

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gates.db'
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "OPTIONS"],
        }
    },
)
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/')
def home():
    return 'GATES Flask App Running!'

@app.route('/api/status')
def api_status():
    return jsonify({
        "service": "GATES Flask Control Backend",
        "status": "ONLINE",
        "port": PORT
    })

@app.route('/api/users')
def api_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email}
        for u in users
    ])

@app.route('/api/artifacts')
def api_artifacts():
    """Returns a template for artifact output from the GATES system."""
    return jsonify({
        "artifact_template": {
            "id": "<artifact-id>",
            "type": "<artifact-type>",
            "source": "<source-component>",
            "payload": {
                "part_number": "<part-number>",
                "position": [0, 0, 0],
                "status": "<status>"
            },
            "metadata": {
                "revision": "<revision>",
                "generated_by": "GATES Flask Control Backend",
                "port": PORT
            }
        },
        "status": "TEMPLATE_READY"
    })

if __name__ == '__main__':
    app.run(port=PORT, debug=True)
