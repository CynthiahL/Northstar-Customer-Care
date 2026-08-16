# 🚀 Northstar Project Go-Live Deployment Runbook

This document serves as the operational runbook for deploying and verifying the production instances of the Northstar customer care stack. The infrastructure features a decoupled architecture: an asynchronous Python backend on **Render** paired with a Next.js 16 frontend on **Vercel**.

---

## 1. Global Production Architecture

* **Source Code Repository Host:** GitHub / GitLab (Tracking `main` branch)
* **Backend Services Engine:** Render (Compute Container Tier)
* **Frontend User Interface:** Vercel (Edge Compilation Network)

---

## 2. Step-by-Step Deployment Specifications

### Phase A: Backend Infrastructure Setup (Render)
1. Navigate to **Render.com** and instantiate a new **Web Service**.
2. Pair the workspace root repository and enforce these deployment options:
   * **Branch:** `main`
   * **Runtime:** `Python`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
3. Expand **Advanced Settings -> Environment Variables** and inject the following plain string parameters:
   * `ENV` = `production`
   * `ALLOWED_ORIGINS` = `https://<your-app-name>.vercel.app` *(Update this with your final Vercel URL once Phase B completes)*.

### Phase B: Frontend Interface Setup (Vercel)
1. Navigate to **Vercel.com** and select **Import Project**.
2. Select the repository and customize the nested folder routing properties:
   * **Root Directory:** `frontend_update` *(Crucial: Do not compile out of the workspace root)*.
   * **Framework Preset:** `Next.js`
3. Under the **Environment Variables** panel grid, configure the cloud network handshake pointer:
   * **Key:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://<your-service-name>.onrender.com` *(Paste the exact URL issued by Render in Phase A)*.
4. Click **Deploy**. Vercel will process your updated `tsconfig.json` mappings and build the static layout using the Turbopack engine.

---

## 3. Environment Variables Audit Matrix

| Layer | Environment Key | Targeted Production Value | Operational Purpose |
| :--- | :--- | :--- | :--- |
| **Backend** | `ENV` | `production` | Switches loggers and prevents internal debugging code prints. |
| **Backend** | `ALLOWED_ORIGINS` | `https://vercel.app` | Configures FastAPI CORS middleware to allow secure cross-origin handshakes. |
| **Frontend** | `NEXT_PUBLIC_API_URL` | `https://onrender.com` | Instructs React components where to dispatch asynchronous fetch requests. |

---

## 4. Post-Deployment Smoke Test Validation Checklist

Once both platforms display green compilation flags, perform these three validation tests to ensure end-to-end functionality:

- [ ] **API Vital Sign Verification:** Navigate to `https://onrender.com/` in a web browser. It must cleanly respond with: `{"message": "Hello, FastAPI!"}`.
- [ ] **Stateful Counter Handshake:** Load your Vercel URL, open your browser Console, and click **Track Order**. The application must communicate with your live server and safely return the message: *"Happy to help track your order! What's your order number?"* with an HTTP status of `200 OK` in your logs.
- [ ] **Automated Ticketing Fallback Pipeline:** Trigger an deliberate escalation (e.g., inputting sequential random characters inside the return wizard window or selecting a defective item condition option). The interface must bypass standard automated flows, log a record into the backend `_TICKETS` list array, and return a dynamic ticket banner on your screen layout: `Reference: NS-XXXX-XXXX`.

---

## 5. MVP Data Notice & Recovery Runbook

* **In-Memory Limitations:** This application functions using ephemeral in-memory dictionary registries (`_TICKETS`, `RETURN_STORE`, `REFUND_STORE`) for server processing isolation. 
* **State Behavior:** If Render triggers an automatic container spin-down due to 15 minutes of zero-traffic inactivity, or updates a build branch version, **all customer support tickets and returns generated during that window will flush out of active RAM memory.**
* **Recovery / Scale Path:** To maintain historical persistence beyond runtime windows in a subsequent iteration cycle, rewrite the initialization steps within `backend/services/ticketing.py` to point away from memory lists and dump directly to a database schema network hook.

---
- **Swagger Docs:** [http://127.0.0.1/docs](http://127.0.0.1/docs)