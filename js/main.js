/*      TODO : purchaseTypesはCotrollerのみで保持a
============================================================================ */
/* 定数
---------------------------------------------------------------------------- */
const sessionStorageKey = 'downdoadJson';
const downloadFileURL = 'JSON.json'
/* ページロード後にDOM解析終了時の処理
---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  /* 
  ---------------------------------------------------------------------------- */
  // DataRetainのインスタンスを生成（データのダウンロード）
  const dataRetain = new DataRetain();
  dataRetain.download(sessionStorageKey, downloadFileURL, (downloadData) => {
    // Controller生成（画面管理データを引き渡す）
    const controller = new Controller(downloadData.purchaseTypes);
    console.log(controller, downloadData.purchaseTypes);
    // Viewを表示
    controller.view();
    // dataRetain.saveSessionStrageData(undefined, downloadData);
  });

  // dataRetain.loadSessionStrageData();
  // console.log(dataRetain.purchaseTypes);
}, false);
/*
  画面管理データ DataRetain =>
  JSONデータをダウンロードして保持する。
---------------------------------------------------------------------------- */
class DataRetain {
  constructor(key = 'defaultKeyName', url = '') {
    this.key = key;
    this.url = url;
    /* 各購入画面毎の画面制御データを格納する配列 */
    this.purchaseTypes = '';
  }
  /* 指定したURLからJSONデータをダウンロードし、
  指定したキー名でsessionStrageでシリアライズし保存する
  ------------------------------------------------------ */
  download(key = this.key, url = this.url, callBack) {
    this.key = key;
    this.url = url;
    (async () => {
      const response = await fetch(url);
      const jsondata = await response.json();
      await callBack(jsondata); // 上の処理を待って、コールバック
      // await callBack(this.purchaseTypes);
      // シリアライズ
      // await this.saveSessionStrageDatakey, JSON.stringify(jsondata));
      // デシリアライズ
      // await this.loadSessionStrageData(key);
    })();
  }
  /* sessionStrageへJSONデータを保存 （FIX: 削除する 結局使わなかった処理）
  ------------------------------------------------------ */
  saveSessionStrageData(key = this.key, jsondata) {;
      sessionStorage.setItem(key, JSON.stringify(jsondata));
      console.log('sessionStorage - save:', sessionStorage, new Date())
  }
  /* sessionStrageからシリアライズしたJSONデータを取り出す
   取り出したデータは配列で保持する（FIX: 削除する 結局使わなかった処理）
  ------------------------------------------------------ */
  loadSessionStrageData(key = this.key) {
    this.purchaseTypes = JSON.parse(sessionStorage.getItem(key));
    console.log('sessionStorage - load:', this.purchaseTypes, new Date());

    if (this.purchaseType == null) {
      console.log('sessionStgDataがありません.', new Date());
    }
    return this.purchaseTypes;
  }
}
/* Controller クラス
ViewControllerへの指示の、状態保持を担当
---------------------------------------------------------------------------- */
class Controller {
  constructor(downloadData) {
    // 購入方法別の画面管理データを配列として格納
    this.purchaseTypes = downloadData;
    // ハッシュ値を表示するTitleIDとして格納
    this.currentTitleID = window.location.hash.slice(1);
    // 最初のスクリーンを表示
    this.currentScreenID = 'screen01';
    // 購入方法選択の表示部の生成と表示データの引き渡し
    this.selectAPurchaseMethodViewCnt = 
        new SelectAPurchaseMethodViewCnt( 'select-a-purchase-method',
                                          this.purchaseTypes );
    // 操作説明の表示部の宣言
    this.operationExplanationViewCnt = '';
  }
  /*
  ------------------------------------------------------ */
  view() {
    // select-a-purchase-method内のa要素全てのポインターイベントの対象にする。
    this.selectAPurchaseMethodViewCnt.view() && this.selectAPurchaseMethodViewCnt.ankerEvensAuto();
    // URLにハッシュ値がある場合、そのハッシュに該当する操作説明を表示する
    if (this.currentTitleID) {
      // 操作説明の画面を表示
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
  displayOperationExplanationView() {
    // 操作説明の表示部の生成と表示データの引き渡し
    this.operationExplanationViewCnt =
        new OperationExplanationViewCnt('operation-explanation',
                                        this.extractTheDisplayDataMatchesTitleID());
    // 操作説明画面の表示                             
    this.operationExplanationViewCnt.view(this.currentScreenID);
    this.selectAPurchaseMethodViewCnt.ankerEventsNone();
    // 操作説明画面での各イベント処理の定義
    this.defineTheEvensThatOperationExplanation();
  }
  /* 作説明画面用の表示データを取り出す
  ------------------------------------------------------ */
  extractTheDisplayDataMatchesTitleID(titleID = this.currentTitleID) {
    let result = '';
    this.purchaseTypes.forEach((purchaseType)=>{
      if(purchaseType.titleID == titleID) {
        result = purchaseType;
      }
    });
    return result;
  } 
  /* 操作説明画面での各イベント処理の定義
  ------------------------------------------------------ */
  defineTheEvensThatOperationExplanation() {

    /* 操作説明領域（モーダル表示）以外または、クローズボタンをクリックした時の処理を定義
    -------------------------------- */
    document.body.addEventListener('click', (event)=>{
      if (!event.target.closest('#operation-explanation')) {
        console.log('操作説明領域（モーダル表示）以外をクリックしました！!!!');
        this.closeOperationExplanationView();
      }
    // });
    },{'once':'ture'}); // 操作説明画面を閉じた後はこのイベント処理は必要ない為{'once':'ture'}

    /* 操作説明の表示画像内のボタンを押下した時の処理を定義
    -------------------------------- */
    this.operationExplanationViewCnt.element.addEventListener('click', (event)=>{
      if (event.target.closest('#close')) {
        console.log('クローズボタンをクリックしました！!!!');
        this.closeOperationExplanationView();
      }
      if (event.target.closest('.screen-button')) {
        console.log(event.target.closest('.screen-button').getAttribute('data-destination'));
        console.log('画面ボタンが押下されました。');
        //////// TODO ///////////////////////////////////////////
        this.operationExplanationViewCnt.screenRedraw(
          event.target.closest('.screen-button').getAttribute('data-destination'));
        ////////////////////////////////////////////
      }
    });

    /* Window表示サイズが変化した時の処理
    -------------------------------- */
    window.addEventListener('resize', ()=> {
      ////////////////////////////////////////////
      ///// TODO: console.log('width:', window.innerWidth, 'x height', window.innerHeight);
      //// TODO: OperationExplanationのbuttonsを再描画[[ OperationExplanation.buttonsRedraw() ]]
        this.operationExplanationViewCnt.screenRedraw(this.currentScreenID);
        ////////////////////////////////////////////
      console.log('windowサイズ: ',window.innerWidth, window.innerHeight);
      const img = document.getElementById('screen-image');
      console.log('imgサイズ: ',img.width,img.height);
    });
  }
  /* 操作説明画面を閉じる 
  ------------------------------------------------------ */
  closeOperationExplanationView() {
    this.currentTitleID = '';
    window.location.hash = '';
    this.operationExplanationViewCnt.close();
    this.selectAPurchaseMethodViewCnt.ankerEvensAuto();
  }
}
/*
 DOM表示制御クラス。 ViewController
---------------------------------------------------------------------------- */
class ViewController {
  /* constructor +
  ------------------------------------------------------ */
  constructor(idName, dataToDisplays) {
    this.idName = idName;
    // このインスタンスの管理対象となる要素
    this.element = document.getElementById(idName);
    // このインスタンスが表示するべきデータを保持する
    this.dataToDisplays = dataToDisplays;
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
/*
 購入方法選択画面の表示制御クラス。
---------------------------------------------------------------------------- */
class SelectAPurchaseMethodViewCnt extends ViewController {
  constructor(idName, dataToDisplays) {
    super(idName, dataToDisplays);
    console.log(this.constructor.name,'が生成されました。');
    console.log(`受け取ったデータは${this.dataToDisplays}です。`);
  }
  /* .select-a-purchase-methodを表示（購入別ボタンを生成し表示する） */
  view(){
    console.log(`${this.constructor.name}が${this.idName}を表示します。`);

    const fragment = document.createDocumentFragment();

    this.dataToDisplays.forEach((purchaseType) => {

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
/*
 操作説明画面の表示制御クラス。
---------------------------------------------------------------------------- */
class OperationExplanationViewCnt extends ViewController {
  constructor(idName, dataToDisplays) {
    super(idName, dataToDisplays);
    this.boxImgWidth = 0;
    this.boxImgHeight = 0;
    this.boxImgNaturalWidth = 0;
    this.boxImgNaturalHeight = 0;
  }
  /* 表示画像の表示サイズのGetter
  ------------------------------------------------------ */
  get rectSize() {
    return {width : this.boxImgWidth, height : this.boxImgHeight}
  }
  /* 表示画像の表示サイズのSetter
  ------------------------------------------------------ */
  set rectSize(dict) {
    this.boxImgWidth = dict.width;
    this.boxImgHeight = dict.height;
    console.log('screen表示画像サイズ:', this.boxImgWidth, this.boxImgHeight, '元画像サイズ', this.boxImgNaturalWidth, this.boxImgNaturalHeight);
    // TOOD:Buttonのリサイズ
  }
  review(dataToDisplays) {
    console.log(dataToDisplays);
    this.dataToDisplays = dataToDisplays;
    this.view();
  }
  /* 自身が受け持つ要素(#operation-explanation)を表示する
  ------------------------------------------------------ */
  view(screenID){
    //this.deleteElements();
    console.log(screenID);
    this.setElement(this.createOperationExplanationHedding());  
    const currentScreen = this.extractDisplaydataMatchesScreenID(screenID)
    this.setElement(this.createPerationExplanationDescription(currentScreen));
    this.setElement(this.createOperationExplanationBox(currentScreen));
    this.setElement(this.createSupplementaryExplanation(currentScreen));
    this.setElement(this.createCloseButton());

    // モーダルウィンドウとして表示する
    this.element.classList.add('show');
    document.body.classList.add('bg');
    // スクリーンボタンを表示する。
    console.log(currentScreen);
    this.setScreenButton(currentScreen);
  }
  ////////////////////////// TODO //////////////////////////////
  screenRedraw(screenID) {
    console.log(screenID, 'に表示しなおします。！！！！！！！')

  }

  buttonsRedraw(){

  }
  //////////////////////////////////////////////////////////////
  /* operation-explanation-hedding の生成
  ------------------------------------------------------ */
  createOperationExplanationHedding() {
    const opeExpHedding = document.createElement('div');
    opeExpHedding.id = 'operation-explanation-hedding';

    const h2 = document.createElement('h2');
    h2.textContent = this.dataToDisplays.title;
    opeExpHedding.appendChild(h2);
    const hp = document.createElement('p');
    hp.textContent = this.dataToDisplays.description;
    opeExpHedding.appendChild(hp);

    return opeExpHedding;
  }
  /*  screenID にマッチした表示データを取り出す
  ------------------------------------------------------ */
  extractDisplaydataMatchesScreenID(screenID) {
    let result = '';
    this.dataToDisplays.screens.forEach((screen)=>{
      if (screen.screenID == screenID ) {
        result = screen;
      }
    });
    return result;
  }
  /* operation-explanation-description の生成
  ------------------------------------------------------ */
  createPerationExplanationDescription(currentScreen){
    const opeExpDescription = document.createElement('div');
    opeExpDescription.id = 'operation-explanation-description';
    const h3 = document.createElement('h3');
    h3.textContent = currentScreen.caption;
    opeExpDescription.appendChild(h3);
    const dp = document.createElement('p');
    dp.textContent = currentScreen.description;
    opeExpDescription.appendChild(dp);

    return opeExpDescription;
  }
  /* peration-explanation-box の生成
  ------------------------------------------------------ */
  createOperationExplanationBox(currentScreen) {
    const box = document.createElement('div');
    box.id = 'operation-explanation-box';
    
    const img = document.createElement('img');
    img.id = 'screen-image'
    img.src = currentScreen.imageUrl;   // このタイミングで画像がダウンロードされる
    this.boxImgNaturalWidth = img.naturalWidth;   // ダウンロード画像の原寸横幅
    this.boxImgNaturalHeight = img.naturalHeight; // ダウンロード画像の原寸縦幅
    console.log(this.boxImgNaturalWidth, this.boxImgNaturalHeight);
    box.appendChild(img); 

    return box;
  }
  /* 画面遷移ボタン の生成
  ------------------------------------------------------ */
  setScreenButton(currentScreen){
    console.log(currentScreen);
    const box = document.getElementById('operation-explanation-box');
    const image = document.getElementById('screen-image');
    // FIX: 初回ロード時に反映されない。
    // TODO: SHARP値で計算方法を変える
    // buttonをホバーすると、window.clickイベントが消える？？？？
    currentScreen.buttons.forEach((buttonData)=>{
      const button = document.createElement('div');
      button.className = 'screen-button';
      button.setAttribute('data-destination', buttonData.destination)
      const widthRatio = image.width / this.boxImgNaturalWidth;
      const heightRatio = image.height / this.boxImgNaturalHeight;
      button.style.top = (buttonData.coords[1] * heightRatio) + 'px';
      button.style.left = (buttonData.coords[0] * widthRatio) + 'px';
      button.style.width = (Math.abs(buttonData.coords[2] - buttonData.coords[0]) * widthRatio) + 'px';
      button.style.height = (Math.abs(buttonData.coords[3] - buttonData.coords[1]) * heightRatio) + 'px';
      console.log('screenbuttonのサイズ', button.style.width, button.style.height);
      box.appendChild(button);
    }); 
  }
  /* supplementary explanation の生成
  ------------------------------------------------------ */
  createSupplementaryExplanation(currentScreen) {
    const exp = document.createElement('p');
    exp.textContent = currentScreen.supplementaryExplanation;

    return exp;
  }
  /* 操作説明の表示を閉じるボタンの要素の生成
  ------------------------------------------------------ */
  createCloseButton() {
    const closeBtn = document.createElement('div');
    closeBtn.id = 'close';
    closeBtn.textContent = '✖️';
    closeBtn.classList.add('show');
    return closeBtn;
  }
  /* 自身が受け持つ要素を非表示にする（モーダルウィンドウを閉じる）
  ------------------------------------------------------ */
  close(){
    this.element.classList.remove('show');
    document.body.classList.remove('bg');
    this.deleteElements();
  }
}