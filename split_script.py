import os

html_path = r'c:\Users\User\Downloads\dssHP\webapp\wiztaste\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract styles
start_style = html.find('<style>')
end_style = html.find('</style>', start_style)
if start_style != -1 and end_style != -1:
    css_content = html[start_style + len('<style>'):end_style].strip()
    with open(os.path.join(os.path.dirname(html_path), 'style.css'), 'w', encoding='utf-8') as f:
        f.write(css_content)
    html = html[:start_style] + '<link rel="stylesheet" href="style.css">' + html[end_style + len('</style>'):]

# Extract scripts
start_script = html.find('<script>')
if start_script != -1:
    first_end = html.find('</script>', start_script)
    js_content = html[start_script + len('<script>'):first_end].strip()
    with open(os.path.join(os.path.dirname(html_path), 'main.js'), 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    # replace from start_script up to </body>
    end_replace_idx = html.find('</body>', start_script)
    html = html[:start_script] + '<script src="main.js"></script>\n' + html[end_replace_idx:]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Split successful')
