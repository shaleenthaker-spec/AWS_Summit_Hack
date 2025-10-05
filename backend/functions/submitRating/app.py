import os, json, uuid
from datetime import datetime
from decimal import Decimal
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["FACILITIES_TABLE"])

def lambda_handler(event, context):
    try:
        user = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
        body = json.loads(event.get("body", "{}"))

        # input validation
        for f in ("facilityId", "rating"):
            if f not in body:
                return {"statusCode":400, "body": json.dumps({"error": f"Missing {f}"})}

        # Validate rating (1-5)
        rating = body["rating"]
        if not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
            return {"statusCode":400, "body": json.dumps({"error": "Rating must be between 1 and 5"})}

        facility_id = body["facilityId"]
        user_id = user.get("sub", "anonymous")
        
        # Check if facility exists
        response = table.get_item(Key={"facilityId": facility_id})
        if "Item" not in response:
            return {"statusCode":404, "body": json.dumps({"error": "Facility not found"})}
        
        facility = response["Item"]
        
        # Update rating statistics
        new_rating_count = facility["ratingCount"] + 1
        new_rating_sum = facility["ratingSum"] + Decimal(str(rating))
        new_rating_average = float(new_rating_sum / new_rating_count)
        
        # Update facility with new rating
        table.update_item(
            Key={"facilityId": facility_id},
            UpdateExpression="SET ratingCount = :count, ratingSum = :sum, ratingAverage = :avg",
            ExpressionAttributeValues={
                ":count": new_rating_count,
                ":sum": new_rating_sum,
                ":avg": Decimal(str(new_rating_average))
            }
        )
        
        return {
            "statusCode": 200, 
            "body": json.dumps({
                "message": "Rating submitted successfully",
                "newAverage": new_rating_average,
                "totalRatings": new_rating_count
            })
        }

    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
