# quorum.smart-contracts
Smart contracts for Kimlic logic on blockchain

# Verification
## Email verification
1. VerificationContractFactory.createEmailVerification to create verification SC. Method returns address of deployed SC
2. BaseVerification.setVerificationResult to update verification result. This method you call on the SC address obtained on previous step

## Phone verification
1. VerificationContractFactory.createPhoneVerification to create verification SC. Method returns address of deployed SC
2. BaseVerification.setVerificationResult to update verification result. This method you call on the SC address obtained on previous step

# User account
## Create User Account SC
Мы проксируем транзакцию, полученную от mobile app
