/* 
 TODO: AWS: Basic認証
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
  });
}, false);
/* ----------------------------------------------------------------------------
 DataRetain - JSONデータをダウンロードして保持する
---------------------------------------------------------------------------- */
class DataRetain {
  constructor(key, url) {
    this.key = key;
    this.url = url;
    this.downloadData = [];
  }
  /* JSONデータダウンロード */
  download(callback){
    fetch(this.url)
    // レスポンス処理
    .then(response => {
      if (response.ok) {
        return response.json(); //json型に変換
      } else {
        return Promise.reject(new Error('ダウンロードエラーだよ！'));
      }
    })
    // 取得データ処理
    .then(json => {
      this.downloadData = json.purchaseTypes;
      callback(this);
    })
    // エラー処理
    .catch(e => {
      console.log(e);
    });
  }
}
/* ----------------------------------------------------------------------------
 Controller - DataRetainからデータ参照、各ViewControllerへの指示、状態保持等
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
    this.currentTitleData = {};
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
      this.displayOperationExplanationView();           // 操作説明を表示 
    }
    // ハッシュ値が変更された時の処理
    this.defineHashchangeEvent();
    // クリックイベント処理
    this.defineClickEvents();
  }
  /* 操作説明画面の表示
  ------------------------------------------------------ */
  displayOperationExplanationView(){
    // 操作説明表示部を生成
    this.operationExplanationView = new OperationExplanationViewController();
    this.currentTitleData = this.getTitleDataToBeDisplayed();
    // 操作説明の画面を表示
    const screen = this.extractDisplaydataMatchesScreenID(this.currentTitleData, this.currentScreenID);
    this.operationExplanationView.view(this.currentTitleData, screen); // ###########
    // クローズボタンをクリックした時の処理
    this.defineCloseButtonEvents();
    // Window表示サイズが変化した時の処理
    window.addEventListener('resize', this.defineResizeEvents);
    // 購入方法選択画面のボタンのポインターイベントを無効
    this.selectAPurchaseMethodView.ankerEventsNone();
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
  /* ハッシュ値が変更された時の処理
  -------------------------------- */
  defineHashchangeEvent() {
    window.addEventListener('hashchange', (e)=>{
      if(window.location.hash.slice(1)) {
        this.currentTitleID = window.location.hash.slice(1);
        this.currentScreenID = 'screen01';
        this.displayOperationExplanationView();
      }
    });  
  }
  /* クリックイベントを定義 
  ------------------------------------------------------ */
  defineClickEvents() {
    document.body.addEventListener('click', (event)=>{
      /* 画像内ボタンをクリックした時の動作を定義 */
      if (event.target.closest('.screen-button')) {
        // 遷移先の表示データを引き渡して操作説明表示部に再表示させる
        this.operationExplanationView.screenReDraw( //##########
          // 遷移先の表示データと、データセット（遷移先スクリーン名）を取得し引数とする
          this.extractDisplaydataMatchesScreenID(
            this.currentTitleData,
            // event.target.closest('.screen-button').getAttribute('data-destination')
            event.target.closest('.screen-button').dataset.destination
          )  
        );
        this.currentScreenID = event.target.closest('.screen-button').dataset.destination;

      /*  操作説明画面の表示部の外側をクリックした時 */
      } else if (document.getElementById('operation-explanation').classList.contains('show') &&
                !event.target.closest('#operation-explanation')) {
        // 操作説明画面を閉じる
        this.closeOperationExplanationView();
        this.currentScreenID = 'screen01';
      }
    });
  }
  /* クローズボタンをクリックした時の処理
  ------------------------------------------------------ */
  defineCloseButtonEvents() {
    document.getElementById('close').addEventListener('click', () => {
      // 操作説明画面を閉じる
      this.closeOperationExplanationView();
      this.currentScreenID = 'screen01';
    });
  }
  /* Window表示サイズが変化した時の処理
  ------------------------------------------------------ */
  defineResizeEvents = () => {
      // 画像サイズが変更された場合
      if(this.operationExplanationView.checkScreenImageReSize()){
        // 画像ボタンの再描画　#########
        this.operationExplanationView.buttonsReDraw(
          // 現在のスクリーンデータを取得し引数とする
          this.extractDisplaydataMatchesScreenID(
            this.currentTitleData, this.currentScreenID))
      }
  }
  /* 操作説明画面を閉じる 
  ------------------------------------------------------ */
  closeOperationExplanationView() {
    // 画像内ボタンの削除
    this.operationExplanationView.removeScreenButtons();

    this.currentTitleID = '';
    window.location.hash = '';
    this.operationExplanationView.close();
    this.selectAPurchaseMethodView.ankerEvensAuto();
    // Window表示サイズが変化した時の処理を削除
    window.removeEventListener('resize', this.defineResizeEvents);
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
  
  // ResizeObserverとMutationObserverを実装でも良いかもしれない・・・
}
/* ----------------------------------------------------------------------------
  ViewController - DOM生成表示
---------------------------------------------------------------------------- */
class ViewController {
  /* constructor +
  ------------------------------------------------------ */
  constructor(idName) {
    this.idName = idName;
    // このインスタンスの管理対象となる要素
    this.element = document.getElementById(idName);
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
 SelectAPurchaseMethodViewController - 購入方法選択画面の表示制御クラス。
---------------------------------------------------------------------------- */
class SelectAPurchaseMethodViewController extends ViewController {
  constructor(idName = 'select-a-purchase-method') {
    super(idName);
  }
  /* .select-a-purchase-methodを表示（購入別ボタンを生成し表示する） */
  view(downloadData){

    const fragment = document.createDocumentFragment();

    downloadData.forEach((purchaseType) => {

      const div =  document.createElement('div');
      div.className = 'btn';
      const a = document.createElement('a');

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
 OperationExplanationViewController - 操作説明画面の表示制御クラス。
---------------------------------------------------------------------------- */
class OperationExplanationViewController extends ViewController {
  constructor(idName = 'operation-explanation' ) {
    super(idName);
    this.imgElemWidth = 0; // リサイズチェック用のリサイズ前の幅を格納
    this.imgElemHeight = 0;// リサイズチェック用のリサイズ前の高さを格納 
  }
  /* 自身が受け持つ要素(#operation-explanation)を表示する
  ------------------------------------------------------ */
  view(purchaseType, screen) {
    // 全要素削除
    this.deleteElements();
    // クローズボタン生成
    this.setElement(this.createCloseButton());
    // スクリーンヘッダー
    this.setElement(this.createOperationExplanationHedding(purchaseType));
    // スクリーン
    this.setElement(this.createOperationExplanationDescription(screen));
    this.setElement(this.createOperationExplanationBox(screen));
    this.setElement(this.createSupplementaryExplanation(screen));
    // モーダルウィンドウとして表示する
    this.element.classList.add('show');
    // （画像を表示して幅高さを取得できるので）画像内のボタンを表示する。
    const image = document.getElementById('screen-image');
  }
  // スクリーン再描画
  screenReDraw(screen) {
    document.getElementById('operation-explanation-description').remove();
    document.getElementById('operation-explanation-box').innerHTML = '';
    document.getElementById('operation-explanation-box').remove();
    document.getElementById('supplementary-explanation').remove();
    this.setElement(this.createOperationExplanationDescription(screen));
    this.setElement(this.createOperationExplanationBox(screen));
    this.setElement(this.createSupplementaryExplanation(screen));
  }
  /* operation-explanation-hedding の生成
  ------------------------------------------------------ */
  createOperationExplanationHedding(purchaseType){
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
    
    // box.style.backgroundImage = `url(${screen.imageUrl})`;

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
    const supp = document.createElement('div');
    supp.id = 'supplementary-explanation';

    const exp = document.createElement('p');
    exp.textContent = screen.supplementaryExplanation;

    supp.appendChild(exp);
    return supp ;
  }
  /* （操作説明の表示を）閉じるボタンの要素の生成
  ------------------------------------------------------ */
  createCloseButton() {
    const closeBtn = document.createElement('div');
    closeBtn.id = 'close';
    closeBtn.textContent = '✖️';
    return closeBtn;
  }
  /*
   画面遷移ボタンの生成し画像の上にセットする
  ------------------------------------------------------ */
  setScreenButton(screen){
    const box = document.getElementById('operation-explanation-box');
    const image = document.getElementById('screen-image');
    console.log('ow:', image.naturalWidth, 'oh:', image.naturalHeight, 'dw:', image.width, 'dh:', image.height);

    const regularRatio = image.naturalHeight / image.naturalWidth;
    const imgEelementRatio = image.height / image.width;
    console.log('rr:', regularRatio, 'iee:',imgEelementRatio);

    let scaleRatio = 0;
    let leftPositionCorrectionValue = 0;
    let topPositionCorrectionValue = 0;
    if (imgEelementRatio > regularRatio) {
      // 実際表示されている画像より、img要素の縦幅（高さ）が長い時
      scaleRatio = image.width / image.naturalWidth;
      console.log('>scaleRatio', scaleRatio);
      // 表示されている画像の実際の縦幅（高さ）を算出する
      const actualHeight = image.naturalHeight * scaleRatio;
      console.log('>actualHeight', actualHeight);
      topPositionCorrectionValue = (image.height - actualHeight) / 2;
      console.log('>topPositionCorrectionValue',topPositionCorrectionValue)
    } else {
      // 実際表示されている画像より、img要素の横幅幅が長い時
      scaleRatio = image.height / image.naturalHeight;
      console.log('<=scaleRatio', scaleRatio);
      // 表示されている画像の実際の幅を算出する
      const actualWidth = image.naturalWidth * scaleRatio ; 
      console.log('<=actualWidth', actualWidth);
      leftPositionCorrectionValue = (image.width - actualWidth) / 2;
      console.log('<=leftPositionCorrectionValue',leftPositionCorrectionValue)
    }
    // ::NOTE:: img要素の幅や高さが実際の表示画像の幅と高さと違うけれど、
    // この値はリサイズチェック（img要素の値も変化の確認だけ。値は他に利用していない。）のみなのでそのままとする。
    // もし実際の幅や高さを利用した場合は、リサイズチェックのときも、実際の幅高さを参照すべき。
    this.imgElemWidth = image.width;
    this.imgElemHeight = image.height;

    console.log('topPositionCorrectionValue:', topPositionCorrectionValue, 'leftPositionCorrectionValue:',leftPositionCorrectionValue);

    // 画像内のボタンをそれぞれ生成し追加
    screen.buttons.forEach((buttonData)=>{
      box.appendChild(this.createScreenButtons(buttonData, scaleRatio, topPositionCorrectionValue, leftPositionCorrectionValue ));
    }); 
  }
  /*
   画面遷移ボタンの生成
  ------------------------------------------------------ */
  createScreenButtons(buttonData, scaleRatio, topPositionCorrectionValue, leftPositionCorrectionValue){
    const button = document.createElement('div');
    button.className = 'screen-button';
    // button.setAttribute('data-destination', buttonData.destination);
    button.dataset.destination = buttonData.destination; // データセットで遷移先を指定
    button.dataset.name = buttonData.name; // データセットで役割（名前）を指定

    // 四角形（rectタグ）; 円（circleタグ）; 楕円（ellipseタグ）; 直線（lineタグ）; 折れ線（polylineタグ）; 多角形（polygonタグ）; パス（pathタグ）; 画像（imageタグ）; 文字列（textタグ）
    switch (buttonData.shape) {
      case 'rect':
        button.style.top = topPositionCorrectionValue + (buttonData.coords[1] * scaleRatio) + 'px';
        button.style.left = leftPositionCorrectionValue + (buttonData.coords[0] * scaleRatio) + 'px';// 補正
        button.style.width = (Math.abs(buttonData.coords[2] - buttonData.coords[0]) * scaleRatio) + 'px'; 
        button.style.height = (Math.abs(buttonData.coords[3] - buttonData.coords[1]) * scaleRatio) + 'px';
        button.style.borderRadius = (Math.abs(buttonData.coords[3] - buttonData.coords[1]) / 32)  + 'px'
        break;
      case 'circle':
        button.style.top = topPositionCorrectionValue + ((buttonData.coords[1] - buttonData.coords[2]) * scaleRatio) + 'px';
        button.style.left =　leftPositionCorrectionValue + ((buttonData.coords[0] - buttonData.coords[2]) * scaleRatio) + 'px';
        button.style.width = (buttonData.coords[2] * 2 * scaleRatio) + 'px';
        button.style.height = (buttonData.coords[2] * 2 * scaleRatio) + 'px';
        button.style.borderRadius = '50%';
        break;
      default:
        ;
    }
    return button;
  }
  /*  画像内ボタンの削除 
  ------------------------------------------------------ */
  removeScreenButtons(){
    const box = document.getElementById('operation-explanation-box');
    const buttons = document.getElementsByClassName('screen-button');
    /// 全てのbuttonをboxから削除
    for (let button of buttons) {
      box.removeChild(button);
    }
  }
  /* 画像内ボタンの再描画 
  ------------------------------------------------------ */
  buttonsReDraw(screen){
    this.removeScreenButtons();
    this.setScreenButton(screen);
  }
  /* 画像のリサイズチェック FIX: img要素が実際の表示画像の幅と違う件を修正しないといけない。
  ------------------------------------------------------ */
  checkScreenImageReSize() {
    const image = document.getElementById('screen-image');
    if (this.imgElemWidth === image.width && this.imgElemHeight === image.height) {
      return false;
    }
    this.imgElemWidth = image.width;
    this.imgElemHeight = image.height;
    return true;
  }
  /* 自身が受け持つ要素を非表示にする（モーダルウィンドウを閉じる）
  ------------------------------------------------------ */
  close(){
    this.deleteElements();
    this.element.classList.remove('show');
  }
}