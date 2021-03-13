/* ----------------------------------------------------------------------------
 定数の定義
---------------------------------------------------------------------------- */
const sessionStorageKey = 'downdoadJson';
const downloadFileURL = 'JSON.json'
/* ----------------------------------------------------------------------------
 main処理 (ページロード後にDOM解析終了時の処理)
---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // DataRetainのインスタンスを生成（データのダウンロード）
  const dataRetain = new DataRetain(sessionStorageKey, downloadFileURL);
  dataRetain.download((dataRetain) => {
    // コントローラの生成とページの表示
    const controller = new Controller(dataRetain);
    controller.view();
    console.log(controller);
  });

}, false);
/* ----------------------------------------------------------------------------
  画面管理データ保持 DataRetain - JSONデータをダウンロードして保持する。
---------------------------------------------------------------------------- */
class DataRetain {
  constructor(key, url) {
    this.key = key;
    this.url = url;
    this.downloadData = [];
  }
  download(callback){
    fetch(this.url)
    .then(response => {
      if (response.ok) {
        return response.json(); //json型に変換
      } else {
        return Promise.reject(new Error('ダウンロードエラーだよ！'));
      }
    })
    .then(json => {
      this.downloadData = json.purchaseTypes;
      callback(this);
    })
    .catch(e => {
      console.log(e);
    });
  }
}
/* ----------------------------------------------------------------------------
 Controller クラス - DataRetainからデータ参照、各ViewControllerへの指示、状態保持等
---------------------------------------------------------------------------- */
class Controller {
  constructor(dataRetain) {
    // 画面管理データを保持するインスタンスを格納
    this.dataRetain = dataRetain;
    // 購入方法選択画面を表示部の生成
    this.selectAPurchaseMethodView = new SelectAPurchaseMethodViewController();
    // 操作説明画面を表示部を宣言
    this.operationExplanationView;
    // 表示するTitleIDとして（初回アクセス時のハッシュ値を格納）
    this.currentTitleID = window.location.hash.slice(1);
    this.currentTitleDate = {};
    // 表示するスクリーンIDの初期化
    this.currentScreenID = 'screen01';
  }
  /* ページの表示
  ------------------------------------------------------ */
  view(){
    // 購入方法選択画面の表示
    this.selectAPurchaseMethodView.view(this.dataRetain.downloadData);
    // URLにハッシュ値がある場合、そのハッシュに該当する操作説明を表示する
    if (this.currentTitleID) {
      this.displayOperationExplanationView();
    }
    /* 購入方法ボタンが押下された時（ハッシュ値が変更された時、ハッシュ値がある場合）
    操作説明の画面を表示
    -------------------------------- */
    window.addEventListener('hashchange', (e)=>{
      if(window.location.hash.slice(1)) {
        this.currentTitleID = window.location.hash.slice(1);
        this.displayOperationExplanationView();
      }
    })
  }
  /* 操作説明画面の表示
  ------------------------------------------------------ */
  displayOperationExplanationView(){
    // 操作説明の画面を表示
    this.operationExplanationView = new OperationExplanationViewController();
    this.currentTitleDate = this.getTitleDataToBeDisplayed();
    this.operationExplanationView.view(this.currentTitleDate, this.currentScreenID);
    // 操作説明画面での各イベント処理の定義
    this.defineEvent();
  }
  /* 作説明画面用の表示データを取り出す
  ------------------------------------------------------ */
  getTitleDataToBeDisplayed(titleID = this.currentTitleID) {
    for (let purchaseType of this.dataRetain.downloadData) {
      if (purchaseType.titleID == titleID) {
        return purchaseType;
      }
    }
    return null;
  }
  /* 操作説明画面での各イベント処理の定義
  ------------------------------------------------------ */
  defineEvent() {
    /* クリックイベントを定義
    -------------------------------- */
    document.body.addEventListener('click', (event)=>{
      /* 操作説明画面が（モーダル）表示になっていて、
      操作説明領域（モーダル表示）以外クリックした時と、
      クローズボタンをクリックした時の処理を定義
      -------------------------------- */
      if (document.getElementById('operation-explanation').classList.contains('show') &&
        !event.target.closest('#operation-explanation') || event.target.closest('#close')) {
        // 操作説明画面を閉じる
        this.closeOperationExplanationView();
      }
      /* 操作説明の表示画像内のボタンを押下した時の処理を定義
      -------------------------------- */
      /* TODO:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
      if(event.target.closest('.screen-button')) {
        this.operationExplanationView.screenReDraw(event.target.closest('.screen-button').getAttribute('data-destination'));
      }

    });
    /* Window表示サイズが変化した時の処理
    -------------------------------- */
    window.addEventListener('resize', ()=> {
      // 画像サイズが変更された場合
      if(this.operationExplanationView.checkScreenImageReSize()){
        this.operationExplanationView.buttonsReDraw(this.currentTitleDate, this.currentScreenID);
      }
    });
  }
  /* 操作説明画面を閉じる 
  ------------------------------------------------------ */
  closeOperationExplanationView() {
    this.currentTitleID = '';
    window.location.hash = '';
    this.operationExplanationView.close();
    this.selectAPurchaseMethodView.ankerEvensAuto();
  }
  // TODO: ResizeObserverとMutationObserverを実装する
}
/* ----------------------------------------------------------------------------
 DOM表示制御クラス。 ViewController
---------------------------------------------------------------------------- */
class ViewController {
  /* constructor +
  ------------------------------------------------------ */
  constructor(idName) {
    this.idName = idName;
    // このインスタンスの管理対象となる要素
    this.element = document.getElementById(idName);

    console.log(this.constructor.name,'が生成されました。');
  }
  /* 引き渡された要素を、自身が受け持つ要素に追加する
  ------------------------------------------------------ */
  setElement(childElement) {
    this.element.appendChild(childElement);
  }
  /* 自身が受け持つ要素の全子要素を削除する
  ------------------------------------------------------ */
  deleteElements() {
    while(this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }
  /* 自身が受け持つ要素に、クラス名を追加する
  ------------------------------------------------------ */
  addClassName(className){
    this.element.classList.add(className);
  }
  /* 自身が受け持つ要素のクラス名を削除する
  ------------------------------------------------------ */
  removeClassName(className){
    this.element.classList.remove(className);
  }
  /* 自身が受け持つ要素を表示する
  ------------------------------------------------------ */
  view() {
  }
  /* 自身が受け持つ要素を非表示にする
  ------------------------------------------------------ */
  close(){
  }
}
/* ----------------------------------------------------------------------------
 購入方法選択画面の表示制御クラス。
---------------------------------------------------------------------------- */
class SelectAPurchaseMethodViewController extends ViewController {
  constructor(idName = 'select-a-purchase-method') {
    super(idName);
  }
  /* .select-a-purchase-methodを表示（購入別ボタンを生成し表示する） */
  view(downloadData){
    console.log(`${this.constructor.name}が#${this.idName}を表示します。`);

    const fragment = document.createDocumentFragment();

    downloadData.forEach((purchaseType) => {

      const div =  document.createElement('div');
      div.className = 'btn';
      const a = document.createElement('a');
      if(purchaseType.title.length > 14) {
        a.className = 'twoline';
      }
      a.innerHTML = purchaseType.title;
      a.href = '#' + purchaseType.titleID;
  
      div.appendChild(a);
      fragment.appendChild(div);

    });
    this.setElement(fragment);
    this.ankerEvensAuto();
  }
  /* .select-a-purchase-method内の
  a要素全てをポインターイベントの対象から外す。
  ------------------------------------------------------ */
  ankerEventsNone() {
    const ankers = this.element.querySelectorAll('a');
    for (let anker of ankers) {
      anker.style.pointerEvents = 'none';
    }
  }
  /* .select-a-purchase-method内の
  a要素全てのポインターイベントの対象にする。
  ------------------------------------------------------ */
  ankerEvensAuto() {
    const ankers = this.element.querySelectorAll('a');
    for (let anker of ankers) {
      anker.style.pointerEvents = 'auto';
    }
  }
}
/* ----------------------------------------------------------------------------
 操作説明画面の表示制御クラス。
---------------------------------------------------------------------------- */
class OperationExplanationViewController extends ViewController {
  constructor(idName = 'operation-explanation' ) {
    super(idName);
    this.imagewidth = 0;
    this.imageHeight = 0;
    this.imageNaturalWidth = 0;
    this.imageNaturalHeight = 0;
  }
  /* 自身が受け持つ要素(#operation-explanation)を表示する
  ------------------------------------------------------ */
  view(purchaseType, screenID) {
    this.deleteElements();

    this.setElement(this.createOperationExplanationHedding(purchaseType));
    
    const screen = this.extractDisplaydataMatchesScreenID(purchaseType, screenID);
    this.setElement(this.createOperationExplanationDescription(screen));
    this.setElement(this.createOperationExplanationBox(screen));
    this.setElement(this.createSupplementaryExplanation(screen));
    this.setElement(this.createCloseButton());
    
    // モーダルウィンドウとして表示する
    this.element.classList.add('show');
    document.body.classList.add('bg');

    
    // （画像を表示して幅高さを取得できるので）画像内のボタンを表示する。
    // this.setScreenButton(screen);
    const image = document.getElementById('screen-image');
    console.log(`ow:${image.naturalWidth}, oh:${image.naturalHeight}, ${image.width}x${image.height}`);

    console.log(this.element);
  }
    /*  screenID にマッチした表示データを取り出す
  ------------------------------------------------------ */
  extractDisplaydataMatchesScreenID(purchaseType, screenID) {
    for (let screen of purchaseType.screens) {
      if (screen.screenID == screenID) {
        return screen;
      }
    }
  }
  /* operation-explanation-hedding の生成
  ------------------------------------------------------ */
  createOperationExplanationHedding(purchaseType){
    console.log(purchaseType);
    const opeExpHedding = document.createElement('div');
    opeExpHedding.id = 'operation-explanation-hedding';

    const h2 = document.createElement('h2');
    h2.innerText = purchaseType.title;
    opeExpHedding.appendChild(h2);

    const p = document.createElement('p');
    p.innerText = purchaseType.description;
    opeExpHedding.appendChild(p);

    return opeExpHedding;
  }
  /* operation-explanation-description の生成
  ------------------------------------------------------ */
  createOperationExplanationDescription(screen){
    const opeExpDescription = document.createElement('div');
    opeExpDescription.id = 'operation-explanation-description';

    const h3 = document.createElement('h3');
    h3.innerText = screen.caption;
    opeExpDescription.appendChild(h3);

    const p = document.createElement('p');
    p.innerText = screen.description;
    opeExpDescription.appendChild(p);

    return opeExpDescription;
  }
  /* peration-explanation-box の生成
  ------------------------------------------------------ */
  createOperationExplanationBox(screen){
    const box = document.createElement('div');
    box.id = 'operation-explanation-box';

    const img = document.createElement('img');
    img.id = 'screen-image'
    img.onload = () => { // イメージが読み込み完了したら      
      this.setScreenButton(screen); // 画像内ボタンを追加する
    };
    img.src = screen.imageUrl; // イメージ読み込み開始
    box.appendChild(img); 

    return box;
  }
  /* supplementary explanation の生成
  ------------------------------------------------------ */
  createSupplementaryExplanation(screen) {
    const exp = document.createElement('p');
    exp.textContent = screen.supplementaryExplanation;

    return exp;
  }
  /* （操作説明の表示を）閉じるボタンの要素の生成
  ------------------------------------------------------ */
  createCloseButton() {
    console.log('create close button');
    const closeBtn = document.createElement('div');
    closeBtn.id = 'close';
    closeBtn.textContent = '✖️';
    return closeBtn;
  }
  /* 画面遷移ボタン の生成
  ------------------------------------------------------ */
  setScreenButton(screen){
    const box = document.getElementById('operation-explanation-box');
    const image = document.getElementById('screen-image');
    // TODO: SHARP値で計算方法を変える
    // TODO: buttonをホバーすると、window.clickイベントが消える？？？？
    console.log(`ow:${image.naturalWidth}, oh:${image.naturalHeight}, ${image.width}x${image.height}`);

    this.imagewidth = image.width;
    this.imageHeight = image.height;
    this.imageNaturalWidth = image.naturalWidth;
    this.imageNaturalHeight = image.naturalHeight;
    const widthRatio = image.width / image.naturalWidth
    const heightRatio = image.height / image.naturalHeight

    screen.buttons.forEach((buttonData)=>{
      const button = document.createElement('div');
      button.className = 'screen-button';
      button.setAttribute('data-destination', buttonData.destination);

      button.style.top = (buttonData.coords[1] * widthRatio) + 'px';
      button.style.left = (buttonData.coords[0] * heightRatio) + 'px';
      button.style.width = (Math.abs(buttonData.coords[2] - buttonData.coords[0]) * widthRatio) + 'px';
      button.style.height = (Math.abs(buttonData.coords[3] - buttonData.coords[1]) * heightRatio) + 'px';
      
      box.appendChild(button);
    }); 
  }
  // スクリーン再描画
  screenReDraw(screenID) {
    console.log(screenID, 'に表示しなおします。！！！！！！！') 
    // removeOperationExplanationDescription
    // removeOperationExplanationBox
    // createOperationExplanationDescription
    // createOperationExplanationBox
  }
  /* 画像内ボタンの再描画 */
  buttonsReDraw(purchaseType, screenID){
    console.log('buttonを表示しなおします。！！！！！！！')
    const screen = this.extractDisplaydataMatchesScreenID(purchaseType, screenID);
    const box = document.getElementById('operation-explanation-box');
    const buttons = box.getElementsByClassName('screen-button');
    /// 全てのbuttonをboxから削除
    for (let button of buttons) {
      box.removeChild(button);
    }
    this.setScreenButton(screen);


  }
  /* 画像のリサイズチェック */
  checkScreenImageReSize() {
    const image = document.getElementById('screen-image');
    if (this.imagewidth === image.width && this.imageHeight === image.height) {
      return false;
    }
    this.imagewidth = image.width;
    this.imageHeight = image.height;
    return true;
  }
  /* 自身が受け持つ要素を非表示にする（モーダルウィンドウを閉じる）
  ------------------------------------------------------ */
  close(){
    this.element.classList.remove('show');
    document.body.classList.remove('bg');
    this.deleteElements();
  }
}