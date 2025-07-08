# Intuit Demo

This has been left intentionally vague as to not unintentionally leak any sensitive information.

## License

Copyright © 2025 Adam Ayres. All rights reserved.

This code is proprietary and confidential. Unauthorized copying, distribution,
or use of this material is strictly prohibited.

## Overview

### `model/`

Tools for generating fake data, training the AI model, and evaluating its performance.

### `prediction_service/`

A service to handle incoming requests for refund delay predictions. It uses the AI model to provide insights based on the input data.

### `refund-status-service/`

A service to manage the refund status and provide endpoints for checking refund delays.

### `refund-status-ui/`

Provides a user interface for checking refund status and delays.

### `scripts/`

Contains various scripts for data generation, model training, and other utility functions.

## Demo Script

```
source .venv/bin/activate
make clean
make generate-fake-data
make train-model
make prediction-service

cd ..
cd scripts
nvm use
npm run clear-tables
npm run import-db

cd ..
cd refund-status-service
nvm use
npm run dev

cd ..
cd refund-status-ui
nvm use
npm run dev
```

