cd "c:\Proyek Kolab\JagoAI\JagoFinance\JagoFinance\src\components\web-screens"

mkdir admin-cabang -ErrorAction SilentlyContinue
mkdir super-admin -ErrorAction SilentlyContinue
mkdir shared -ErrorAction SilentlyContinue

Move-Item -Path "ApprovalsScreen.tsx" -Destination "admin-cabang\ApprovalsScreen.tsx"
Move-Item -Path "InboundScreen.tsx" -Destination "admin-cabang\InboundScreen.tsx"
Move-Item -Path "LedgerScreen.tsx" -Destination "admin-cabang\LedgerScreen.tsx"
Move-Item -Path "PayrollScreen.tsx" -Destination "admin-cabang\PayrollScreen.tsx"
Move-Item -Path "OverviewScreen.tsx" -Destination "admin-cabang\OverviewScreen.tsx"

Move-Item -Path "SubscriptionsScreen.tsx" -Destination "super-admin\SubscriptionsScreen.tsx"
Move-Item -Path "IntegrationsScreen.tsx" -Destination "super-admin\IntegrationsScreen.tsx"

Move-Item -Path "ProfileScreen.tsx" -Destination "shared\ProfileScreen.tsx"
Move-Item -Path "WebScreenProps.ts" -Destination "shared\WebScreenProps.ts"

# Now we need to update the imports in the moved files.
# They were using `import { WebScreenProps } from './WebScreenProps';`
# In admin-cabang and super-admin, this is now `../shared/WebScreenProps`

(Get-Content admin-cabang\ApprovalsScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content admin-cabang\ApprovalsScreen.tsx
(Get-Content admin-cabang\InboundScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content admin-cabang\InboundScreen.tsx
(Get-Content admin-cabang\LedgerScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content admin-cabang\LedgerScreen.tsx
(Get-Content admin-cabang\PayrollScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content admin-cabang\PayrollScreen.tsx
(Get-Content admin-cabang\OverviewScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content admin-cabang\OverviewScreen.tsx

(Get-Content super-admin\SubscriptionsScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content super-admin\SubscriptionsScreen.tsx
(Get-Content super-admin\IntegrationsScreen.tsx) -replace "./WebScreenProps", "../shared/WebScreenProps" | Set-Content super-admin\IntegrationsScreen.tsx

(Get-Content shared\ProfileScreen.tsx) -replace "./WebScreenProps", "./WebScreenProps" | Set-Content shared\ProfileScreen.tsx
