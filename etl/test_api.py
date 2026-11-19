import requests
import json

# Fetch all sessions from the 2024 season
url = "https://api.openf1.org/v1/sessions"
params = {
    "year": 2024,
    "session_name": "Race"
}

response = requests.get(url, params=params)
data = response.json()

# Print the first result so we can see the structure
print(json.dumps(data[0], indent=2))
print(f"\nTotal races found: {len(data)}")