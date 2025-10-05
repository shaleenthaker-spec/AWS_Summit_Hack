import os, json, math
from decimal import Decimal
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["FACILITIES_TABLE"])

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(float(lat1))
    lat2_rad = math.radians(float(lat2))
    delta_lat = math.radians(float(lat2) - float(lat1))
    delta_lon = math.radians(float(lon2) - float(lon1))
    
    a = (math.sin(delta_lat/2) * math.sin(delta_lat/2) + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * 
         math.sin(delta_lon/2) * math.sin(delta_lon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

def lambda_handler(event, context):
    try:
        # Get query parameters
        query_params = event.get("queryStringParameters") or {}
        
        lat = query_params.get("lat")
        lon = query_params.get("lon")
        facility_type = query_params.get("facilityType")
        limit = int(query_params.get("limit", 10))
        radius_km = float(query_params.get("radius", 5.0))  # Default 5km radius
        
        if not lat or not lon:
            return {"statusCode":400, "body": json.dumps({"error": "Missing lat or lon parameters"})}
        
        # Scan all facilities (in production, you'd use a GSI for better performance)
        response = table.scan()
        facilities = response.get("Items", [])
        
        # Filter by facility type if specified
        if facility_type:
            facilities = [f for f in facilities if f.get("facilityType") == facility_type]
        
        # Calculate distances and filter by radius
        nearby_facilities = []
        for facility in facilities:
            distance = calculate_distance(
                lat, lon, 
                facility["lat"], facility["lon"]
            )
            
            if distance <= radius_km:
                facility_data = {
                    "facilityId": facility["facilityId"],
                    "facilityType": facility["facilityType"],
                    "name": facility["name"],
                    "address": facility.get("address", ""),
                    "lat": float(facility["lat"]),
                    "lon": float(facility["lon"]),
                    "ratingAverage": float(facility.get("ratingAverage", 0)),
                    "ratingCount": facility.get("ratingCount", 0),
                    "distance": round(distance, 2)
                }
                nearby_facilities.append(facility_data)
        
        # Sort by distance and limit results
        nearby_facilities.sort(key=lambda x: x["distance"])
        nearby_facilities = nearby_facilities[:limit]
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            "body": json.dumps({
                "facilities": nearby_facilities,
                "count": len(nearby_facilities),
                "userLocation": {"lat": float(lat), "lon": float(lon)}
            })
        }

    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
