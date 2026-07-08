from app import db, User, ProjectLedger


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

        ledger_entries = [
            ProjectLedger(
                project_name='GATES Phase I',
                category='funding',
                amount=150000.00,
                status='approved',
                description='NASA SBIR Phase I award for GATES telemetry system'
            ),
            ProjectLedger(
                project_name='GATES Phase I',
                category='hardware',
                amount=45000.00,
                status='allocated',
                description='PCB fabrication and component procurement'
            ),
            ProjectLedger(
                project_name='GATES Phase I',
                category='labor',
                amount=80000.00,
                status='active',
                description='Engineering team compensation for Q1-Q2'
            ),
            ProjectLedger(
                project_name='GATES Phase II',
                category='funding',
                amount=750000.00,
                status='pending',
                description='NASA SBIR Phase II proposal submission'
            ),
        ]
        db.session.bulk_save_objects(ledger_entries)

        db.session.commit()
        print('Database seeded!')

if __name__ == '__main__':
    seed()
