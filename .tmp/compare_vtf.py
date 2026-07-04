import urllib.request
from pathlib import Path
local_path = Path('public/libs/vtf-converter/vtf.js')
remote_url = 'https://www.fxxkcar.com/sprays/vtf.js'
local = local_path.read_text(encoding='utf-8')
remote = urllib.request.urlopen(remote_url, timeout=20).read().decode('utf-8')
print('local len', len(local), 'remote len', len(remote))
print('same', local == remote)
if local != remote:
    for i,(a,b) in enumerate(zip(local.splitlines(), remote.splitlines()), 1):
        if a != b:
            print('diff line', i)
            print('local:', a)
            print('remote:', b)
            break
