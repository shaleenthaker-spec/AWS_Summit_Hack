import os, json
from decimal import Decimal
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["FACILITIES_TABLE"])

def lambda_handler(event, context):
    try:
        # Get facility ID from path parameters
        facility_id = event.get("pathParameters", {}).get("facilityId")
        
        if not facility_id:
            return {"statusCode":400, "body": json.dumps({"error": "Missing facilityId"})}
        
        # Get facility from DynamoDB
        response = table.get_item(Key={"facilityId": facility_id})
        
        if "Item" not in response:
            return {"statusCode":404, "body": json.dumps({"error": "Facility not found"})}
        
        facility = response["Item"]
        
        # Convert Decimal to float for JSON serialization
        facility_data = {
            "facilityId": facility["facilityId"],
            "facilityType": facility["facilityType"],
            "name": facility["name"],
            "address": facility.get("address", ""),
            "lat": float(facility["lat"]),
            "lon": float(facility["lon"]),
            "createdBy": facility.get("createdBy", ""),
            "createdAt": facility.get("createdAt", ""),
            "features": facility.get("features", {}),
            "ratingCount": facility.get("ratingCount", 0),
            "ratingSum": float(facility.get("ratingSum", 0)),
            "ratingAverage": float(facility.get("ratingAverage", 0))
        }
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            "body": json.dumps(facility_data)
        }

    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
