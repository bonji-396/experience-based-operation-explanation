# クライアントワーク（体感型操作説明ページ）

機器メーカのHPに掲載する、対象機器の操作説明ページ

[指定席券売機ご利用案内](https://www.jreast.co.jp/mv-guide/demo/)  

上記ページの新案ページとして、指定席券売機の操作説明を（モックアップ型）体験型で行うページを作成する。
表示する画面の画像・情報はJSONで取得する。

対象は券売機にてチケットを購入予定のユーザはもちろん、ユーザにをサポートするヘルプデスクオペレータや、機器保守員（保守モード操作と動作確認）など、ユーザをサポートするスタッフが利用することを想定する。


## ヒアリング

### ヒアリングの際に明確にするべきポイント

| ポイント | 回答 |
|--|--|
| 新規のサイトか既にあるサイトのリニューアルか | 企業HPは既あることを想定。ヘッダー、フッターのレイアウトは既存HPにそって作成すること。 |
| Webサーバーの環境（自前・レンタル・有料・無料） | 自前を想定（提出にはリソース・書類のみで、実装は顧客が行う） |
| ドメイン名（有料・無料） | 一部のオリジンのみ新規作成にて考慮なし |
| コンテンツの中身 | __※ あくま試験提出用のなので素材を無断での利用にて著作等の関連より、ページにはベーシック認証を利用し、guestユーザでログインして閲覧可能にする。__<br><br>構成は1ページ（__※画像毎の画面表示は70以上__）<br>■ 指定席券売機ご利用案内<br>① 乗換案内からきっぷを購入<br>② 乗換案内からきっぷを購入（列車を変更する場合）<br>③ 新幹線指定席特急券と乗車券を購入<br>④ Suica定期券を購入<br><br>・以降他のページでも利用できるよなデータを意識したレイアウトをして欲しい。<br>・レスポンシブ対応もしてほしい|
| コンテンツ素材の有無（画像や文章はどうするか） | イメージや文言はそのまま既存画像を流用し加工する |
| パソコンユーザー、スマートフォンユーザーの比率 | 1:1 |
| ターゲットとなるユーザーのペルソナ | ① まだ指定席券売機を要したことがない一般の方が前もって利用方法を確認するために閲覧。<br>② 出張先などで定期券更新方法などを前もって確認ようとする利用者 |
| SNSとの連動 | Twitterでハッシュタグを「#架空企業」として、さらにプロフィール、ツイートに「架空企業」と掲載 |
| アップロード後の保守・管理 | なし |
| デザインの参考サイトやベンチマーク（ライバル的）サイトはあるか？ | https://www.eki-net.com/travel/guide/payment/mv.html　動画が目的を果たしている |
| 公開希望予定日 | 3月19日 |


## サイトにのせるコンテンツ
- 指定席券売機ご利用案内（１ページ：遷移画面数は70以上です）
  1. 乗換案内からきっぷを購入  
  2. 乗換案内からきっぷを購入（列車を変更する場合）  
  3. 新幹線指定席特急券と乗車券を購入  
  4. Suica定期券を購入  


### クライアントの情報

|  |  |
| --- | --- |
| 企業名 | JR東日本 |
| 業種 | 鉄道 |
| クライアントの特徴 | |
| 住所 | |
| ターゲットを決める | 指定席券売機よりチケットを購入しようと前もって確認している利用者|
| 参考サイト |  |


## 要件定義

### システム部分
|  |  |
| --- | --- |
| 新規or改修 | 既存ページの改修 |
| 新規の場合、サーバー・ドメインをどうするか | ドメイン・サーバはそのまま |
| 改修の場合はサーバーのFTP情報の確認 | 修正作業は顧客で実施するので、試験・確認用環境とリソースの提供のみ |
| 埋め込むSNSの有無 | なし |
| お問い合わせフォームの必要性 | なし |
| 作業のタイムスケジュール | 1. 技術調査<br>2. 2/18 カンプ提出・制作開始<br>3. 2/25 テスト<br>4. 3/4 提出・顧客による受け入れテスト<br>5. 3/19 公表 |

### デザイン部分

|  |  |
| --- | --- |
| メインターゲット | 指定席券売機よりチケットを購入しようと前もって確認している利用者　|
| おおまかなデザインコンセプト | （モックアップ型）体験型の定席券売機の操作説明ページ |
| コーポレートカラーの有無 | #008803 |
| 出版物や販促物などの有無 | なし |
| 画像・文章の確認 | 既存画像を利用するが、押下するボタンなどのarea要素対象となる部分の画像加工は必要 |
| 参考にしたいサイト |  |

### プロジェクト概要

|  |  |
| --- | --- |
| サイトの概要（どういったサイトを作るか） | 操作パネルを操作し画面遷移しているような体感型のマニュアル |
| クライアントの情報 |  |
| クライアントの要望 | ・以降他のページでも利用できるよなデータを意識したレイアウトをして欲しい。<br>・レスポンシブ対応もしてほしい |


### サイト情報・構成

|  |  |
| --- | --- |
| サーバー・ドメイン・サイトマップ | 提出するのは１ページ構成のみで、サーバへの実装は顧客で実施するので、確認用サイトとリソースの提出のみとする |
| 各ページのコンテンツ | 画面画像と操作説明、遷移情報、リンクarea情報 |
| ターゲットとなるユーザー | 指定席券売機よりチケットを購入しようと前もって確認している利用者 |

### デザインコンセプト
|  |  |
| --- | --- |
| カラーマネジメント | メインカラー #008803 ベースカラー #ffffff |
| フォント | |
| メインビジュアル | |

### 各ページのワイヤーフレーム

![ワイヤーフレーム](wireframe.png "指定席券売機ご利用案内")

## コンテンツ幅
<dl>
  <dt>コンテンツ最大幅</dt>
  <dd>.container { max-width: 1024px; }</dd>
  <dt>パソコン用</dt>
  <dd>@media screen and (max-width: 1024px) { }</dd>
  <dt>スマートフォン横又はタブレット</dt>
  <dd>@media screen and (max-width: 896px) { }</dd>
  <dt>スマートフォ縦</dt>
  <dd>@media screen and (max-width: 480px) { }</dd>
</dl>



## （要件を満たすための）実現方法と調査


### JSON - 画面遷移の制御やメンテンスのため、画面コンテンツデータに関して

- aJaxでの非同期通信にて取得
- 画面遷移時に取得する画像データの扱い方  
以下の方法で、実際に数画面遷移するサンプルを作成してみてどの方法を採用するか検討する。
  - ページ読み込み時に全ての画像情報に関しては読み込んでおき
    - 「方法１」：  ~~一つの画面要素で構成し、area領域をクリックした時に以下の値を書き換える方法（areaのhrefに関しては#で固定）~~  イメージマップではareaにCSSで定義しても、ホバー時のハイライト処理などのできない。よって、方法１、２は却下。
    - 「方法２」：  ~~一度全ての画面要素をHTML化し、カレントの画面以外はdisplay none (visibility: hidden)で対応。~~  
    ~~area領域をクリックした時に、displayプロパティまたは、 visibilityプロパティを切り替える。~~ 
    - 「方法３」： 一つの画面要素で構成し、一つ上のレイヤー（position: absolute、z-index）にarea座標を指定したオブジェクトをおき、クリックイベントで画面の各値を変更する。
    - 「方法４」：一度全ての画面要素をHTML化し、カレントの画面以外はdisplay none (visibility: hidden)で対応。
    一つ上のレイヤー（position: absolute、z-index）にarea座標を指定したオブジェクトをおき、クリックイベントでした時に、displayプロパティまたは、 visibilityプロパティを切り替える。
- 画面表示領域の要素に、それぞれgroupIndex（利用方法別）、画像にpictureIndex（画面の識別）ID値をに付与する。
- 各スクリーンにはボタンがいくつか存在し、そのボタンの位置を元画面画像のサイズに合わせた座標をcoords値として設定する。 




### 各画面のボタンの構成と座標位置

border-radius での指定、clip-path: polygon　で、rect形以外を対応

rect
頂点1のx座標, 頂点1のy座標, 頂点2のx座標, 頂点2のy座標

circle
円の中心のx座標, 円の中心のy座標, 円の半径

poly
x,yの組のセットを好きな数だけ並べる


#### coordsのレスポンシブ対応
イメージマップを利用するとき、フルードイメージの場合は、coords情報を表示画像サイズに合わせて変更する必要がある。

##### 解決策

- JSONデータにて表示する画像や、遷移先情報、coords値を記載。coords値は元画像サイズに合わせたものとする。
- ① javascriptにて、画像表示など画面遷移を毎に要素を描画するため、その際に画像の表示サイズを取得する。
- ② 以下の公式にてcoords情報を書き換える
  - 元画像サイズ（1280x1024）
coords：660 177 1204 365
  - 表示画像サイズ（800x640）  
coords：412 110 752 228

#### ボタンのホバー時の処理   

従来のイメージマップの場合、areaの枠を消すCSSは適用できるがその他は不可だった。  
よって上記「方法１」、「方法２」の実装は断念



## 実装方法

以下の方法で実装する

### ページの実装方法

- HTML
- CSS
- SVG
- JSON
- Javascript

- ※ 運用上アプリの更新時のコンテンツ変更に関して考える
- rwdImageMapsなどでイメージマップのレスポンシブ化可能だが、ネイティブのJavaScriptでの表示制御を行うため、できるだけjQuery利用を避けたい。

- 画面は最初にメニューした時、モーダル表示で実装する
- CSS でボタン等のハイライト表示やアニメーション処理を行う。
- pushState popState(Webブラウザの [前へ][次へ] ボタン）  https://www.ipentec.com/document/javascript-history-popstate
- SpeechAPIを利用して音声案内を同時に展開できないか検討する。
- 画面遷移については、あくまでページ内のコンテンツ内での仮想的な画面遷移のため、ページ自体の（SPA）画面遷移のようなヘッダー情報の書き換えや、ロードしたコンテンツに再度Loadイベント時の処理を付与する等の必要はない。


### データの取得と作りこみでの実装

- Python
- BeautifulSoup
- json
- requests

#### JSONデータ
操作説明での画面遷移のための情報をJSONで管理し、このページではそのデータを取得してコンテンツを生成する。

#### JSONデータの仕様


##### JSONデータのサンプル

```
{
  "displayAreas": [
    {
      "titleID": "timetable01",
      "title": "乗換案内からきっぷを購入",
      "description" : "高崎から山寺までの列車を発時刻で検索して、新幹線指定席特急券、片道乗車券を購入してみましょう。",
      "screens" : [
        {
          "screenId" : "screen01",
          "caption" : "STEP1",
          "description" : "ご希望のボタンを選びます",
          "supplementaryExplanation" : "",
          "imageUrl" : "img/timetable_slide01.png",
          "buttons": [
            {
              "shape": "rect",
              "screenTransitionDestination": "screen02",
              "coords": [660, 177, 1204, 365]
            }
          ]
        },
        {
          "screenId" : "screen02",
          "caption" : "STEP2",
          "description" : "到着駅を選択します。",
          "supplementaryExplanation" : "出発駅は現在地、利用日時は現在時刻があらかじめ入力されていますが、変更することも可能です。変更する場合は、それぞれの「変更する」ボタンにタッチします。",
          "imageUrl" : "img/timetable_slide02.png",
          "buttons": [
            {
              "name": "next",
              "shape": "rect",
              "screenTransitionDestination": "screen03",
              "coords": [1070, 324, 1198, 391, 20]
            },
            {
              "name" : "cancel",
              "shape": "circle",
              "screenTransitionDestination": "screen00",
              "coords": [67, 957, 58]
            },
            {
              "name": "previous",
              "shape": "rect",
              "screenTransitionDestination": "screen01",
              "coords": [160, 939, 328, 1011, 16]
            }
          ]
        },
      ]
    }
  ]
}

```


#### JSONデータの作成

[指定席券売機ご利用案内](https://www.jreast.co.jp/mv-guide/demo/)  

##### 1. 上記サイトより以下をjupyter-notebookにて実行し利用し取得する。
リンクとなるボタンはダミーとして１つだけ設定


```
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
titleCnt = 0
for sectionElm in sectionElements:
    displayArea = {}
    # displayArea = OrderedDict()
    titleCnt = titleCnt + 1
    displayArea['titleID'] = 'title{:0=2}'.format(titleCnt)
    displayArea['title'] = sectionElm.select_one('h3').text
    try:
        displayArea['description'] = sectionElm.select_one('p.mb50').text
    except AttributeError:
        displayArea['description'] = ''
    
    screenElements = sectionElm.select('li.swiper-slide')
    screens = []
    cnt = 0
    for screen in screenElements:
        cnt = cnt + 1
        screenObj = {}
        screenObj['screenID'] = 'screen{:0=2}'.format(cnt)
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
        buttonObj['screenTransitionDestination'] =  'screen{:0=2}'.format(cnt + 1)
        buttonObj['coords'] = []
        screenObj['buttons'] = []
        screenObj['buttons'].append(buttonObj)
        screens.append(screenObj)

    displayArea['screens'] = screens
    displayAreas.append(displayArea)

hage =  json.dumps(displayAreas, indent=2, ensure_ascii=False)
print(hage)
# pprint.pprint(hage)

```

実行

```
python3 text.py > a.json
```


[実行結果](testpage/a.json)

```
[
  {
    "titleID": "title01",
    "title": " 乗換案内からきっぷを購入",
    "description": "高崎から山寺までの列車を発時刻で検索して、新幹線指定席特急券、片道乗車券を購入してみましょう。",
    "screens": [
      {
        "screenID": "screen01",
        "caption": "STEP1",
        "description": "ご希望のボタンを選びます。",
        "supplementaryExplanation": "",
        "imageUrl": "img/timetable/timetable_slide01.png",
        "buttons": [
          {
            "name": "",
            "shape": "",
            "screenTransitionDestination": "screen02",
            "coords": []
          }
        ]
      },
      ・・・・・・
      t

```

##### 2. 画像データダウンロード

##### 「Firefoxのページの情報」より一括でダウンロード

##### pythonよりスクレイピングダウンロード

 jupyter-notebookで以下を実行するか、またはスクリプトファイルをpythonで実行する。

```
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
```

実行
```
python3 download.py
```

実行結果（コンソール出力）
```
download/kenbaiki.png
download/timetable_slide01.png
download/timetable_slide02.png
download/timetable_slide03.png
download/timetable_slide04.png
download/timetable_slide05.png
download/timetable_slide06.png
download/timetable_slide07.png
download/timetable_slide08.png
download/timetable_slide09.png
download/timetable_slide10.png
download/timetable_slide11.png
download/timetable_slide12.png
download/timetable_slide23.png
download/timetable_slide24.png
download/timetable_slide01.png
download/timetable_slide02.png
download/timetable_slide03.png
download/timetable_slide04.png
download/timetable_slide05.png
download/timetable_slide06.png
download/timetable_slide0702.png
download/timetable_slide14.png
download/timetable_slide15.png
download/timetable_slide16.png
download/timetable_slide17.png
download/timetable_slide18.png
download/timetable_slide09.png
download/timetable_slide20.png
download/timetable_slide21.png
download/timetable_slide22.png
download/timetable_slide23.png
download/timetable_slide24.png
download/shinkansen_slide01.png
download/shinkansen_slide02.png
download/shinkansen_slide03.png
download/shinkansen_slide04.png
download/shinkansen_slide05.png
download/shinkansen_slide06.png
download/shinkansen_slide07.png
download/shinkansen_slide08.png
download/shinkansen_slide09.png
download/shinkansen_slide10.png
download/shinkansen_slide11.png
download/shinkansen_slide12.png
download/shinkansen_slide13.png
download/shinkansen_slide14.png
download/shinkansen_slide15.png
download/shinkansen_slide16.png
download/shinkansen_slide17.png
download/shinkansen_slide18.png
download/shinkansen_slide19.png
download/shinkansen_slide20.png
download/shinkansen_slide21.png
download/shinkansen_slide22.png
download/shinkansen_slide23.png
download/suica_slide01.png
download/suica_slide02.png
download/suica_slide03.png
download/suica_slide04.png
download/suica_slide05.png
download/suica_slide06.png
download/suica_slide07.png
download/suica_slide08.png
download/suica_slide09.png
download/suica_slide10.png
download/suica_slide11.png
download/suica_slide12.png
download/suica_slide13.png
download/suica_slide14.png
download/suica_slide15.png
download/suica_slide16.png
download/suica_slide17.png
download/net_slide01.png
download/net_slide02.png
download/net_slide03.png
download/net_slide04.png
download/net_slide05.png
download/net_slide06.png
download/net_slide07.png
download/ico_pagetop.svg
```

##### 3. スクレイピングで得た情報をJSONに加工する

各画像からcoordsの値を割り出し、それぞれbutton情報をJSONファイルに追加する。

例：抜粋
```
          "buttons": [
            {
              "shape": "rect",
              "screenTransitionDestination": "screen02",
              "coords": [660, 177, 1204, 365]
            }
```


## 制作時間
|   |   | 
|---|---| 
| 構想と仕様決定 | 4時間 |
| 調査 | 8時間 |
| データ取得用コーディング | 4時間 |
| 画像加工と座標取得 | 4時間 |
| コーディング（説明画面） | 8時間 |
| コーディング（既存レイアウトの模倣） | 4時間 |

## 実装で苦しんだところ
### 『画面遷移時に取得する画像データの扱い方』の実装に苦労した。

### 非同期通信での取得したデータの扱いです。

  - FetchでもXMLHTTPrequestでも、取得したデータはその非同期通信処理内でのスコープのみ有効で、グローバル変数やインスタンス内への格納保持も不可であった。
    https://teratail.com/questions/286024
  - 故に、非同期通信の処理内でそのデータを利用しDOM生成行う方法が一番やりやすい。  けれども、イベント全体に必要なデータ量が少ない場合は、最初に１回全てダウンロードした方が効率的でなので、毎回そのイベント（今回であれば画面遷移）毎にデータを取得することになるので無駄である。(一括で必要なデータを取得しても、画像だけはパス情報しか持っておらず、毎回DOMの表示切り替え時にダウンロードするので、それに合わせてという考えもあるが・・・)
  - 場合によっては全てのデータを一旦DOM生成し、表示する要素以外はdisplay:noneにするような仕組みをとる方が良いかもしれない。
  - どうしても取得したデータをsessson Storage に、シリアライズ化（オブジェクトなどを文字列化）し一時保存して、他の場所で再びでシリアライズする。

今回は、JSONデータを一括取得して画像データだけ都度サーバより取得するような感じで実装しました。
本来は非同期通信でWebAPI経由でJSONを取得して、必要な分を得た方がスマートだと思います。
ですが、一括で必要なリソースを取得してDOM生成し（DOM生成時に全ての画像をダウンロードする？）、必要な要素以外を非表示とする手法も捨て難いです。

### 親要素

### クラスベースのオブジェクト指向に対応していないJavaScript
JavaScriptはプロトタイプベースのオブジェクト指向プログラミング

## 課題作成理由
これらの表現は、プレゼンテーションアプリなどでも、ハイパーリンクで画面遷移を表現することは可能ですが、ブラウザの描画速度の利便性は高いと思います。

スマートフォンやPCのアプリは勿論、券売機、ATM、セルフPOSなどの画面操作について迷う方が多いそうです。  
ヘルプ機能を利用することも可能ですが、操作慣れもやはり必要であり、これを克服するためには何度も経験することが必要です。  
擬似的に経験をすることで、この操作慣れを体得することが可能になります。  

また、エンドユーザが使うこと以外にも、教育モードや保守モードなど、同じユーザインターフェースを利用して実装されることも多く、この操作方法も事前にマニュアルなどで調べる必要がああります。
ユーザサポートのコールセンター・ヘルプデスク部門や、機器保守員のサポートなどのテクニカルサポート部門では日々これらの操作説明を行なっていることと思います。 
このとき、実機での操作を想定すると実機の確保や、そのメンテナンス教育コストもかかります。  
即座にブラウザで疑似操作体験しながら説明でき、実機の用意や場所へ移動するなどの無駄を大幅に削減することが可能です。

また、操作しているときに実機では表示しない情報などを画面欄外に表示することで、付加情報を与えることが可能です。

## 今後
応用として以下のようなサイトの改善などに利用可能と思われる。
        

#### 応用用途

- [西武鉄道:券売機・チャージ機の操作方法](https://www.seiburailway.jp/ticket/multifunction-ticket-vending-machine/index.html)  
- [えきネット:指定席券売機での操作方法](https://www.eki-net.com/travel/guide/payment/mv.html)
- [SoftBank Robots:Pepperでアプリを利用するために](https://doc.robot.softbank.jp/pepper_biz_3/manual/index/topics_detail171/id=1629)
- [USEN:UレジFOODの取扱説明書](https://support.usen.com/usr/file/attachment/MxZLFRAWVM12gB5h.pdf)
- [e-net:ATMご利用手順](https://www.enetcom.co.jp/process/newatm/)
- [東芝テック:飲食 POS システム消費税増税対応変更手順マニュアル](https://www.toshibatec.co.jp/products/ctax/pdf/FScompass_keigen.pdf)
- [JR東日本:多機能券売機でのSuica定期券の購入方法](https://www.jreast.co.jp/em-guide/)
- [JR東日本:Apple PayのSuicaをはじめる](https://www.jreast.co.jp/appsuica/start/)

#### 画面遷移情報を作るページの制作
今後の説明対象の機器のソフトウェア更新などにより、コンテンツ内容の修正が生じた時、JSONファイルの修正が必要となるが、これらもユーザ側で簡単に作れるようにする必要がいずれ（要望が）生じる可能性がある。    
[このようなサービス](https://front-end.ai/)のように、画像を放り込むと各オブジェクトをAIで自動認識で生成し、その後そのオブジェクトに対して編集しJSONデータを生成することが理想だが、まずは画像を取り込んでJSONデータに必要な値を入力するところから実装してみたい。  
ある程度形になったら、一つのサービスとして成り立つと考えてます。  

#### Portalsの検討

新仕様に追加される可能性のある portal 要素でのプロトタイプを作ってみることを検討する
