from app import db, User


from app import app

def seed():
    with app.app_context():
        db.create_all()
        users = [
            User(username='alice', email='alice@example.com'),
            User(username='bob', email='bob@example.com'),
            User(username='carol', email='carol@example.com')
        ]
        db.session.bulk_save_objects(users)
        db.session.commit()
        print('Database seeded!')

if __name__ == '__main__':
    seed()
