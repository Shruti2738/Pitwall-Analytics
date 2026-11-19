import requests
import json
import time
import os

# ── helpers ──────────────────────────────────────────────────────────────

def safe_get(url, params, retries=5, backoff=15):
    """
    Makes a GET request. If we get rate-limited (429),
    waits and retries automatically up to `retries` times.
    """
    for attempt in range(retries):
        response = requests.get(url, params=params)

        if response.status_code == 200:
            return response.json()

        elif response.status_code == 429:
            wait = backoff * (attempt + 1)  # 15s, 30s, 45s...
            print(f"    Rate limited. Waiting {wait}s before retry {attempt + 1}/{retries}...")
            time.sleep(wait)

        elif response.status_code == 404:
            print(f"    404 Not Found — skipping (session data unavailable)")
            return None

        else:
            print(f"    HTTP {response.status_code} — skipping")
            return None

    print(f"    Failed after {retries} retries — skipping")
    return None


def get_sessions(year):
    url = "https://api.openf1.org/v1/sessions"
    params = {"year": year, "session_name": "Race"}
    return safe_get(url, params)


def get_race_results(session_key):
    url = "https://api.openf1.org/v1/position"
    params = {"session_key": session_key}
    data = safe_get(url, params)

    if not data:
        return None

    # Keep only the final recorded position per driver
    final_positions = {}
    for entry in data:
        driver_num = entry["driver_number"]
        final_positions[driver_num] = entry

    return list(final_positions.values())


def get_drivers(session_key):
    url = "https://api.openf1.org/v1/drivers"
    params = {"session_key": session_key}
    return safe_get(url, params)


# ── main fetch ────────────────────────────────────────────────────────────

def fetch_season(year):
    print(f"\nFetching {year} season...")
    sessions = get_sessions(year)

    if not sessions:
        print(f"Could not fetch sessions for {year} — skipping")
        return []

    print(f"Found {len(sessions)} races")
    season_data = []

    for i, session in enumerate(sessions):
        session_key = session["session_key"]
        circuit = session["circuit_short_name"]
        country = session["country_name"]
        date = session["date_start"]

        print(f"  [{i+1}/{len(sessions)}] {country} GP ({circuit})...")

        results = get_race_results(session_key)
        if results is None:
            print(f"    Skipping — no results data")
            continue

        drivers = get_drivers(session_key)
        if drivers is None:
            print(f"    Skipping — no driver data")
            continue

        # Build lookup: driver_number → driver info
        driver_lookup = {d["driver_number"]: d for d in drivers}

        race_results = []
        for entry in results:
            driver_num = entry["driver_number"]
            driver_info = driver_lookup.get(driver_num, {})

            # Normalize name to Title Case (fixes "MAX VERSTAPPEN" → "Max Verstappen")
            raw_name = driver_info.get("full_name", "Unknown")
            name = raw_name.title()

            race_results.append({
                "driver_number": driver_num,
                "full_name": name,
                "team_name": driver_info.get("team_name", "Unknown"),
                "position": entry.get("position"),
                "country_code": driver_info.get("country_code", ""),
            })

        season_data.append({
            "session_key": session_key,
            "circuit": circuit,
            "country": country,
            "date": date,
            "year": year,
            "results": race_results
        })

        # Polite delay between requests — crucial for avoiding 429s
        time.sleep(2)

    os.makedirs("data", exist_ok=True)
    filename = f"data/season_{year}.json"
    with open(filename, "w") as f:
        json.dump(season_data, f, indent=2)

    print(f"\nSaved {len(season_data)} races to {filename}")
    return season_data


if __name__ == "__main__":
    fetch_season(2023)
    fetch_season(2024)
    fetch_season(2025)
    fetch_season(2026)