/* 

    // TODO: screenReDrawが２回実行される現象
    なぜか（操作説明領域（モーダル表示）以外とクローズボタンをクリック!!!!!!!!!!!!が呼ばれる）
    // TODO: SHARP値で計算方法を変える
 TODO: スマートフォン対応（CSS）
 TODO: JR 共通部のレイアウト＆CSS
 TODO: ポートフォリオ用ページ
 TODO: ポートフォリオ用にgithub README.md
 TODO: mikuro.worksに実装
 TODO: github公開
 */
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
    /* 購入方法ボタンが押下された時と、操作説明が閉じられた時（ハッシュ値が変更された時、ハッシュ値がある場合）
    操作説明の画面を表示
    -------------------------------- */
    window.addEventListener('hashchange', (e)=>{
      console.log('ハッシュ値変更！！！！！！')
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
    const screen = this.extractDisplaydataMatchesScreenID(this.currentTitleDate, this.currentScreenID);
    this.operationExplanationView.view(this.currentTitleDate, screen);
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
    /* クリックイベントを定義(他のクリックイベントと競合する場合があるので注意する)
    -------------------------------- */
    document.body.addEventListener('click', (event)=>{
      console.log('event:::::::::::',event);
      /* 操作説明の表示画像内のボタンを押下した時の処理を定義
      （target.closestを利用する理由として、
      操作画面表示タイミングでイベント定義しているため、
      他のスクリーンボタン全てに付与できないため。） 
      !!!!!!! FIX: スクリーン再描画と操作画面表示タイミングにイベント生成に以降 !!!!!!
      -------------------------------- */
      if(event.target.closest('.screen-button')) {
        console.log('.screen-button event!!!!!!!!!!!!')
        // 遷移先の表示データを引き渡して操作説明表示部に再表示させる
        this.operationExplanationView.screenReDraw(
          // 遷移先の表示データを取得し引数とする
          this.extractDisplaydataMatchesScreenID(
            this.currentTitleDate,
            event.target.closest('.screen-button').getAttribute('data-destination')
          )  
        );
      }
      /* 操作説明画面が（モーダル）表示になっていて、かつ    
         操作説明領域（モーダル表示）以外クリックした時
        （クリックした要素に先祖要素にoperation-explanationが含まれていないこと）
      -------------------------------- */
      if (document.getElementById('operation-explanation').classList.contains('show') &&
        !event.target.closest('#operation-explanation')) {
        console.log('操作説明領域（モーダル表示）以外とクローズボタンをクリック!!!!!!!!!!!!')
          // 操作説明画面を閉じる
        this.closeOperationExplanationView();
      }
    });
    /* クローズボタンをクリックした時の処理を定義
    -------------------------------- */
    document.getElementById('close').addEventListener('click', () => {
      console.log('クローズボタンをクリック!!!!!!!!!!!!')
        // 操作説明画面を閉じる
      this.closeOperationExplanationView();
    });
    /* Window表示サイズが変化した時の処理
    -------------------------------- */
    window.addEventListener('resize', ()=> {
      console.log('リサイズされます！！！！！！')
      // 画像サイズが変更された場合
      if(this.operationExplanationView.checkScreenImageReSize()){
        // 画像ボタンの再描画
        this.operationExplanationView.buttonsReDraw(
          // 現在のスクリーンデータを取得し引数とする
          this.extractDisplaydataMatchesScreenID(
            this.currentTitleDate, this.currentScreenID))
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
  /* screenID にマッチしたscreenoデータを取り出す
  ------------------------------------------------------ */
  extractDisplaydataMatchesScreenID(purchaseType, screenID) {
    for (let screen of purchaseType.screens) {
      if (screen.screenID == screenID) {
        return screen;
      }
    }
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
  view(purchaseType, screen) {
    this.deleteElements();
    this.setElement(this.createCloseButton());

    this.setElement(this.createOperationExplanationHedding(purchaseType));
    
    this.setElement(this.createOperationExplanationDescription(screen));
    this.setElement(this.createOperationExplanationBox(screen));
    this.setElement(this.createSupplementaryExplanation(screen));

    
    // モーダルウィンドウとして表示する
    this.element.classList.add('show');
    document.body.classList.add('bg');

    
    // （画像を表示して幅高さを取得できるので）画像内のボタンを表示する。
    // this.setScreenButton(screen);
    const image = document.getElementById('screen-image');
    console.log(`ow:${image.naturalWidth}, oh:${image.naturalHeight}, ${image.width}x${image.height}`);

    console.log(this.element);
  }
  // スクリーン再描画
  screenReDraw(screen) {
    console.log(screen, 'を表示しなおします。！！！！！！！') 
    document.getElementById('operation-explanation-description').remove();
    document.getElementById('operation-explanation-box').remove();
    document.querySelector('#operation-explanation>p').remove();
    this.setElement(this.createOperationExplanationDescription(screen));
    this.setElement(this.createOperationExplanationBox(screen));
    this.setElement(this.createSupplementaryExplanation(screen));
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
  removeOperationExplanationDescription(screen){

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
  /* 画像内ボタンの再描画 */
  buttonsReDraw(screen){
    console.log('buttonを表示しなおします。！！！！！！！')
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