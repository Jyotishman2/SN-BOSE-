import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import logging

logger = logging.getLogger(__name__)


class AnomalyDetector:
    """Detect anomalies in electricity demand data using Isolation Forest"""

    def __init__(self, contamination=0.1):
        self.model = None
        self.scaler = None
        self.contamination = contamination
        self.is_trained = False

    def train(self, X):
        """Train Isolation Forest model"""
        try:
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)

            self.model = IsolationForest(
                contamination=self.contamination,
                random_state=42,
                n_jobs=-1
            )

            self.model.fit(X_scaled)

            self.is_trained = True

            logger.info(
                f"Anomaly detector trained on {len(X)} samples"
            )

            return True

        except Exception as e:
            self.is_trained = False
            logger.error(
                f"Error training anomaly detector: {str(e)}"
            )
            return False

    def predict(self, X):
        """
        Predict anomalies
        Returns:
            predictions (-1 anomaly, 1 normal)
            scores
        """

        if self.model is None:
            logger.error("Model not trained yet")
            return None, None

        try:
            X_scaled = self.scaler.transform(X)

            predictions = self.model.predict(X_scaled)

            scores = self.model.score_samples(X_scaled)

            return predictions, scores

        except Exception as e:
            logger.error(
                f"Error making predictions: {str(e)}"
            )
            return None, None

    def detect_anomalies(self, df):
        """
        Detect anomalies in dataframe
        """

        if not self.is_trained:
            logger.error("Anomaly detector not trained")
            return None

        try:
            result_df = df.copy()

            feature_cols = [
                col
                for col in result_df.columns
                if col not in ['demand', 'timestamp']
                and pd.api.types.is_numeric_dtype(result_df[col])
            ]

            print("ANOMALY FEATURES:", feature_cols)

            X = result_df[feature_cols].values

            print("ANOMALY X SHAPE:", X.shape)

            predictions, scores = self.predict(X)

            if predictions is None:
                return None

            result_df['is_anomaly'] = np.where(
                predictions == -1,
                1,
                0
            )

            result_df['anomaly_score'] = scores

            return result_df

        except Exception as e:
            logger.error(
                f"Error detecting anomalies: {str(e)}"
            )
            return None

    def save_model(self, path):
        """Save trained model"""
        try:
            joblib.dump(
                self.model,
                f"{path}/anomaly_model.pkl"
            )

            joblib.dump(
                self.scaler,
                f"{path}/anomaly_scaler.pkl"
            )

            logger.info(
                f"Anomaly model saved to {path}"
            )

            return True

        except Exception as e:
            logger.error(
                f"Error saving model: {str(e)}"
            )
            return False

    def load_model(self, path):
        """Load pre-trained model"""
        try:
            self.model = joblib.load(
                f"{path}/anomaly_model.pkl"
            )

            self.scaler = joblib.load(
                f"{path}/anomaly_scaler.pkl"
            )

            self.is_trained = True

            logger.info(
                f"Anomaly model loaded from {path}"
            )

            return True

        except Exception as e:
            logger.error(
                f"Error loading model: {str(e)}"
            )
            return False

    def get_anomalies_summary(self, df):
        """Get summary of detected anomalies"""

        if 'is_anomaly' not in df.columns:
            return None

        try:
            anomalies = df[df['is_anomaly'] == 1]

            return {
                'total_samples': len(df),
                'anomaly_count': len(anomalies),
                'anomaly_percentage': float(
                    len(anomalies) / len(df) * 100
                ),
                'top_anomalies': anomalies.nlargest(
                    5,
                    'anomaly_score'
                )[
                    [
                        'timestamp',
                        'demand',
                        'anomaly_score'
                    ]
                ].to_dict('records')
                if len(anomalies) > 0
                else []
            }

        except Exception as e:
            logger.error(
                f"Error getting summary: {str(e)}"
            )
            return None

    def get_anomaly_details(self, df, limit=20):
        """Get detailed anomaly list"""

        if 'is_anomaly' not in df.columns:
            return []

        try:
            anomalies = df[
                df['is_anomaly'] == 1
            ].copy()

            if len(anomalies) == 0:
                return []

            anomalies = anomalies.sort_values(
                'anomaly_score'
            ).head(limit)

            result = []

            for _, row in anomalies.iterrows():
                result.append({
                    'timestamp':
                        row['timestamp'].isoformat()
                        if pd.notna(row['timestamp'])
                        else None,

                    'demand':
                        float(row['demand'])
                        if pd.notna(row['demand'])
                        else None,

                    'anomaly_score':
                        float(row['anomaly_score']),

                    'severity':
                        self._score_to_severity(
                            row['anomaly_score']
                        )
                })

            return result

        except Exception as e:
            logger.error(
                f"Error getting anomaly details: {str(e)}"
            )
            return []

    @staticmethod
    def _score_to_severity(score):
        """Convert anomaly score to severity"""

        if score < -0.5:
            return "high"
        elif score < -0.2:
            return "medium"
        else:
            return "low"