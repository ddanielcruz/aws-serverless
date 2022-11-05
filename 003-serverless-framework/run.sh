# Install Serverless framework (exact version as the course)
npm i -g serverless@3.16.0

# Initialize a new project (AWS Node HTTP API)
serverless

# Push a new version after changing the code
sls deploy

# Get deployed functions information
sls info

# Invoke functions locally
sls invoke local -f hello

# Invoke function on production
sls invoke -f hello

# Setup Serverless dashboard
sls

# Remove everything
sls remove --verbose
