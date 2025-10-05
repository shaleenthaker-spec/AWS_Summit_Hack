import os, json, uuid
from datetime import datetime
from decimal import Decimal
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["BATHROOMS_TABLE"])

def lambda_handler(event, context):
    try:
        user = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
        body = json.loads(event.get("body", "{}"))

        # input validation
        for f in ("name","lat","lon","facilityType"):
            if f not in body:
                return {"statusCode":400, "body": json.dumps({"error": f"Missing {f}"})}

        # Validate facility type
        valid_types = ["bathroom", "water_fountain", "hand_sanitizer", "sink"]
        if body["facilityType"] not in valid_types:
            return {"statusCode":400, "body": json.dumps({"error": f"Invalid facility type. Must be one of: {valid_types}"})}

        facility_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        item = {
            "facilityId": facility_id,
            "facilityType": body["facilityType"],
            "name": body["name"],
            "address": body.get("address", ""),
            "lat": Decimal(str(body["lat"])),
            "lon": Decimal(str(body["lon"])),
            "createdBy": user.get("sub", "anonymous"),
            "createdAt": now,
            "features": body.get("features", {}),
            "ratingCount": 0,
            "ratingSum": 0,
            "ratingAverage": 0.0
        }

        table.put_item(Item=item)
        return {"statusCode": 201, "body": json.dumps({"facilityId": facility_id})}

    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
