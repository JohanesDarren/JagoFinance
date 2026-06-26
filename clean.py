import re

file_path = 'src/components/WebDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# staffEmail
content = re.sub(r'\b(t|tx|splitViewTx)\.staffEmail\b', r'\1.employeeId', content)

# staffName (display logic)
content = re.sub(r'\{([a-zA-Z0-9_]+)\.staffName\}', r'{employees.find(e => e.id === \1.employeeId)?.name || "Unknown"}', content)

# staffName in searches and checks
content = re.sub(r'([a-zA-Z0-9_]+)\.staffName', r'(employees.find(e => e.id === \1.employeeId)?.name || "Unknown")', content)

# transferReceiptUrl
content = re.sub(r'\b(t|tx|splitViewTx)\.transferReceiptUrl\b', "''", content)

# recipientName
content = re.sub(r'\b(t|tx|splitViewTx)\.recipientName\b', "''", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated WebDashboard.tsx")
