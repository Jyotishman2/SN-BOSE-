import sqlite3
import pandas as pd
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT_DIR / "hourlyLoadData_NE_weather_with_holiday.csv"
DB_PATH = ROOT_DIR / "backend" / "demand.db"

def migrate():
    print(f"Reading CSV from {CSV_PATH}...")
    if not CSV_PATH.exists():
        print("CSV file not found.")
        return

    df = pd.read_csv(CSV_PATH)
    
    # Ensure datetime is parsed and formatted correctly
    if "datetime" in df.columns:
        dt = pd.to_datetime(df["datetime"])
        df["datetime"] = dt.dt.strftime('%Y-%m-%d %H:%M:%S')
        df["month"] = dt.dt.month
        df["hour"] = dt.dt.hour

    print(f"Loaded {len(df)} rows. Connecting to SQLite at {DB_PATH}...")
    
    conn = sqlite3.connect(DB_PATH)
    
    # Write to SQLite
    df.to_sql("demand_history", conn, if_exists="replace", index=False)
    
    # Create indexes for fast querying
    cursor = conn.cursor()
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_datetime ON demand_history(datetime);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_month_hour ON demand_history(month, hour);")
    conn.commit()
    conn.close()
    
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
