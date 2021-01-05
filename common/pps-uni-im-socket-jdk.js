
 class SocketIm{

    constructor() {
      console.log("WebSocket sdk加载完成------ ");
    }
	
	initWsUrl(wsUrl){
		
		if(window.WebSocket) {
		    console.log("当前环境支持WebSocket协议！ ");
		    this.ws = null;
		    this.wxUrl=wsUrl;
		    this.eventListener={};
			this.msgType={
			    text:'1',
			    audio:'2',
			    video:'3',
			    image:'4',
			    serverError:'5',
			    binary:'6'
			
			}
			this.msgAction={
			    sendToSingle:1,
			    sendToAll:2
			}
		} else {
		    console.error("不支持webScoket协议！");
		}
		
	}


    /**
     * 发送文本对象到服务器
     * @param content 发送内容
     * @param to 发送目标
     * @param action 动作
     */
    sendMsgForText(content,to,msgType,action){

        if(this.ws.readyState == WebSocket.OPEN){

            if(content==null||msgType==null){
                console.log("无法发送空内容或者未指定类型的内容")
                return;
            }
            if(action==null){
                action=this.msgAction.sendToSingle;
            }
            let info={
                action:action,
                to:to,
                msgType:msgType,
                data:content
            }
            let infoJson=  JSON.stringify(info);
            this.ws.send(infoJson);

        }else{
            console.log("连接没有开启");
        }

    }

    /**
     * 发送二进制到服务器
     * @param to 目标
     * @param fileInfo
     * @param file
     */
    sendMsgForBinnary(to,fileInfo,file){

        if(this.ws.readyState == WebSocket.OPEN){
            fileInfo.to=to;
            this.genareteBlob(fileInfo,file,(binData)=>{
               this.ws.send(binData);
            })
        }else{
            console.log("连接没有开启");
        }
    }

    /*
    注册到达字节数组事件(文件字节流)
    */
    fireBinEvent(callback){
        this.fireEvent(this.msgType.binary,callback)
    }
    /*
     注册到达文本事件
     */
    fireTextEvent(callback){
        this.fireEvent(this.msgType.text,callback)
    }
    /*
     注册到达音频事件
     */
    fireAudioEvent(callback){
        this.fireEvent(this.msgType.audio,callback)
    }
    /*
     注册到达视频事件
     */
    fireVideoEvent(callback){
        this.fireEvent(this.msgType.video,callback)
    }
    /*
     注册到达图象事件
     */
    fireImageEvent(callback){
        this.fireEvent(this.msgType.image,callback)
    }
    /*
    注册服务器提醒事件
    */
    fireServerErrorEvent(callback){
        this.fireEvent(this.msgType.serverError,callback)
    }
    /*
    注册socket关闭事件
    */
    fireCloseEvent(callback){
        this.fireEvent('close',callback)
    }
    /*
    注册socket开启事件
   */
    fireOpenEvent(callback){
        this.fireEvent('open',callback)
    }
    /*
    注册socket发生错误事件
    */
    fireErrorEvent(callback){
        this.fireEvent('error',callback)
    }
    /**
     * 注册自定义事件
     */
    fireEvent(event,callback){
        this.eventListener[event]=callback;
    }


    /**
     * 携带参数请求服务器接口 接口给出响应 然后根据响应 在连接服务器的socket
     * @param user
     * @param callback 应该能根据服务器的响应  构造一个凭证字符串 传给服务器 比如 t.token=xxxxxxxxxx
     */
    login(url,user,callback){
        if(this.ws!=null&&this.ws.readyState==1){
            this.ws.close();
        }
        this.httRequestForGet(url,user,(res)=>{
            let certificate ={};
            callback(res,certificate)
            let twx=this.wxUrl+this.convertObjParamToString(certificate) ;
            console.log(twx)
            this.ws = new WebSocket(twx);
            this.initListener(this.ws);
        })
    }
	/**
	 *  携带token连接服务器socket
	 */
	loginWithToken(token){
	    if(this.ws!=null&&this.ws.readyState==1){
	        this.ws.close();
	    }
	    
	  let certificate ={};
	  certificate.token=token;
	  let twx=this.wxUrl+this.convertObjParamToString(certificate) ;
	  console.log(twx)
	  this.ws = new WebSocket(twx);
	  this.initListener(this.ws);
	  
	}
	/**
	 * 不要要任何凭证的连接服务器的socket
	 */
	loginDirect(){
	    if(this.ws!=null&&this.ws.readyState==1){
	        this.ws.close();
	    }
	  let twx=this.wxUrl;
	  this.ws = new WebSocket(twx);
	  this.initListener(this.ws);
	}
    loginOut(){
        this.ws.close();
    }
    convertObjParamToString(param) {
        let paramStr="";
        Object.keys(param).forEach((k,i)=>{
            if(i==0){
                paramStr=paramStr+"?"+k+"="+param[k];
            }else {
                paramStr=paramStr+"&"+k+"="+param[k];
            }
        });
        return paramStr;
    }
    httRequestForGet(url,param,callback) {
        let paramStr=this.convertObjParamToString(param);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url+paramStr, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                let response= JSON.parse(xhr.responseText);
                callback(response);
            }
        }
        xhr.send()
    }
    
    /**
     * 根据入参 和文件 构建字节流
     * @param param 文件附加信息
     * @param file  文件对象
     * @param callback 构建结束的回调函数
     */
     genareteBlob(param,file,callback) {
         if(param==null){
             param={};
         }
        let info=JSON.stringify(param);
        let enc = new TextEncoder(); // always utf-8
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        //构建文件信息字节
        let byteForInfo=  enc.encode(info);
        let arrayBuffer = new ArrayBuffer(4)
        let dataView = new DataView(arrayBuffer);
        dataView.setInt32(0,byteForInfo.length)
        fileReader.onload = function (e) {
            // 获取到文件对象
            var result = e.target.result;
            var blob = new Blob([dataView,byteForInfo, result]);
            callback(blob)
        }
    }
    
    initListener(socket){

        socket.onmessage = (event)=> {

            let data=event.data;
            //文本文件
            if (typeof  data === "string") {

                let obj= JSON.parse(data);
                let callback=this.eventListener[obj.msgType.toString()];
                if(callback!=null){
                    callback(obj);
                }

                //二进制文件
            } else {
                let callback=this.eventListener[msgType.binary];
                if(callback==null){
                    return;
                }
                let result = data;
                let flagReader = new FileReader();
                flagReader.readAsArrayBuffer(result.slice(0, 4));
                flagReader.onload = function (flag) {
                    //读取文件附加信息大小
                  let fileInfoSize=new DataView(flag.target.result).getInt32(0);
                  //读取文件附加信息
                  let fileInfoReader = new FileReader();
                  fileInfoReader.readAsArrayBuffer(result.slice(4,4+fileInfoSize))
                  fileInfoReader.onload= (fileInfo) =>{
                      let decoder = new TextDecoder();
                      let info= decoder.decode(fileInfo.target.result);
                      let fileByte=result.slice(4+fileInfoSize);
                      callback(info,fileByte);
                 }
                }
            }


        }

        //连接建立的回调函数
        socket.onopen = (event)=>{
            console.log("webSocket 登陆成功！")
            let ec=   this.eventListener.open;
            if(ec!=null){
                ec(event);
            }
        }
        //连接断掉的回调函数
        socket.onclose = (event)=> {
            let ec=   this.eventListener.close;
            if(ec!=null){
                ec(event);
            }
        }
        socket.onerror =(event)=> {
            let ec=   this.eventListener.error;
            if(ec!=null){
                ec(event);
            }
        };

    }




}
var Im=new SocketIm()
export default Im;