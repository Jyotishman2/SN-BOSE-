import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class DataProcessor:
    """Process and engineer features from electricity demand data"""

    def __init__(self):
        self.df = None
        self.features_engineered = False

    def load_csv(self, file_path):
        """Load CSV file with demand data"""
        try:
            self.df = pd.read_csv(file_path)
            self.df.columns = [col.lower().strip() for col in self.df.columns]

            logger.info(
                f"Loaded CSV: {len(self.df)} rows, {len(self.df.columns)} columns"
            )
            return True

        except Exception as e:
            logger.error(f"Error loading CSV: {str(e)}")
            return False

    def validate_data(self):
        """Validate that required columns exist"""

        if self.df is None:
            return False

        # Demand column aliases
        if 'demand' not in self.df.columns:
            if 'electricity' in self.df.columns:
                self.df.rename(columns={'electricity': 'demand'}, inplace=True)
            elif 'consumption' in self.df.columns:
                self.df.rename(columns={'consumption': 'demand'}, inplace=True)
            elif 'power' in self.df.columns:
                self.df.rename(columns={'power': 'demand'}, inplace=True)

        # Timestamp column aliases
        if 'timestamp' not in self.df.columns:
            if 'datetime' in self.df.columns:
                self.df.rename(columns={'datetime': 'timestamp'}, inplace=True)
            elif 'date' in self.df.columns:
                self.df.rename(columns={'date': 'timestamp'}, inplace=True)
            elif 'time' in self.df.columns:
                self.df.rename(columns={'time': 'timestamp'}, inplace=True)

        # Required columns check
        if 'demand' not in self.df.columns:
            logger.error("Demand column not found")
            return False

        if 'timestamp' not in self.df.columns:
            logger.error("Timestamp column not found")
            return False

        # Clean demand values
        self.df['demand'] = pd.to_numeric(
            self.df['demand'],
            errors='coerce'
        )

        self.df = self.df.dropna(subset=['demand'])

        # Parse timestamps
        self.df['timestamp'] = pd.to_datetime(
            self.df['timestamp'],
            errors='coerce'
        )

        self.df = self.df.dropna(subset=['timestamp'])

        self.df = (
            self.df
            .sort_values('timestamp')
            .reset_index(drop=True)
        )

        logger.info(f"Data validated: {len(self.df)} valid rows")

        return len(self.df) > 0

    def engineer_features(self):
        """Create temporal and statistical features"""

        if self.df is None or len(self.df) == 0:
            return False

        # Time-based features
        self.df['hour'] = self.df['timestamp'].dt.hour
        self.df['day_of_week'] = self.df['timestamp'].dt.dayofweek
        self.df['month'] = self.df['timestamp'].dt.month
        self.df['day_of_month'] = self.df['timestamp'].dt.day
        self.df['is_weekend'] = (
            self.df['day_of_week'] >= 5
        ).astype(int)

        # Rolling features
        for window in [6, 24]:
            if len(self.df) >= window:
                self.df[f'demand_rolling_mean_{window}'] = (
                    self.df['demand']
                    .rolling(window)
                    .mean()
                )

                self.df[f'demand_rolling_std_{window}'] = (
                    self.df['demand']
                    .rolling(window)
                    .std()
                )

        # Lag features
        for lag in [1, 6, 24]:
            if len(self.df) > lag:
                self.df[f'demand_lag_{lag}'] = (
                    self.df['demand']
                    .shift(lag)
                )

        # Fill NaN values
        self.df = self.df.fillna(
            self.df.mean(numeric_only=True)
        )

        self.features_engineered = True

        logger.info(
            f"Features engineered. Total columns: {len(self.df.columns)}"
        )

        logger.info(
            f"Columns: {self.df.columns.tolist()}"
        )

        return True

    def get_features(self, exclude_cols=['demand', 'timestamp']):
        """Get feature matrix excluding target and timestamp"""

        if self.df is None:
            return None, []

        feature_cols = [
            col
            for col in self.df.columns
            if col not in exclude_cols
            and pd.api.types.is_numeric_dtype(self.df[col])
        ]

        print("FEATURE COLUMNS:", feature_cols)

        X = self.df[feature_cols].values

        print("X SHAPE:", X.shape)

        return X, feature_cols

    def get_target(self):
        """Get target variable"""

        if self.df is None:
            return None

        if 'demand' not in self.df.columns:
            return None

        return self.df['demand'].values

    def get_dataframe(self):
        """Return processed dataframe"""
        return self.df

    def get_summary(self):
        """Get summary statistics"""

        if self.df is None:
            return {}

        if 'demand' not in self.df.columns:
            return {}

        return {
            'rows': len(self.df),
            'columns': len(self.df.columns),
            'date_range': {
                'start': self.df['timestamp'].min().isoformat(),
                'end': self.df['timestamp'].max().isoformat()
            },
            'demand_stats': {
                'mean': float(self.df['demand'].mean()),
                'min': float(self.df['demand'].min()),
                'max': float(self.df['demand'].max()),
                'std': float(self.df['demand'].std())
            }
        }