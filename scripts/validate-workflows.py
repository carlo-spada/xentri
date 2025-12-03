#!/usr/bin/env python3
import os
import sys

# Configuration
PROJECT_ROOT = os.getcwd()
WORKFLOWS_DIR = os.path.join(PROJECT_ROOT, ".bmad/bmm/workflows")

def resolve_path(path, relative_to):
    path = path.strip().strip('"').strip("'")
    if path.startswith("{project-root}"):
        return path.replace("{project-root}", PROJECT_ROOT)
    elif path.startswith("{installed_path}"):
        return path.replace("{installed_path}", relative_to)
    elif path.startswith("./"):
        return os.path.join(relative_to, path[2:])
    elif path.startswith("/"):
        return path
    else:
        return os.path.join(relative_to, path)

def parse_simple_yaml(file_path):
    """Very basic YAML parser that returns a dict of key-values."""
    config = {}
    try:
        with open(file_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if ":" in line:
                    parts = line.split(":", 1)
                    key = parts[0].strip()
                    value = parts[1].strip()
                    config[key] = value
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return config

def validate_workflow(workflow_path):
    errors = []
    workflow_dir = os.path.dirname(workflow_path)
    
    config = parse_simple_yaml(workflow_path)
            
    if not config:
        return ["Empty or unreadable workflow file"]

    # 1. Validate Metadata
    if 'name' not in config:
        errors.append("Missing 'name'")
    if 'description' not in config:
        errors.append("Missing 'description'")
    
    # 2. Validate Instructions
    if 'instructions' in config:
        instr_path = resolve_path(config['instructions'], workflow_dir)
        if not os.path.exists(instr_path):
            errors.append(f"Instructions file missing: {instr_path}")
        else:
            try:
                with open(instr_path, 'r') as f:
                    content = f.read()
                    if "<workflow>" not in content:
                        errors.append(f"Instructions missing <workflow> tag: {instr_path}")
            except:
                errors.append(f"Could not read instructions: {instr_path}")

    # 3. Validate References (Simple heuristic)
    for key, value in config.items():
        if "{project-root}" in value or "{installed_path}" in value or ("/" in value and not " " in value):
            # Ignore some common config vars
            if value.endswith(":user_name") or value.endswith(":communication_language"):
                continue
            if "http" in value:
                continue
                
            resolved = resolve_path(value, workflow_dir)
            # Remove query params or anchors if any
            resolved = resolved.split('#')[0]
            
            if not os.path.exists(resolved):
                # Relax check for output folders or dynamic paths
                if "docs/" in resolved or "output" in key or "status_file" in key:
                    continue
                # Ignore paths with wildcards or template vars
                if "*" in value or "{{" in value:
                    continue
                    
                errors.append(f"Missing referenced file ({key}): {resolved}")

    return errors

def main():
    print(f"Validating workflows in {WORKFLOWS_DIR}...\n")
    
    results = {}
    
    for root, dirs, files in os.walk(WORKFLOWS_DIR):
        for file in files:
            if file == "workflow.yaml":
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, PROJECT_ROOT)
                errors = validate_workflow(path)
                results[rel_path] = errors

    # Print Report
    pass_count = 0
    fail_count = 0
    
    for path, errors in sorted(results.items()):
        if not errors:
            print(f"✅ {path}")
            pass_count += 1
        else:
            print(f"❌ {path}")
            for err in errors:
                print(f"   - {err}")
            fail_count += 1

    print(f"\nSummary: {pass_count} Passed, {fail_count} Failed")
    
    if fail_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
