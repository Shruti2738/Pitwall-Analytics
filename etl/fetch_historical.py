import requests
import json
import time
import os

DRIVERS = {
    "max_verstappen":    "Max Verstappen",
    "hamilton":          "Lewis Hamilton",
    "leclerc":           "Charles Leclerc",
    "norris":            "Lando Norris",
    "piastri":           "Oscar Piastri",
    "russell":           "George Russell",
    "alonso":            "Fernando Alonso",
    "sainz":             "Carlos Sainz",
    "albon":             "Alexander Albon",
    "stroll":            "Lance Stroll",
    "gasly":             "Pierre Gasly",
    "ocon":              "Esteban Ocon",
    "hulkenberg":        "Nico Hulkenberg",
    "bottas":            "Valtteri Bottas",
    "perez":             "Sergio Perez",
    "lawson":            "Liam Lawson",
    "bearman":           "Oliver Bearman",
    "colapinto":         "Franco Colapinto",
    "hadjar":            "Isack Hadjar",
    "bortoleto":         "Gabriel Bortoleto",
    "antonelli":         "Kimi Antonelli",
    "lindblad":          "Arvid Lindblad",
}

def fetch_driver_results(driver_id):
    all_results = []
    offset = 0
    limit = 100

    while True:
        url = f"https://api.jolpi.ca/ergast/f1/drivers/{driver_id}/results.json"
        params = {"limit": limit, "offset": offset}

        for attempt in range(4):  # retry up to 4 times
            try:
                response = requests.get(url, params=params, timeout=30)  # increased to 30s
                if response.status_code == 429:
                    print(f"    Rate limited, waiting 20s...")
                    time.sleep(20)
                    continue
                if response.status_code != 200:
                    print(f"    HTTP {response.status_code} — stopping")
                    return all_results
                break  # success
            except Exception as e:
                print(f"    Attempt {attempt+1} failed: {e}")
                time.sleep(5)
        else:
            print(f"    All retries failed, skipping driver")
            return all_results

        data = response.json()
        races = data["MRData"]["RaceTable"]["Races"]

        if not races:
            break

        for race in races:
            if not race.get("Results"):
                continue
            result = race["Results"][0]
            all_results.append({
                "season":       int(race["season"]),
                "round":        int(race["round"]),
                "circuit":      race["Circuit"]["circuitId"],
                "circuit_name": race["Circuit"]["circuitName"],
                "country":      race["Circuit"]["Location"]["country"],
                "driver":       DRIVERS.get(driver_id, driver_id),
                "team":         result["Constructor"]["name"],
                "position":     int(result["position"]) if result["position"].isdigit() else None,
                "grid":         int(result["grid"]) if result.get("grid", "0").isdigit() else None,
                "status":       result["status"],
                "points":       float(result.get("points", 0)),
                "laps":         int(result.get("laps", 0)),
            })

        total = int(data["MRData"]["total"])
        offset += limit
        if offset >= total:
            break

        time.sleep(1)  # polite delay between pages

    return all_results

def fetch_all_drivers():
    os.makedirs("data", exist_ok=True)
    all_results = []

    for driver_id, driver_name in DRIVERS.items():
        print(f"Fetching {driver_name}...")
        results = fetch_driver_results(driver_id)
        print(f"  {len(results)} races found")
        all_results.extend(results)
        time.sleep(2)  # polite delay between drivers

    with open("data/historical_all_drivers.json", "w") as f:
        json.dump(all_results, f, indent=2)

    print(f"\nTotal results: {len(all_results)}")
    print("Saved to data/historical_all_drivers.json")
    return all_results

if __name__ == "__main__":
    fetch_all_drivers()