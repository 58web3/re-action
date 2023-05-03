# API : Verify verification Code

# Objective.
Verifies the VerificationCode passed from the user and returns the result.

VerificationCode verifies the following items
- VerificationCode is correct
- VerificationCode is unused

# API Design

## API Definitions

| Item Name    | Description                     |
|--------------|---------------------------------|
| API Endpoint | `/v1/verification-code/verify`  |
| Method       | PUT                             |

## Request parameters

| Type        | Item Name         | Description                |
|-------------|-------------------|----------------------------|
| RequestBody | verification_code | Verification code          |

# Processing Details
## Router

Nothing to check

## Controller

### Call DonorService.verifyCode method
parameters:
- verificationCode : req.body.verification_code

### Create Response
```
{
  "message": "Success"
}
```

## Service
### DonorService.verifyCode method

1. Retrieve the record from the Donor table using the verificationCode
    1. If there is no record, return 404 `Verification code is not found` error
2. Check that `is_used = false` for the retrieved record
   1. If `is_used = true`, return 400 `Verification code is already used` error
3. Update a record in the Donor table with `is_verified=true`
