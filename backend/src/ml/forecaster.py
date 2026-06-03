import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DemandForecaster:
    """Predict electricity demand for next 24-72 hours"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.is_trained = False
    
    def train(self, X, y, test_size=0.2):
        """Train Random Forest model"""
        try:
            # Scale features
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
            
            # Train Random Forest
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=20,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1,
                verbose=0
            )
            self.model.fit(X_scaled, y)
            self.is_trained = True
            
            # Calculate R² score
            train_score = self.model.score(X_scaled, y)
            logger.info(f"Model trained. R² score: {train_score:.4f}")
            
            return train_score
        except Exception as e:
            self.is_trained = False
            logger.error(f"Error training model: {str(e)}")
            return None
    
    def predict(self, X, feature_names=None):
        """Make predictions"""
        if self.model is None:
            logger.error("Model not trained yet")
            return None
        
        try:
            if self.scaler is not None:
                X_scaled = self.scaler.transform(X)
            else:
                X_scaled = X
            
            predictions = self.model.predict(X_scaled)
            return predictions
        except Exception as e:
            logger.error(f"Error making predictions: {str(e)}")
            return None
    
    def save_model(self, path):
        """Save trained model and scaler"""
        try:
            joblib.dump(self.model, f"{path}/forecaster_model.pkl")
            joblib.dump(self.scaler, f"{path}/forecaster_scaler.pkl")
            logger.info(f"Model saved to {path}")
            return True
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            return False
    
    def load_model(self, path):
        """Load pre-trained model and scaler"""
        try:
            self.model = joblib.load(f"{path}/forecaster_model.pkl")
            self.scaler = joblib.load(f"{path}/forecaster_scaler.pkl")
            self.is_trained = True
            logger.info(f"Model loaded from {path}")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def forecast_next_hours(self, df, hours_ahead=24):
        """
        Forecast demand for next N hours.
        Returns: list of forecasted values with timestamps
        """
        if not self.is_trained:
            logger.error("Model not trained")
            return None
        
        try:
            forecast_data = []
            current_df = df.copy()
            last_timestamp = pd.to_datetime(current_df['timestamp'].iloc[-1])
            
            feature_cols = self.feature_names

            print("FORECAST FEATURE COLS:", feature_cols)
            
            for hour in range(1, hours_ahead + 1):
                # Get latest features
                latest_features = current_df[feature_cols].iloc[-1:].values
                
                # Predict next demand
                pred_demand = self.predict(latest_features)[0]
                pred_demand = max(0, pred_demand)  # Ensure non-negative
                
                # Next timestamp
                next_timestamp = last_timestamp + timedelta(hours=hour)
                
                forecast_data.append({
                    'timestamp': next_timestamp,
                    'demand': pred_demand,
                    'hours_ahead': hour
                })
                
                # Update df for next iteration (simple approach)
                current_df['timestamp'] = pd.to_datetime(current_df['timestamp'])
                new_row = current_df.iloc[-1].copy()
                new_row['timestamp'] = next_timestamp
                new_row['demand'] = pred_demand
                new_row['hour'] = next_timestamp.hour
                new_row['day_of_week'] = next_timestamp.dayofweek
                new_row['month'] = next_timestamp.month
                new_row['day_of_month'] = next_timestamp.day
                new_row['is_weekend'] = int(next_timestamp.dayofweek >= 5)
                
                current_df = pd.concat([current_df, pd.DataFrame([new_row])], ignore_index=True)
            
            return forecast_data
        except Exception as e:
            logger.error(f"Error forecasting: {str(e)}")
            return None
    
    def get_feature_importance(self, top_n=10):
        """Get top N important features"""
        if self.model is None:
            return None
        
        try:
            importances = self.model.feature_importances_
            indices = np.argsort(importances)[::-1][:top_n]
            
            if self.feature_names:
                return [self.feature_names[i] for i in indices]
            return indices.tolist()
        except Exception as e:
            logger.error(f"Error getting feature importance: {str(e)}")
            return None
