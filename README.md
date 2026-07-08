# 🛰️ GATES - NASA SBIR Ignite System Dashboard

An advanced, multi-layer monitoring and control system designed for NASA SBIR Ignite payload tracking, telemetry polling, system deauthorization, and PCB Bill of Materials (BOM) visualization.

---

## 🏗️ Architecture Overview

The GATES suite consists of multiple microservices:

1.  **Flask Control Backend (`/app`)**:
    *   Simple database-backed configuration service running on port `4288`.
    *   Implements SQLite database structures (`gates.db`) and SQLAlchmey models.
2.  **FastAPI Telemetry Hub (`/.vscode/backend`)**:
    *   High-performance, asynchronous REST API running on port `4432`.
    *   Serves live telemetry streams, processes asynchronous deauthentication background tasks, and provides PCB layout schema info.
3.  **Vite Frontends**:
    *   `/.vscode/sbir-funding`: React-based dashboard for SBIR funding status and system monitoring.
    *   `/.vscode/vite-sbir`: React-based payload telemetry dashboard with schematic viewers, partition controls, and yield mappings.

---

## 🚀 Quick Start

### 1. Backend Service Configuration

#### Flask App
```bash
cd app
pip install -r requirements.txt
python seed.py  # Seed the SQLite DB
python app.py   # Starts Flask on port 4288
```

#### FastAPI App
```bash
cd .vscode/backend
pip install fastapi uvicorn pydantic
python main.py   # Starts FastAPI on port 4432
```

### 2. Frontend Dashboards

Navigate to either frontend directory and run:
```bash
npm install
npm run dev
```

---

## ⚡ API Specifications

### Telemetry Stream (`GET /api/telemetry`)
Returns live core temperatures, routing states, glyph recognition indices, and yield rates.

### Deauthorization Control (`POST /api/deauth`)
Asynchronously initiates partition deauth sequences on target hardware.

### Ledger Flex (`GET /api/ledger`)
Returns all project ledger entries with optional `category` and `status` query filters.

### Ledger Flex Create (`POST /api/ledger`)
Creates a new project ledger entry. Required fields: `project_name`, `category`, `amount`.

### Ledger Flex Summary (`GET /api/ledger/summary`)
Returns aggregated totals by category across all ledger entries.

---

## 🛡️ Firewall & Security
A helper PowerShell script is provided to open TCP and UDP port `4432` for incoming telemetry and controller communication:
```powershell
Set-ExecutionPolicy Bypass -Scope Process
.\.vscode\setup_port_4432.ps1
```