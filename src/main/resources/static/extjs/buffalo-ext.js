/**
 * ext 与 buffalo 结合,该js需要与inc.jsp结合起来用
 * @author yanfg
 * @version 1.0
 */
Buffalo.Ext = {};
Buffalo.Ext.DataProxy = function(buffalo,service,params) { 
    Buffalo.Ext.DataProxy.superclass.constructor.call(this);
    this.buffalo = buffalo;
    //服务名称 如：jsf:BaseOprAction.callService4Multi
    this.service =  service;
    //参数
    this.params = params;
    //总记录数
    this.totalRecords = 0;
    //首页第一条记录值为0
    this.cursor = 0;
    //每页条数
    this.pageSize = 100;    
} 
Ext.extend(Buffalo.Ext.DataProxy, Ext.data.DataProxy, {
	//rewrite superclass method
    load : function(params, reader, callback, scope, arg){    	
        var self = this;
        if (this.fireEvent("beforeload", this, params) != false) {
        	var length = params[3].length;
        	params[3][length-2] = this.cursor + 1;        	
        	params[3][length-1] = this.cursor + this.pageSize;
        	self.buffalo.remoteCall(self.service, params, function(reply) {
        		var ret = reply.getResult();
                if (ret.retResult != "0" && ret.retResult != "999999999") {
                	callback.call(scope || this, "", arg, true);
                	showMsg(ret.retMsg);
                    return; 
                }        
                /**
                alert(ret.totalrecords4ext);
                alert(ret.returnList.length);
                alert(ret.returnList[0].brand_id_name);
                return;
                for(pro in ret.returnList){
                	alert(pro + ":" + ret.returnList[pro]);
                }
                return;*/
                var result = reader.readRecords(ret);
                if(result.totalRecords == "100"){
                	//self.totalRecords =reader.meta.fields.length; //这里取的是列表的列数
                	self.totalRecords = result.records.length;
                }else{
                	self.totalRecords = result.totalRecords;
                }              
                self.fireEvent("load", this, null, arg);
                //alert(scope);
                //alert(callback);
                callback.call(scope, result, arg, true);
            }); 
        } else {
        	//ture or false 用来控制是否滚动图标 
            callback.call(scope || this, "", arg, true); 
        } 
    }
}); 
Ext.grid.BuffaloGridPanel = Ext.extend(Ext.grid.GridPanel,{
	pageSize: 100,   
    params:[],
    tableProperty:[],
    columnField:[],
    initComponent : function(){
      var fieldFlag = String.fromCharCode(2);
      var columnTitleNameList = this.tableProperty[0].split(fieldFlag);      
      var columnTitleHiddenList = this.tableProperty[1].split(fieldFlag);
      var columnTitleWidthList = this.tableProperty[2].split(fieldFlag);
      var columnFormatKeyList = [];//存放格式化字段的format_key
      var columnFormatValueList = [];//存放格式化字段的format_value      
      //alert("columnTitle" + columnTitleNameList.length + "TitleWidth:" + columnTitleWidthList.length);
      for(pro in this.tableProperty[4]){
      	columnFormatKeyList.push(pro);
      	columnFormatValueList.push(this.tableProperty[4][pro]);
      }
      columnFormatKeyList.shift();
      columnFormatValueList.shift();
      this.store = new Ext.data.Store({
		    proxy: new Buffalo.Ext.DataProxy(buffalo,'jsf:BaseOprAction.callService4Multi', this.params),
		    reader: new Ext.data.JsonReader({totalProperty: "totalrecords4ext",root: 'returnList', fields: this.columnField})
	  });
	  this.store.proxy.pageSize = this.pageSize;
	  if(this.params.length != 0){
	  	this.store.proxy.params[2].push("min_row");
	  	this.store.proxy.params[2].push("max_row");
	  	this.store.proxy.params[3].push("1");
	  	this.store.proxy.params[3].push("100");
	  }	  
	  var columns = [];
	  var checkboxFlag = this.tableProperty[3];
      if(checkboxFlag == "Y"){
      	var sm = new Ext.grid.CheckboxSelectionModel();
      	columns.push(sm);
      	this.sm = sm;
      }
      for(var i = 0; i < columnTitleNameList.length; i++){
      		var column_obj = { header: columnTitleNameList[i], dataIndex: this.columnField[i]
      							,width: parseInt(columnTitleWidthList[i]), sortable: true };
      		if(columnTitleNameList[i] == ""){//处理最后一列的按钮渲染
      			column_obj.renderer = this.tableProperty[this.tableProperty.length-1];
      		}else{
      			//处理隐藏字段
	      		var hiddenFlag = false;
	      		for(var j = 0; j < columnTitleHiddenList.length; j++){
	      			if(i == parseInt(columnTitleHiddenList[j])){
	      				hiddenFlag = true;
	      				break;
	      			}
	      		}
	      		column_obj.hidden = hiddenFlag;
	      		//处理格式化字段
	      		for(var m = 0; m < columnFormatKeyList.length; m++){
	      			if(i == parseInt(columnFormatKeyList[m])){
	      				switch(columnFormatValueList[m]){
	      					case "date" : {
	      						column_obj.renderer = function(value){
	      							return BFC.util.Time.digitalToOcx(value);
	      						};
	      						break;
	      					}
	      					case "day" : {
	      						column_obj.renderer = function(value){
	      							return BFC.util.Time.getDateOnlyFormated(BFC.util.Time.digitalToOcx(value));
	      						};
	      						break;
	      					}
	      					case "money" : {
	      						column_obj.renderer = function(value){
	      							return BFC.biz.MoneyConverter.LiToYuan(value);
	      						};
	      						break;
	      					}
	      					case "boolean" : {
	      						column_obj.renderer = function(value){
	      							return value == 1 ? "是" : "否";
	      						};
	      						break;	      						
	      					}
	      				}
	      				break;
	      			}
	      		}
      		}      		
            columns.push(column_obj);
      };	
      this.cm = new Ext.grid.ColumnModel(columns);
      this.bodyStyle = 'width:100%';
      /*
      this.tbar = [{
    	    text:"导出Excel", 
    	    icon : "/BossWeb/images/shortbutton1.gif", 
    	    handler : ExcelExport 
    	   }];
      */
      this.bbar = new Ext.BuffaloPagingToolbar({
        pageSize: this.pageSize,
    	store: this.store,
    	displayInfo: true,
    	displayMsg: "显示第{0}到第{1}条记录，一共{2}条",
    	emptyMsg: "没有满足条件的记录"    	
      });
      this.stripeRows = true;        
      Ext.grid.BuffaloGridPanel.superclass.initComponent.call(this); 
      this.oPopup =window.createPopup();
      this.on('render',function(){
          var view = this.getView();
    	  var table = this;
          view.mainBody.on('mouseover',function(e,t){
                       if(t==null) return;
                       var msg=t.innerText;
                       if(t.children.length==0)
    	                   //table.showMore(e.getPoint().left, e.getPoint().top+10,t.innerText);
                    	   table.showMore(window.event.clientX, window.event.clientY+10,t.innerText);
                       });
    	  
      });
    },
    
	loadData:function(params,callback){
		this.store.load(params,callback);
	},
	reloadData:function(params){
		this.store.reload(params);
	},
	showMore:function(left,top,msg){   //显示详细信息
		 if(this.oPopup.isOpen) this.hideMore();      
		   msg.replace(/\t\n\r\v\f/gi," ");
		   if(msg=="" || msg==" " ) return false;
		   var height=40;
		 var width=0;
		 var len=msg.replace(/[^\x00-\xff]/g,'**').length;
		 if(len>=40){
		   width=400;
		   var index=parseInt(len/40)==0?1:parseInt(len/40);
		   height=10*index+23<40?40:10*index+23;
		 }else{
		   width=len*10<=40?50:len*10;
		 }  
		   var oPopBody = this.oPopup.document.body;
		   oPopBody.style.font = "normal 8pt Verdana";
		   var str ="";
		   str +="<div style='padding-left:0px;margin-left:0px;background-color:#FDFEF0;width:100%;height:100%;color: #3A3A3A;size:9px;overflowX:auto;overflowY:auto;font-size: 12px;'><ul style='padding-left:0px;margin-left:0px;'>" +
		    		"<li style='padding-left:10px;padding-top:5px;padding-right:5px;list-style: none'><a href='#' style='color:black' onclick='window.clipboardData.setData(\"Text\",\""+msg+"\");return false;'>"+msg+"</a></li></ul></div>";
		   oPopBody.innerHTML = str;
		   oPopBody.style.border = "1px solid #778FB7";
		   var table=this;
		   this.oPopup.show(left, top, width, height, document.body);
		   
		   function doCopy(){
		     var copyMsg=msg; copyMsg.replace(/\s/gi," ");clipboardData.setData('Text',copyMsg);     
		   }
		},
		hideMore:function(){//隐藏详细信息
		    this.oPopup.hide();
		}
});
Ext.BuffaloPagingToolbar = Ext.extend(Ext.PagingToolbar,{	
	// rewrite superclass method
    onLoad : function(store, r, o){
       if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
       }
       this.cursor = o.params ? store.proxy.cursor : 0;
       var d = this.getPageData(), ap = d.activePage, ps = d.pages;
       this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
       this.field.dom.value = ap;
       this.first.setDisabled(ap == 1);
       this.prev.setDisabled(ap == 1);
       this.next.setDisabled(ap == ps);
       this.last.setDisabled(ap == ps);       
       this.loading.enable();
	   //alert(this.store.getCount());
       //this.loading.setDisabled(this.store.getCount() != 0 ? true : false);       
       this.updateInfo();
    },
    // rewrite superclass method
	doLoad : function(start){
		this.store.proxy.cursor = start;
	    this.store.load({params: this.store.proxy.params});        
    },
    // rewrite superclass method
    getPageData : function(){
    	var total;
    	//适用于后台不返回总记录数，而取默认总记录数100的情况，适用于首页的情况
    	if(this.store.proxy.totalRecords == 100 && this.pageSize != this.store.getCount()
    		&& this.field.dom.value == 1){
    		//alert("enter");
    		//alert("totalLength:" + this.store.totalLength);
    		total = this.store.getCount();
    		this.store.totalLength = this.store.getCount();
    	}else{    		
    		//alert("totalenter");
    		//alert("totalRecords:" +this.store.proxy.totalRecords); 实际条数
    		//alert("this.store.getTotalCount():" + this.store.getTotalCount()) 100条
    		total = (this.store.proxy.totalRecords == 0) ? this.store.getTotalCount() : this.store.proxy.totalRecords;
    		this.store.totalLength = total;
    	}
    	//alert("store" + this.store.getCount());    	
    	//alert("total" + total);
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },
    onClick : function(which){
        var store = this.store;
        switch(which){
            case "first":
                this.doLoad(0);
            break;
            case "prev":
                this.doLoad(Math.max(0, this.cursor-this.pageSize));
            break;
            case "next":
                this.doLoad(this.cursor+this.pageSize);
            break;
            case "last":
                var total = store.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                this.doLoad(lastStart);
            break;
            case "refresh":
                //this.doLoad(this.cursor);
            break;
        }
    }
});
function initiateGrid(pageSize, params, tableProperty, columnField, height){
	return new Ext.grid.BuffaloGridPanel({
    	pageSize: pageSize,
    	params: params,    	
    	tableProperty: tableProperty,
    	columnField: columnField,   	
    	height: height
    });
}

function ExcelExportGrid(grid) {
	  var vExportContent = grid.getExcelXml(); // 获取数据 
	  if (Ext.isIE8 ||Ext.isIE6 || Ext.isIE7 || Ext.isSafari || Ext.isSafari2 
	    || Ext.isSafari3) { // 判断浏览器 
	   var fd = Ext.get('frmDummy'); 
	   if (!fd) { 
	    fd = Ext.DomHelper.append(Ext.getBody(), { 
	       tag : 'form', 
	       method : 'post', 
	       id : 'frmDummy', 
	       action : '/BossWeb/bosspubpage/ExportExcel.jsp', 
	       target : '_blank', 
	       name : 'frmDummy', 
	       cls : 'x-hidden', 
	       cn : [{ 
	          tag : 'input', 
	          name : 'exportContent', 
	          id : 'exportContent', 
	          type : 'hidden' 
	         }] 
	      }, true); 
	   } 
	   fd.child('#exportContent').set({ 
	      value : vExportContent 
	     }); 
	   fd.dom.submit(); 
	  } else { 
	   document.location = 'data:application/vnd.ms-excel;base64,' 
	     + Base64.encode(vExportContent); 
	  } 

	} 

