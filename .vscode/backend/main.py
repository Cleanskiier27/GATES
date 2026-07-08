from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random
import json
import os

app = FastAPI(title="NASA SBIR Ignite Backend", description="Preciseliens & NetworkBuster Integration")

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), "database.json")

def load_db():
    if os.path.exists(DB_PATH):
        with open(DB_PATH, 'r') as f:
            return json.load(f)
    return {"sheets": {"GlyphProfiling": [], "LatticeFolders": []}}

# Enable CORS to allow the Vite frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeauthRequest(BaseModel):
    partition_id: str

@app.get("/api/telemetry")
async def get_telemetry():
    """Returns simulated live telemetry for the dashboard."""
    return {
        "status": "ONLINE - SECURE",
        "core_temp": round(random.uniform(35.0, 48.0), 1),
        "preciseliens_model": "ACTIVE",
        "netlist_routes": random.randint(1300, 1500),
        "yield_rate": f"{random.uniform(90.0, 99.9):.1f}%",
        "freq_agents": random.randint(12, 24),
        "node_aug_agents": random.randint(8, 16),
        "glyphs_recognized": random.randint(450, 1200)
    }

async def process_deauth(partition_id: str):
    """Background task to simulate the deauth process on the hardware."""
    print(f"Initiating deauth sequence for partition: {partition_id}")
    await asyncio.sleep(3)
    print(f"Partition {partition_id} successfully deauthenticated.")

@app.post("/api/deauth")
async def deauth_partition(request: DeauthRequest, background_tasks: BackgroundTasks):
    """Triggers the deauth sequence."""
    background_tasks.add_task(process_deauth, request.partition_id)
    return {"message": "Deauth sequence initiated", "partition": request.partition_id}

@app.get("/api/bom")
async def get_bom():
    """Returns the live Bill of Materials JSON for the PCB."""
    schematic_path = os.path.join(os.path.dirname(__file__), "schematic.json")
    try:
        with open(schematic_path, "r") as f:
            data = json.load(f)
        return {
            "components": data["bom"],
            "metadata": {
                "name": data.get("name", "Unknown"),
                "revision": data.get("revision", "Unknown")
            }
        }
    except Exception as e:
        return {"error": str(e), "components": []}

@app.get("/api/lattice")
async def get_lattice():
    """Returns the lattice folder structure populated from the Excel database."""
    db = load_db()
    return db["sheets"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4432)
