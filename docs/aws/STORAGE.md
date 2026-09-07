# CLOUD STORAGE STRATEGY (S3)

## Overview
All binary assets (meeting recordings, uploaded attachments, AI-generated reports, static UI assets) are strictly stored in Amazon S3. The API and Realtime services must **never** write binary files to local EBS volumes or EKS ephemeral storage.

## 1. Pre-Signed URLs (MANDATORY)
To prevent the FastAPI service from bottlenecking on file streaming:
- **Uploads**: Clients request a Pre-Signed `PUT` URL from the API. The API generates a 15-minute, size-limited URL, and the client uploads directly to S3.
- **Downloads**: Clients request a Pre-Signed `GET` URL from the API. The API verifies permissions and returns a short-lived URL for direct download.

## 2. Bucket Topology & Encryption
- **Bucket Naming**: `hidewin-prod-assets`, `hidewin-prod-recordings`, `hidewin-prod-static`.
- **Encryption**: `SSE-KMS` (Server-Side Encryption with AWS KMS) is enforced on all buckets. Default AWS managed keys (`aws/s3`) are used unless Customer Managed Keys (CMK) are specifically requested for enterprise compliance.
- **Public Access**: `Block Public Access` is strictly turned ON at the account level.

## 3. Lifecycle Rules (Cost Optimization)
Meeting recordings and large audio dumps consume massive storage. The following S3 Lifecycle policies are enforced:
- **0 - 30 Days**: Standard Storage.
- **30 - 90 Days**: Transition to S3 Standard-IA (Infrequent Access).
- **> 90 Days**: Transition to S3 Glacier Flexible Retrieval.
- **> 365 Days**: Permanently expire/delete (unless the customer is on an enterprise retention plan).

## 4. CORS Configuration
Because clients upload and download directly via pre-signed URLs, the S3 buckets must define strict CORS rules:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
        "AllowedOrigins": ["https://app.hidewin.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

## 5. Static Assets & CloudFront
The Web UI (React SPA) and static branding images are stored in a dedicated `hidewin-prod-static` bucket.
- **Distribution**: AWS CloudFront sits in front of this bucket.
- **OAC (Origin Access Control)**: CloudFront accesses the bucket securely via OAC. The bucket policy denies all direct access except from the CloudFront distribution ARN.
