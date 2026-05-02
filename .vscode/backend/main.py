from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random

app = FastAPI(title="NASA SBIR Ignite Backend", description="Preciseliens & NetworkBuster Integration")

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
        "yield_rate": f"{random.uniform(90.0, 99.9):.1f}%"
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

import json

@app.get("/api/bom")
async def get_bom():
    """Returns the live Bill of Materials JSON for the PCB."""
    try:
        with open("schematic.json", "r") as f:
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
