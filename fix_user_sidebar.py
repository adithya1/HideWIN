import re

file_path = "services/web/src/components/Sidebar.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Remove Account Accordion
account_accordion_pattern = r"\{/\* Account Accordion \*/\}.*?\{/\* Account Sub-items \*/\}.*?\{isAccountOpen && \(\n\s*<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' \}\}>\n.*?</div\>\n\s*\)\}"

account_single_link = """                    {/* Account Link */}
                    <Link to="/account/profile" style={{
                        display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                        textDecoration: 'none', color: isActive('/account') ? '#1a73e8' : '#5f6368',
                        backgroundColor: isActive('/account') ? '#f0f4ff' : 'transparent',
                        fontWeight: isActive('/account') ? '600' : '500', fontSize: '15px'
                    }}>
                        {isActive('/account') && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                        <User size={18} style={{ marginRight: '16px', color: isActive('/account') ? '#1a73e8' : '#5f6368' }} strokeWidth={isActive('/account') ? 2.5 : 2} />
                        Account
                    </Link>
"""

new_text = re.sub(account_accordion_pattern, account_single_link, text, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated Sidebar.jsx to remove duplicate account accordion!")
