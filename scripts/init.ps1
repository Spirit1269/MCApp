param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory=$true)]
    [string]$Location,

    [Parameter(Mandatory=$true)]
    [string]$SqlAdminUsername,

    [Parameter(Mandatory=$true)]
    [SecureString]$SqlAdminPassword
)

# Convert SecureString to plain text for use with az CLI
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SqlAdminPassword)
$plainTextPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..."
$loginStatus = az account show --query name -o tsv 2>$null
if (-not $loginStatus) {
    Write-Host "Please login to Azure..."
    az login
}

# Create Resource Group
Write-Host "Creating Resource Group: $ResourceGroupName in $Location..."
az group create --name $ResourceGroupName --location $Location

# Deploy Bicep template
Write-Host "Deploying infrastructure..."
$deploymentOutput = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file ./infra/main.bicep `
    --parameters projectName=motorcycle-club-hub `
    --parameters sqlAdministratorLogin=$SqlAdminUsername `
    --parameters sqlAdministratorLoginPassword=$plainTextPassword `
    --query properties.outputs

# Parse outputs
$staticWebAppHostname = ($deploymentOutput | ConvertFrom-Json).staticWebAppHostname.value
$apiUrl = ($deploymentOutput | ConvertFrom-Json).apiUrl.value
$sqlServerFqdn = ($deploymentOutput | ConvertFrom-Json).sqlServerFqdn.value
$containerRegistryLoginServer = ($deploymentOutput | ConvertFrom-Json).containerRegistryLoginServer.value
$b2cTenantName = ($deploymentOutput | ConvertFrom-Json).b2cTenantName.value

# Create service principal for GitHub Actions
Write-Host "Creating service principal for GitHub Actions..."
$spName = "motorcycle-club-hub-github"
$sp = az ad sp create-for-rbac --name $spName --role contributor --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$ResourceGroupName --sdk-auth

# Print results
Write-Host "Infrastructure deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Resource Group: $ResourceGroupName"
Write-Host "Static Web App URL: https://$staticWebAppHostname"
Write-Host "API URL: https://$apiUrl"
Write-Host "SQL Server FQDN: $sqlServerFqdn"
Write-Host "Container Registry: $containerRegistryLoginServer"
Write-Host "B2C Tenant Name: $b2cTenantName"
Write-Host ""
Write-Host "GitHub Actions Service Principal Credentials (add to GitHub Secrets):" -ForegroundColor Yellow
Write-Host "AZURE_CREDENTIALS: $sp"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure GitHub repository with the secrets above"
Write-Host "2. Complete B2C tenant setup in Azure Portal"
Write-Host "3. Update environment variables in the app with the values above"
Write-Host "4. Push code to GitHub to trigger the deployment workflow"