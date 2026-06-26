import re

def fix_seed_finance():
    path = 'scripts/seed_finance_accounts.ts'
    with open(path, 'r', encoding='utf-8') as f:
        data = f.read()
    data = data.replace('listData.users.find((u: any) =>', 'listData.users.find((u: { email: string, id: string }) =>')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)

def fix_server():
    path = 'server.ts'
    with open(path, 'r', encoding='utf-8') as f:
        data = f.read()
    data = re.sub(r'staffName:\s*\'[^\']*\',?', 'employeeId: \'admin\',', data)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)

def fix_web_dashboard():
    path = 'src/components/WebDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        data = f.read()
    # Fix the falsy expressions caused by my previous script
    # e.g. setApproveRecipientName('' || (employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown"));
    data = data.replace('\'\' || (employees', '(employees')
    data = data.replace('splitViewTx.\'\' ||', '')
    data = data.replace('\'\' || \'\',', '\'\',')
    data = data.replace('tx.\'\' ||', '')
    data = data.replace('t.\'\' ||', '')
    data = data.replace('setApproveRecipientName(matchedEmp ? matchedEmp.name : (employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown"));', 'setApproveRecipientName(matchedEmp ? matchedEmp.name : (employees.find(e => e.id === splitViewTx.employeeId)?.name || "Unknown"));')
    # If there are any `'' ||`
    data = data.replace("'' || ", "")
    data = data.replace("|| ''", "")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)

def fix_mock_data():
    path = 'src/utils/mockData.ts'
    with open(path, 'r', encoding='utf-8') as f:
        data = f.read()
    data = re.sub(r'rejectReason:.*?\n', '', data)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)

fix_seed_finance()
fix_server()
fix_web_dashboard()
fix_mock_data()
print("Fixed remaining TS issues.")
