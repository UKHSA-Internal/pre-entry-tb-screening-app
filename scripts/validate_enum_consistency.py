#!/usr/bin/env python3
"""Validate that enum definitions are consistent across TypeScript and Python files."""

import re
import sys
from typing import Dict, Set


def extract_ts_enums(filepath: str) -> Dict[str, Dict[str, str]]:
    """Extract enum definitions from TypeScript file."""
    enums = {}

    with open(filepath, 'r') as f:
        content = f.read()

    # Match enum definitions: export enum EnumName { ... }
    enum_pattern = r'export enum (\w+)\s*\{([^}]+)\}'

    for enum_match in re.finditer(enum_pattern, content):
        enum_name = enum_match.group(1)
        enum_body = enum_match.group(2)

        # Extract key = "value" pairs
        members = {}
        member_pattern = r'(\w+)\s*=\s*"([^"]+)"'

        for member_match in re.finditer(member_pattern, enum_body):
            key = member_match.group(1)
            value = member_match.group(2)
            members[key] = value

        enums[enum_name] = members

    return enums


def extract_python_enums(filepath: str) -> Dict[str, Dict[str, str]]:
    """Extract enum definitions from Python file."""
    enums = {}

    with open(filepath, 'r') as f:
        content = f.read()

    # Match enum class definitions: class EnumName(str, Enum): ...
    class_pattern = r'class (\w+)\(Enum\)\s*:\s*(.*?)(?=class |\Z)'

    for class_match in re.finditer(class_pattern, content, re.DOTALL):
        enum_name = class_match.group(1)
        class_body = class_match.group(2)

        # Extract key = "value" pairs
        members = {}
        member_pattern = r'(\w+)\s*=\s*"([^"]+)"'

        for member_match in re.finditer(member_pattern, class_body):
            key = member_match.group(1)
            value = member_match.group(2)
            members[key] = value

        enums[enum_name] = members

    return enums


def validate_consistency(ts_enums: Dict, py_enums: Dict) -> bool:
    """Validate that both enum definitions match."""
    errors = []

    # Check for enums that should exist in both places
    required_enums = {'ApplicationStatus', 'StatusGroup'}

    for enum_name in required_enums:
        if enum_name not in ts_enums:
            errors.append(f"ERROR: {enum_name} missing from TypeScript")
        if enum_name not in py_enums:
            errors.append(f"ERROR: {enum_name} missing from Python")

        if enum_name in ts_enums and enum_name in py_enums:
            ts_values = set(ts_enums[enum_name].values())
            py_values = set(py_enums[enum_name].values())

            if ts_values != py_values:
                errors.append(
                    f"ERROR: {enum_name} values mismatch:\n"
                    f"  TypeScript: {sorted(ts_values)}\n"
                    f"  Python: {sorted(py_values)}"
                )

    if errors:
        for error in errors:
            print(error)
        return False

    print("✓ All enum definitions are consistent")
    return True


def main():
    ts_file = 'pets-core-services/src/shared/types/enum.ts'
    py_file = 'scripts/applicant_migration/src/migration_script.py'

    try:
        ts_enums = extract_ts_enums(ts_file)
        py_enums = extract_python_enums(py_file)

        if not validate_consistency(ts_enums, py_enums):
            print(f"TypeScript enums: {ts_enums}")
            print(f"Pyhton enums: {py_enums}")
            sys.exit(1)

    except FileNotFoundError as e:
        print(f"ERROR: File not found: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
