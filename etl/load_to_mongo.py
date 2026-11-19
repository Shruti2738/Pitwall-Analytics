import json
import os
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_db():
    client = MongoClient(os.getenv("MONGO_URI"))
    return client["pitwall"]


def load_circuits(db):
    """
    2026 calendar with round numbers, dates, and status.
    Status: 'completed', 'ongoing', 'upcoming'
    We compute status automatically based on today's date.
    """
    today = datetime.now(timezone.utc).date()

    calendar_2026 = [
        {"circuit": "Melbourne",         "country": "Australia",    "full_name": "Albert Park Circuit",               "round": 1,  "date": "2026-03-08"},
        {"circuit": "Shanghai",          "country": "China",        "full_name": "Shanghai International Circuit",    "round": 2,  "date": "2026-03-15"},
        {"circuit": "Suzuka",            "country": "Japan",        "full_name": "Suzuka International Racing Course", "round": 3,  "date": "2026-03-29"},
        {"circuit": "Sakhir",            "country": "Bahrain",      "full_name": "Bahrain International Circuit",     "round": 4,  "date": "2026-04-12"},
        {"circuit": "Jeddah",            "country": "Saudi Arabia", "full_name": "Jeddah Corniche Circuit",           "round": 5,  "date": "2026-04-19"},
        {"circuit": "Miami",             "country": "USA",          "full_name": "Miami International Autodrome",     "round": 6,  "date": "2026-05-03"},
        {"circuit": "Montreal",          "country": "Canada",       "full_name": "Circuit Gilles Villeneuve",         "round": 7,  "date": "2026-05-24"},
        {"circuit": "Monte Carlo",       "country": "Monaco",       "full_name": "Circuit de Monaco",                 "round": 8,  "date": "2026-06-07"},
        {"circuit": "Catalunya",         "country": "Spain",        "full_name": "Circuit de Barcelona-Catalunya",    "round": 9,  "date": "2026-06-14"},
        {"circuit": "Spielberg",         "country": "Austria",      "full_name": "Red Bull Ring",                     "round": 10, "date": "2026-06-28"},
        {"circuit": "Silverstone",       "country": "UK",           "full_name": "Silverstone Circuit",               "round": 11, "date": "2026-07-05"},
        {"circuit": "Spa-Francorchamps", "country": "Belgium",      "full_name": "Circuit de Spa-Francorchamps",     "round": 12, "date": "2026-07-26"},
        {"circuit": "Hungaroring",       "country": "Hungary",      "full_name": "Hungaroring",                       "round": 13, "date": "2026-08-02"},
        {"circuit": "Zandvoort",         "country": "Netherlands",  "full_name": "Circuit Zandvoort",                 "round": 14, "date": "2026-08-23"},
        {"circuit": "Monza",             "country": "Italy",        "full_name": "Autodromo Nazionale Monza",         "round": 15, "date": "2026-09-06"},
        {"circuit": "Madrid",            "country": "Spain",        "full_name": "Circuit de Madrid",                 "round": 16, "date": "2026-09-13"},
        {"circuit": "Baku",              "country": "Azerbaijan",   "full_name": "Baku City Circuit",                 "round": 17, "date": "2026-09-26"},
        {"circuit": "Singapore",         "country": "Singapore",    "full_name": "Marina Bay Street Circuit",         "round": 18, "date": "2026-10-11"},
        {"circuit": "Austin",            "country": "USA",          "full_name": "Circuit of the Americas",           "round": 19, "date": "2026-10-25"},
        {"circuit": "Mexico City",       "country": "Mexico",       "full_name": "Autodromo Hermanos Rodriguez",      "round": 20, "date": "2026-11-01"},
        {"circuit": "Interlagos",        "country": "Brazil",       "full_name": "Autodromo Jose Carlos Pace",        "round": 21, "date": "2026-11-08"},
        {"circuit": "Las Vegas",         "country": "USA",          "full_name": "Las Vegas Street Circuit",          "round": 22, "date": "2026-11-21"},
        {"circuit": "Lusail",            "country": "Qatar",        "full_name": "Lusail International Circuit",      "round": 23, "date": "2026-11-29"},
        {"circuit": "Yas Marina Circuit","country": "UAE",          "full_name": "Yas Marina Circuit",                "round": 24, "date": "2026-12-06"},
    ]

    # Non-2026 circuits (historical data only)
    historical_only = [
        {"circuit": "Imola",    "country": "Italy",  "full_name": "Autodromo Enzo e Dino Ferrari", "round": None, "date": None},
    ]

    # Auto-compute status for 2026 races
    next_found = False
    for race in calendar_2026:
        race_date = datetime.strptime(race["date"], "%Y-%m-%d").date()
        if race_date < today:
            race["status"] = "completed"
        elif not next_found:
            race["status"] = "next"   # first future race = next up
            next_found = True
        else:
            race["status"] = "upcoming"
        race["in_2026_calendar"] = True

    for race in historical_only:
        race["status"] = "historical"
        race["in_2026_calendar"] = False

    all_circuits = calendar_2026 + historical_only

    db.circuits.drop()
    db.circuits.insert_many(all_circuits)
    print(f"  Loaded {len(calendar_2026)} calendar circuits + {len(historical_only)} historical")


def load_track_scores(db):
    scores_dir = "data/scores"
    if not os.path.exists(scores_dir):
        print("  No scores dir — run compute_scores.py first")
        return

    db.track_scores.drop()
    total = 0
    for filename in os.listdir(scores_dir):
        if not filename.endswith(".json"):
            continue
        circuit_name = filename.replace(".json", "")
        with open(os.path.join(scores_dir, filename)) as f:
            scores = json.load(f)
        for score in scores:
            score["circuit"] = circuit_name
        db.track_scores.insert_many(scores)
        total += len(scores)
        print(f"  {circuit_name}: {len(scores)} drivers")

    print(f"  Total: {total} score documents")


def load_race_results(db):
    data_dir = "data"
    db.race_results.drop()
    total = 0
    for filename in os.listdir(data_dir):
        if not (filename.startswith("season_") and filename.endswith(".json")):
            continue
        with open(os.path.join(data_dir, filename)) as f:
            season_data = json.load(f)
        for race in season_data:
            for result in race["results"]:
                db.race_results.insert_one({
                    "year": race["year"],
                    "circuit": race["circuit"],
                    "country": race["country"],
                    "date": race["date"],
                    "driver": result["full_name"],
                    "team": result["team_name"],
                    "position": result["position"],
                })
                total += 1
    print(f"  Loaded {total} race result documents")


def create_indexes(db):
    db.track_scores.create_index([("circuit", 1)])
    db.track_scores.create_index([("driver", 1)])
    db.race_results.create_index([("circuit", 1)])
    db.race_results.create_index([("driver", 1)])
    db.circuits.create_index([("circuit", 1)])
    db.circuits.create_index([("round", 1)])
    print("  Indexes created")


if __name__ == "__main__":
    print("Connecting to MongoDB...")
    db = get_db()
    print("Connected\n")

    print("Loading circuits...")
    load_circuits(db)

    print("\nLoading track scores...")
    load_track_scores(db)

    print("\nLoading race results...")
    load_race_results(db)

    print("\nCreating indexes...")
    create_indexes(db)

    print("\nVerifying:")
    print(f"  circuits:     {db.circuits.count_documents({})}")
    print(f"  track_scores: {db.track_scores.count_documents({})}")
    print(f"  race_results: {db.race_results.count_documents({})}")

    # Show status breakdown
    print("\n2026 Calendar status:")
    for s in ["completed", "next", "upcoming"]:
        count = db.circuits.count_documents({"status": s})
        print(f"  {s}: {count} races")