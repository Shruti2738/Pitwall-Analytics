import json
import pandas as pd
import os

# Map Ergast circuit IDs to our OpenF1 short names
CIRCUIT_MAP = {
    "bahrain":              "Sakhir",
    "jeddah":               "Jeddah",
    "albert_park":          "Melbourne",
    "suzuka":               "Suzuka",
    "shanghai":             "Shanghai",
    "miami":                "Miami",
    "imola":                "Imola",
    "monaco":               "Monte Carlo",
    "catalunya":            "Catalunya",
    "villeneuve":           "Montreal",
    "red_bull_ring":        "Spielberg",
    "silverstone":          "Silverstone",
    "hungaroring":          "Hungaroring",
    "spa":                  "Spa-Francorchamps",
    "zandvoort":            "Zandvoort",
    "monza":                "Monza",
    "baku":                 "Baku",
    "marina_bay":           "Singapore",
    "americas":             "Austin",
    "rodriguez":            "Mexico City",
    "interlagos":           "Interlagos",
    "las_vegas":            "Las Vegas",
    "losail":               "Lusail",
    "yas_marina":           "Yas Marina Circuit",
    "madrid":               "Madrid",
}

def load_historical_data():
    """Load the full historical dataset fetched from Ergast."""
    path = "data/historical_all_drivers.json"
    if not os.path.exists(path):
        print("ERROR: Run fetch_historical.py first")
        return None

    with open(path) as f:
        data = json.load(f)

    df = pd.DataFrame(data)

    # Map Ergast circuit IDs to our standard names
    df["circuit_std"] = df["circuit"].map(CIRCUIT_MAP)

    # Drop circuits we don't have a mapping for
    df = df.dropna(subset=["circuit_std"])
    df = df.dropna(subset=["position"])
    df["position"] = df["position"].astype(int)

    print(f"Loaded {len(df)} historical results")
    print(f"Drivers: {df['driver'].nunique()}")
    print(f"Circuits: {sorted(df['circuit_std'].unique())}")
    return df


def compute_track_scores(df, circuit_name):
    circuit_df = df[df["circuit_std"] == circuit_name].copy()
    if circuit_df.empty:
        return None

    # ── Recency weight ──────────────────────────────────────────────
    # More recent seasons count more. 2024 = weight 1.0, each year back = 0.85x
    current_year = 2026
    circuit_df["recency_weight"] = circuit_df["season"].apply(
        lambda y: 0.85 ** (current_year - y)
    )

    stats = []

    for driver, group in circuit_df.groupby("driver"):
        races = len(group)
        w = group["recency_weight"]
        total_weight = w.sum()

        # Weighted avg finish — recent races count more
        weighted_avg_finish = (group["position"] * w).sum() / total_weight

        # Weighted win rate and podium rate
        wins     = int((group["position"] == 1).sum())
        podiums  = int((group["position"] <= 3).sum())

        # Weight wins/podiums by recency too
        weighted_win_rate    = ((group["position"] == 1).astype(float) * w).sum() / total_weight
        weighted_podium_rate = ((group["position"] <= 3).astype(float) * w).sum() / total_weight

        dnfs = int(group["status"].apply(
            lambda s: s != "Finished" and not s.startswith("+")
        ).sum())
        dnf_rate = dnfs / races

        avg_grid = group["grid"].dropna().mean() if group["grid"].notna().any() else 10.0
        group_clean = group.dropna(subset=["grid"])
        avg_gained = (group_clean["grid"] - group_clean["position"]).mean() if len(group_clean) else 0

        stats.append({
            "driver":               driver,
            "team":                 group.sort_values("season").iloc[-1]["team"],
            "races_at_circuit":     races,
            "seasons_raced":        group["season"].nunique(),
            "avg_finish":           round(weighted_avg_finish, 2),
            "avg_grid":             round(avg_grid, 2),
            "wins":                 wins,
            "podiums":              podiums,
            "dnfs":                 dnfs,
            "win_rate":             round(weighted_win_rate, 3),
            "podium_rate":          round(weighted_podium_rate, 3),
            "dnf_rate":             round(dnf_rate, 3),
            "avg_positions_gained": round(avg_gained, 2),
        })

    stats_df = pd.DataFrame(stats)
    if stats_df.empty:
        return None

    max_pos = 20

    stats_df["norm_avg_finish"]  = 1 - ((stats_df["avg_finish"] - 1) / (max_pos - 1))
    stats_df["norm_podium_rate"] = stats_df["podium_rate"]
    stats_df["norm_win_rate"]    = stats_df["win_rate"]
    stats_df["norm_reliability"] = 1 - stats_df["dnf_rate"]
    stats_df["norm_qualifying"]  = 1 - ((stats_df["avg_grid"] - 1) / (max_pos - 1))

    # ── Monaco-style circuit gets win-heavy weighting ───────────────
    # Wins matter most on street circuits where overtaking is nearly impossible
    stats_df["track_score"] = (
        0.25 * stats_df["norm_avg_finish"]  +
        0.30 * stats_df["norm_podium_rate"] +
        0.25 * stats_df["norm_win_rate"]    +
        0.12 * stats_df["norm_qualifying"]  +
        0.08 * stats_df["norm_reliability"]
    ).round(4)

    stats_df = stats_df.sort_values("track_score", ascending=False).reset_index(drop=True)
    stats_df["rank"] = stats_df.index + 1

    return stats_df