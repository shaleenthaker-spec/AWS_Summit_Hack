#!/usr/bin/env python3
"""
Sample data script for Lavatory Finder backend
Run this after deploying the backend to populate DynamoDB with test data
"""

import boto3
import json
from decimal import Decimal
from datetime import datetime

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('facilities')

# Sample facilities data
sample_facilities = [
    {
        "facilityId": "facility_001",
        "facilityType": "bathroom",
        "name": "City Mall Restroom",
        "address": "123 Main St, Downtown",
        "lat": Decimal("37.7749"),
        "lon": Decimal("-122.4194"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "wheelchair": True,
            "baby-changing": True,
            "handicap-accessible": True,
            "free": True
        },
        "ratingCount": 156,
        "ratingSum": Decimal("655.2"),
        "ratingAverage": Decimal("4.2")
    },
    {
        "facilityId": "facility_002",
        "facilityType": "water_fountain",
        "name": "Central Park Water Fountain",
        "address": "456 Park Ave",
        "lat": Decimal("37.7849"),
        "lon": Decimal("-122.4094"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "filtered-water": True,
            "bottle-fill": True,
            "free": True
        },
        "ratingCount": 89,
        "ratingSum": Decimal("400.5"),
        "ratingAverage": Decimal("4.5")
    },
    {
        "facilityId": "facility_003",
        "facilityType": "hand_sanitizer",
        "name": "Airport Terminal Sanitizer Station",
        "address": "789 Airport Blvd",
        "lat": Decimal("37.7649"),
        "lon": Decimal("-122.4294"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "touchless": True,
            "free": True,
            "refillable": True
        },
        "ratingCount": 234,
        "ratingSum": Decimal("1053.0"),
        "ratingAverage": Decimal("4.5")
    },
    {
        "facilityId": "facility_004",
        "facilityType": "sink",
        "name": "Public Library Hand Washing Station",
        "address": "321 Library St",
        "lat": Decimal("37.7949"),
        "lon": Decimal("-122.3994"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "hot-water": True,
            "soap-dispenser": True,
            "paper-towels": True,
            "free": True
        },
        "ratingCount": 67,
        "ratingSum": Decimal("301.5"),
        "ratingAverage": Decimal("4.5")
    },
    {
        "facilityId": "facility_005",
        "facilityType": "bathroom",
        "name": "Gas Station Restroom",
        "address": "555 Highway 101",
        "lat": Decimal("37.7549"),
        "lon": Decimal("-122.4394"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "24-hours": True,
            "free": False,
            "coin-operated": True
        },
        "ratingCount": 45,
        "ratingSum": Decimal("180.0"),
        "ratingAverage": Decimal("4.0")
    },
    {
        "facilityId": "facility_006",
        "facilityType": "water_fountain",
        "name": "University Campus Fountain",
        "address": "999 University Ave",
        "lat": Decimal("37.8049"),
        "lon": Decimal("-122.3894"),
        "createdBy": "system",
        "createdAt": datetime.utcnow().isoformat(),
        "features": {
            "filtered-water": True,
            "bottle-fill": True,
            "free": True,
            "cold-water": True
        },
        "ratingCount": 123,
        "ratingSum": Decimal("553.5"),
        "ratingAverage": Decimal("4.5")
    }
]

def populate_sample_data():
    """Populate DynamoDB with sample facilities data"""
    print("🚽 Populating Lavatory Finder with sample data...")
    
    for facility in sample_facilities:
        try:
            table.put_item(Item=facility)
            print(f"✅ Added: {facility['name']} ({facility['facilityType']})")
        except Exception as e:
            print(f"❌ Failed to add {facility['name']}: {e}")
    
    print(f"\n🎉 Successfully added {len(sample_facilities)} sample facilities!")
    print("\n📍 Sample locations:")
    print("   - Downtown area (37.7749, -122.4194)")
    print("   - Central Park (37.7849, -122.4094)")
    print("   - Airport area (37.7649, -122.4294)")
    print("   - Library district (37.7949, -122.3994)")
    print("   - Highway 101 (37.7549, -122.4394)")
    print("   - University area (37.8049, -122.3894)")

if __name__ == "__main__":
    populate_sample_data()
