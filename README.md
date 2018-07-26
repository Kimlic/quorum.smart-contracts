# quorum.smart-contracts
Smart contracts for Kimlic logic on blockchain

# Verification
## Email verification
1. VerificationContractFactory.createEmailVerification to create verification SC. Method returns address of deployed SC but to get this piece of data extra call required - `debug_traceTransaction`, see $.returnValue for SC address
2. BaseVerification.finalizeVerification to update verification result. This method you call on the SC address obtained on previous step

## Phone verification
1. VerificationContractFactory.createPhoneVerification to create verification SC. Method returns address of deployed SC but to get this piece of data extra call required - `debug_traceTransaction`, see $.returnValue for SC address
2. BaseVerification.finalizeVerification to update verification result. This method you call on the SC address obtained on previous step

# User account
## Create User Account SC
It's generate on mobile client side and send to API endpoint which simply proxy it to BC
