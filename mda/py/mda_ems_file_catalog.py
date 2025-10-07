#!/usr/bin/env python3
"""
MDA Files Catalog Generator
Scans mda/files/ems_mda directory and creates a catalog of all files
with their relative paths from the mda directory.
"""

import os
from pathlib import Path
import datetime

def create_files_catalog():
    """
    Creates a catalog of all files in mda/files/ems_mda subdirectories
    """
    # Get the current script directory (should be mda/py)
    script_dir = Path(__file__).parent
    # Go up one level to get mda directory
    mda_dir = script_dir.parent
    
    # Target directory to scan
    target_dir = mda_dir / "files" / "ems_mda"
    
    # Check if target directory exists
    if not target_dir.exists():
        print(f"Error: Directory {target_dir} does not exist!")
        return False
    
    # List to store all file paths
    file_catalog = []
    
    # Walk through all subdirectories
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            # Get full file path
            full_path = Path(root) / file
            # Get relative path from mda directory
            relative_path = full_path.relative_to(mda_dir)
            file_catalog.append(str(relative_path))
    
    # Sort the catalog alphabetically
    file_catalog.sort()
    
    # Create catalog file in mda directory
    catalog_file = mda_dir / "files_catalog.txt"
    
    try:
        with open(catalog_file, 'w', encoding='utf-8') as f:
            # Write header
            f.write("MDA Files Catalog\n")
            f.write("=" * 50 + "\n")
            f.write(f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Total files found: {len(file_catalog)}\n")
            f.write("=" * 50 + "\n\n")
            
            # Write file paths
            for file_path in file_catalog:
                f.write(f"{file_path}\n")
        
        print(f"Catalog created successfully!")
        print(f"Location: {catalog_file}")
        print(f"Total files cataloged: {len(file_catalog)}")
        
        # Display subdirectories count
        subdirs = set()
        for file_path in file_catalog:
            path_parts = Path(file_path).parts
            if len(path_parts) > 3:  # files/ems_mda/subdir/...
                subdirs.add(path_parts[2])  # Get subdirectory name
        
        print(f"Subdirectories found: {len(subdirs)}")
        if len(subdirs) != 28:
            print(f"Warning: Expected 28 subdirectories, found {len(subdirs)}")
        
        return True
        
    except Exception as e:
        print(f"Error writing catalog file: {e}")
        return False

def main():
    """Main function"""
    print("MDA Files Catalog Generator")
    print("-" * 30)
    
    # Check if we're in the right directory structure
    script_path = Path(__file__)
    expected_py_dir = script_path.parent.name
    expected_mda_dir = script_path.parent.parent.name
    
    if expected_py_dir != "py":
        print(f"Warning: Script should be in 'py' directory, currently in '{expected_py_dir}'")
    
    if expected_mda_dir != "mda":
        print(f"Warning: Expected to be under 'mda' directory, currently under '{expected_mda_dir}'")
    
    # Create the catalog
    success = create_files_catalog()
    
    if success:
        print("\nCatalog generation completed successfully!")
    else:
        print("\nCatalog generation failed!")

if __name__ == "__main__":
    main()