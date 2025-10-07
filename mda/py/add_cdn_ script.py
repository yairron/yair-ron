import os

SCRIPT = '''<script 
      src="https://cdn.counter.dev/script.js" 
      data-id="87cd2eee-d5db-43dc-9575-16e58a14c32d" 
      data-utcoffset="3" 
      defer 
      referrerpolicy="no-referrer"></script>
'''

success_files = []
failed_files = []
to_fix = []

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.lower().endswith('.html'):
            path = os.path.join(root, file)
            try:
                with open(path, encoding='utf-8') as f:
                    content = f.read()
                if 'src="https://cdn.counter.dev/script.js"' in content:
                    continue
                to_fix.append(path)
            except Exception as e:
                failed_files.append((path, str(e)))

for path in to_fix:
    try:
        with open(path, encoding='utf-8') as f:
            content = f.read()
        idx = content.find('<style>')
        if idx == -1:
            failed_files.append((path, 'No <style> tag found'))
            continue
        new_content = content[:idx] + SCRIPT + '\n' + content[idx:]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        success_files.append(path)
    except Exception as e:
        failed_files.append((path, str(e)))

print('--- קבצים שטופלו בהצלחה ---')
for f in success_files:
    print(f)

print('\n--- קבצים שבהם הפעולה נכשלה ---')
for f, reason in failed_files:
    print(f"{f} - {reason}")