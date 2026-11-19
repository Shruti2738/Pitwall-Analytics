
<div align="center">

# 🏎️ PITWALL ANALYTICS

### Beyond the Chequered Flag.

**An F1 Race Intelligence & Analytics Platform**

Explore Formula 1 through data. Analyse circuits, compare driver performance, uncover track compatibility, and predict race outcomes using historical and live racing data.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📌 Overview

PitWall Analytics is a full-stack Formula 1 analytics platform that transforms racing data into meaningful performance insights.

The platform combines historical race statistics, driver performance metrics, circuit characteristics, and live data sources to explore the factors that influence race outcomes.

From analysing driver performance at individual circuits to evaluating race predictions, PitWall aims to provide a deeper understanding of Formula 1 beyond the leaderboard.

**The idea is simple:**

> Racing is decided on the track. Understanding it starts with data.

---

## ✨ Features

### 🏁 Circuit Intelligence
- Explore Formula 1 circuits and their characteristics.
- Visualise circuit layouts and track configurations.
- Analyse overtaking opportunities, tyre degradation, and qualifying importance.
- Compare historical driver performance across circuits.
- Explore circuit-specific performance metrics.

### 🏎️ Driver Intelligence
- Explore driver profiles and historical statistics.
- Analyse qualifying and race performance.
- Evaluate consistency, reliability, and podium conversion.
- Track recent form and performance momentum.
- Compare driver strengths across different circuits.

### 📊 Driver-Circuit Compatibility
- Evaluate how well a driver performs at a particular circuit.
- Combine historical performance with circuit characteristics.
- Generate compatibility scores.
- Understand the factors behind individual driver rankings.

### 🔮 Race Predictions
- Generate predicted driver rankings.
- Estimate race outcome probabilities.
- Analyse win, podium, and top-five probabilities.
- Evaluate historical performance and recent momentum.

### 🎲 Monte Carlo Simulation
- Simulate possible race outcomes.
- Generate probability distributions across multiple simulations.
- Analyse uncertainty and potential finishing positions.
- Explore how different race scenarios affect predicted results.

### 📈 Data Lab
- Explore historical Formula 1 datasets.
- Compare drivers, circuits, and performance metrics.
- Visualise racing statistics.
- Access structured data through backend APIs.

*Note: Features marked as planned or under development may not yet be available in the current repository version.*

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React |
| Styling | Tailwind CSS |
| Data Visualisation | Recharts, D3.js |
| Animations | GSAP |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Data Processing | Python, Pandas |
| Historical Data | Ergast-compatible datasets |
| Live Data | OpenF1 API |
| Version Control | Git, GitHub |
| Deployment | Vercel, Railway / Render |

---

## 🏗️ Architecture

PitWall Analytics follows a modular architecture with separate frontend, backend, and data-processing components.

```text
                  DATA SOURCES
                       |
             +---------+---------+
             |                   |
        Historical Data       OpenF1 API
             |                   |
             +---------+---------+
                       |
                 PYTHON ETL
                       |
             Data Processing
             Score Calculation
                       |
                       v
                 MONGODB
                       |
                       v
               EXPRESS BACKEND
                       |
                  REST APIs
                       |
                       v
               NEXT.JS FRONTEND
                       |
             +---------+---------+
             |         |         |
          Circuits  Drivers  Analytics
             |         |         |
             +---------+---------+
                       |
                RACE INTELLIGENCE
```

### Project Structure

```text
pitwall-analytics/
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── circuit/
│   │   │   ├── driver/
│   │   │   └── ui/
│   │   │
│   │   ├── lib/
│   │   ├── race/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── public/
│   │   ├── tracks/
│   │   └── drivers/
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── etl/
│   ├── data/
│   ├── fetch_historical.py
│   ├── fetch_results.py
│   ├── compute_scores.py
│   ├── load_to_mongo.py
│   └── requirements.txt
│
├── docs/
│   └── architecture.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# 🚀 Getting Started

Follow these instructions to clone and run PitWall Analytics locally.

## 1. Prerequisites

Install the following software before starting.

| Software | Recommended Version | Download |
|---|---|---|
| Git | Latest | [Git](https://git-scm.com/downloads) |
| Node.js | 20 LTS or newer | [Node.js](https://nodejs.org/) |
| npm | Included with Node.js | [npm](https://www.npmjs.com/) |
| Python | 3.11 or newer | [Python](https://www.python.org/downloads/) |
| MongoDB Atlas | Cloud database | [MongoDB](https://www.mongodb.com/atlas) |

Verify your installations:

```bash
git --version
node --version
npm --version
python --version
```

On macOS/Linux, you may need to use `python3` instead of `python`.

## 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Shruti2738/Pitwall-Analytics.git
```

Navigate into the project:

```bash
cd Pitwall-Analytics
```

## 3. Configure MongoDB

PitWall Analytics uses MongoDB Atlas for database storage.

### Create a MongoDB database

1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create an account or sign in.
3. Create a free cluster.
4. Create a database user with a username and password.
5. Configure Network Access to allow your development machine.
6. Obtain your MongoDB connection string.

Your connection string should follow this format:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/pitwall
```

Replace the placeholders with your actual credentials.

Keep your database credentials private. Never commit them to GitHub.

## 4. Configure Environment Variables

Create local environment files using the following templates.

### Backend

Create:

`backend/.env`

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
```

### ETL Pipeline

Create:

`etl/.env`

```env
MONGODB_URI=your_mongodb_connection_string
```

### Frontend

Create:

`frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Important:** These are example variable names. Check the existing application configuration and use the exact names expected by your code. If the project uses `MONGO_URI` instead of `MONGODB_URI`, configure it accordingly.

Do not upload actual `.env` or `.env.local` files.

---

# 5. Install Dependencies

The frontend, backend, and Python ETL pipeline have separate dependencies.

### Frontend Setup

Open a terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

**http://localhost:3000**

### Backend Setup

Open a second terminal from the project root:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

The backend will be available at:

**http://localhost:4000**

### Python ETL Setup

Open a third terminal:

```bash
cd etl
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

---

# 6. Run the Data Pipeline

The ETL pipeline fetches historical data, processes performance metrics, calculates scores, and loads the resulting data into MongoDB.

Run the scripts in this order:

```bash
python fetch_historical.py
```

```bash
python fetch_results.py
```

```bash
python compute_scores.py
```

```bash
python load_to_mongo.py
```

Make sure your MongoDB connection is configured before running the pipeline.

---

# 7. Run the Complete Application

Start the services in separate terminals.

| Service | Command | URL |
|---|---|---|
| Frontend | `npm run dev` | http://localhost:3000 |
| Backend | `npm run dev` | http://localhost:4000 |
| Database | MongoDB Atlas | Cloud hosted |
| ETL | Python scripts | Run manually |

Once the frontend and backend are running, open:

**http://localhost:3000**

You should now be able to access the locally running application.

---

# 🔌 API Documentation

The backend exposes REST API endpoints for accessing circuit information, performance scores, and race results.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| GET | `/api/circuits` | Retrieve all circuits |
| GET | `/api/circuits/historical` | Retrieve historical circuits |
| GET | `/api/circuits/:name` | Retrieve a specific circuit |
| GET | `/api/scores/:circuit` | Retrieve circuit performance scores |
| GET | `/api/results/:circuit` | Retrieve race results for a circuit |
| GET | `/api/results/:circuit/:driver` | Retrieve a driver's results at a circuit |

Example:

```text
http://localhost:4000/api/circuits
```

---

# 📐 Performance Scoring Model

The current track scoring model combines multiple historical performance metrics.

```text
Track Score =

0.30 × Average Finish
+ 0.25 × Podium Rate
+ 0.20 × Win Rate
+ 0.15 × Qualifying Performance
+ 0.10 × Reliability
```

The scoring pipeline also applies recency weighting to give greater importance to more recent seasons.

The final score is scaled for display.

---

# 📡 Data Sources

PitWall Analytics uses the following data sources:

### Ergast-compatible Historical Data
Historical Formula 1 race results, driver statistics, and circuit information.

### OpenF1 API
Live and recent Formula 1 session data, driver information, and other available racing data.

Website: https://openf1.org/

### MongoDB Atlas
Stores processed circuit information, race results, and performance scores.

Website: https://www.mongodb.com/atlas

Data availability depends on the coverage and update frequency of the respective providers.

---

# 🌐 Deployment

PitWall Analytics is designed to support separate frontend and backend deployments.

### Frontend — Vercel

1. Connect the GitHub repository to Vercel.
2. Set the project root directory to `frontend`.
3. Configure the required environment variables.
4. Deploy the Next.js application.

Website: https://vercel.com/

### Backend — Railway / Render

1. Create a new service connected to the GitHub repository.
2. Set the root directory to `backend`.
3. Configure the MongoDB connection string.
4. Set the production port and frontend CORS origin.
5. Deploy the Express server.

Websites:
- https://railway.com/
- https://render.com/

### Database — MongoDB Atlas

Use MongoDB Atlas as the production database and configure access securely.

---

# 🧑‍💻 Development

To contribute or work on the project:

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Make your changes and commit

```bash
git add .
git commit -m "Describe your changes"
```

### Push your branch

```bash
git push origin feature/your-feature
```

Open a Pull Request on GitHub.

---

# 🗺️ Roadmap

- [x] Historical Formula 1 data collection
- [x] Circuit and race result storage
- [x] Driver performance scoring
- [x] Backend REST API
- [x] Initial analytics frontend
- [ ] Circuit DNA analysis
- [ ] Driver DNA analysis
- [ ] Driver-circuit compatibility engine
- [ ] Explainable race predictions
- [ ] Monte Carlo simulation
- [ ] Interactive race simulator
- [ ] User prediction tracking
- [ ] Data Lab and API explorer
- [ ] Automated data updates

---

# 🔒 Security

- Never commit `.env` files or private credentials.
- Use environment variables for database connections and API keys.
- Restrict MongoDB access to trusted IP addresses.
- Configure production CORS origins.
- Store deployment secrets in your hosting provider's environment settings.

---

# 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

<div align="center">

### 🏎️ PITWALL ANALYTICS

**Beyond the Chequered Flag.**

Built with a passion for Formula 1, software engineering, and data-driven racing intelligence.

</div>
