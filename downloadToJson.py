import requests
from bs4 import BeautifulSoup
import json
from collections import OrderedDict
import pprint

url = 'https://www.jreast.co.jp/mv-guide/demo/'
res = requests.get(url)
res.encoding = res.apparent_encoding
soup = BeautifulSoup(res.content, 'lxml')

sectionElements = soup.select('section.pb100')
displayAreas = []
for index, sectionElm in enumerate(sectionElements):
    displayArea = {}
    # displayArea = OrderedDict()
    displayArea['titleID'] = 'title{:0=2}'.format(index + 1)
    displayArea['title'] = sectionElm.select_one('h3').text
    try:
        displayArea['description'] = sectionElm.select_one('p.mb50').text
    except AttributeError:
        displayArea['description'] = ''
    
    screenElements = sectionElm.select('li.swiper-slide')
    screens = []
    for index, screen in enumerate(screenElements):
        screenObj = {}
        screenObj['screenID'] = 'screen{:0=2}'.format(index + 1)
        screenObj['caption'] = screen.select_one('dt.step').text 
        screenObj['description'] = screen.select_one('dd.stepTxt').text
        try:
            screenObj['supplementaryExplanation'] = screen.find(class_='text').text
        except AttributeError:
            screenObj['supplementaryExplanation'] = ''
        screenObj['imageUrl']  = screen.select_one('img')['src']
        buttonObj = {}
        buttonObj['name'] = ''
        buttonObj['shape'] = ''
        buttonObj['destination'] = 'screen{:0=2}'.format(index + 2)
        buttonObj['coords'] = []
        screenObj['buttons'] = []
        screenObj['buttons'].append(buttonObj)
        screens.append(screenObj)

    displayArea['screens'] = screens
    displayAreas.append(displayArea)

hage =  json.dumps(displayAreas, indent=2, ensure_ascii=False)
print(hage)
# pprint.pprint(hage)
