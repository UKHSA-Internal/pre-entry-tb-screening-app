# Testing Documentation for update_application.py

This document describes the test suite for the `update_application.py` script.

## Test Files

- **`src/test_update_application_unit.py`** - Unit tests using mocks (22 tests)
- **`src/test_update_application_integration.py`** - Integration tests using DynamoDB Local (18 tests)

## Running Tests

### Prerequisites

1. **Python environment with dependencies:**

   ```bash
   # Dependencies are in pyproject.toml:
   # - pytest
   # - pytest-cov
   # - pytest-docker
   # - boto3
   ```

2. **Docker** (for integration tests only):
   - Docker must be installed and running
   - Integration tests will automatically start DynamoDB Local via docker-compose

### Run All Tests

```bash
pytest src/ -v
```

### Run Only Unit Tests (No Docker Required)

```bash
pytest src/test_update_application_unit.py -v
```

### Run Only Integration Tests (Requires Docker)

```bash
pytest src/test_update_application_integration.py -v
```

### Run Tests with Coverage

```bash
pytest src/ -v --cov=src/update_application --cov-report=html
```

## Test Coverage

### Unit Tests (`test_update_application_unit.py`)

**TestStatusGroup:**

- Enum value validation

**TestUpdateFunction:**

- Different application statuses (Certificate Available, Certificate Not Issued, Cancelled, In Progress)
- Existing statusGroup values (both valid and invalid)
- Dry run mode
- Error handling (ConditionalCheckFailedException, other ClientErrors)
- Missing application status field
- Success message printing

**TestMainFunction:**

- DynamoDB resource creation
- Single-page and multi-page scanning
- Empty table handling
- Dry run propagation

**TestMainEntryPoint:**

- Command-line argument parsing
- Parameter validation and stripping

### Integration Tests (`test_update_application_integration.py`)

**TestUpdateIntegration:**

- Real DynamoDB operations for all status types
- Dry run verification
- Conditional check failure handling
- Invalid statusGroup correction

**TestMainIntegration:**

- Single and multiple application processing
- Dry run mode with real database
- Empty table handling
- All status combinations
- Large dataset pagination (50 items)

**TestEndToEndScenarios:**

- Migration from no statusGroup to statusGroup
- Idempotency (running migration twice)
- Dry run preview accuracy
``

## Test Structure

Tests are organized by component:

- **Enum tests**: Verify the StatusGroup enum values
- **Function tests**: Test individual function behavior with mocks
- **Integration tests**: Test actual database operations
- **End-to-end tests**: Test complete workflows

## Notes

- Integration tests use DynamoDB Local running in a Docker container
- Each integration test gets a fresh, empty table (teardown/setup handled by pytest fixtures)
- The `conftest.py` file contains shared fixtures and mocks the `awsglue` module for local testing
