from pathlib import Path
import requests
from bs4 import BeautifulSoup
import urllib
import time


loadUrl = 'https://www.jreast.co.jp/mv-guide/demo/'
html = requests.get(loadUrl)
soup = BeautifulSoup(html.content, 'lxml')
# print(soup)

outFolder = Path('download')
outFolder.mkdir(exist_ok=True)

for image in soup.select('img'):
    imageUrl = urllib.parse.urljoin(loadUrl, image['src'])
    imageData = requests.get(imageUrl)
    filename = imageUrl.split('/')[-1]
    
    outPath = outFolder.joinpath(filename)
    print(outPath)
    with open(outPath, mode='wb') as f:
        f.write(imageData.content)
    time.sleep(1)
