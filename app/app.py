from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func
from datetime import datetime

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


class ProjectLedger(db.Model):
    """Ledger Flex: Tracks project entries for GATES SBIR funding and milestones."""
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default='USD')
    status = db.Column(db.String(50), nullable=False, default='pending')
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ProjectLedger {self.project_name} - {self.category}>'

    def to_dict(self):
        return {
            "id": self.id,
            "project_name": self.project_name,
            "category": self.category,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

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


@app.route('/api/ledger', methods=['GET'])
def api_ledger_list():
    """Ledger Flex: List all project ledger entries with optional filtering."""
    category = request.args.get('category')
    status = request.args.get('status')

    query = ProjectLedger.query
    if category:
        query = query.filter_by(category=category)
    if status:
        query = query.filter_by(status=status)

    entries = query.order_by(ProjectLedger.created_at.desc()).all()
    return jsonify({
        "ledger_entries": [entry.to_dict() for entry in entries],
        "total": len(entries),
        "service": "GATES Ledger Flex",
        "version": "1.0.0"
    })


@app.route('/api/ledger', methods=['POST'])
def api_ledger_create():
    """Ledger Flex: Create a new project ledger entry."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required_fields = ['project_name', 'category', 'amount']
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        amount = float(data['amount'])
    except (TypeError, ValueError):
        return jsonify({"error": "Field 'amount' must be a number"}), 400

    entry = ProjectLedger(
        project_name=data['project_name'],
        category=data['category'],
        amount=amount,
        currency=data.get('currency', 'USD'),
        status=data.get('status', 'pending'),
        description=data.get('description'),
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({
        "message": "Ledger entry created",
        "entry": entry.to_dict()
    }), 201


@app.route('/api/ledger/summary', methods=['GET'])
def api_ledger_summary():
    """Ledger Flex: Get a summary of project ledger totals by category."""
    results = db.session.query(
        ProjectLedger.category,
        func.sum(ProjectLedger.amount).label('total_amount'),
        func.count(ProjectLedger.id).label('count')
    ).group_by(ProjectLedger.category).all()

    summary = {row.category: {"total_amount": row.total_amount, "count": row.count} for row in results}
    grand_total = sum(row.total_amount for row in results)

    return jsonify({
        "summary": summary,
        "grand_total": grand_total,
        "service": "GATES Ledger Flex",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(port=PORT, debug=True)
