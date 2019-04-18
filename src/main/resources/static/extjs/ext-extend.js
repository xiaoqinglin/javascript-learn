Ext.grid.JsonGridPanel = Ext.extend(Ext.grid.GridPanel,{
    tableProperty:[],
    columnField:[],
    sortField:[],
    pageSize:1000,
    initComponent : function(){
        var fieldFlag = String.fromCharCode(2);
        var columnTitleNameList = this.tableProperty[0].split(fieldFlag);      
        var columnTitleHiddenList = this.tableProperty[1].split(fieldFlag);
        var columnTitleWidthList = this.tableProperty[2].split(fieldFlag);
        var columnFormatKeyList = [];//��Ÿ�ʽ���ֶε�format_key
        var columnFormatValueList = [];//��Ÿ�ʽ���ֶε�format_value      
        for(pro in this.tableProperty[4]){
            columnFormatKeyList.push(pro);
            columnFormatValueList.push(this.tableProperty[4][pro]);
        }
        columnFormatKeyList.shift();
        columnFormatValueList.shift();
        
        var recordArr =[];
        for(var i = 0; i < columnTitleNameList.length; i++){
            recordArr.push({name:this.columnField[i]});
        }
        var recordFormat = Ext.data.Record.create(recordArr);
        this.store = new Ext.data.Store({
            data: [],
            pageSize:this.pageSize,
            loadInit : function(dataArr){
                this.proxy = new Ext.data.PagingMemoryProxy(dataArr);
                this.load({params:{start:0, limit:this.pageSize}});
            },
            reader: new Ext.data.JsonReader({},recordFormat)
        });

        var columns = [];
        var checkboxFlag = this.tableProperty[3];
        if(checkboxFlag == "Y"){
            var sm = new Ext.grid.CheckboxSelectionModel();
            sm.handleMouseDown = Ext.emptyFn;
            columns.push(sm);
            this.sm = sm;
        }
        for(var i = 0; i < columnTitleNameList.length; i++){
            var sortFlag =true;
            if(this.sortField.length>0){
                sortFlag = this.sortField[i]=="0"?false:true;
            }
            var column_obj = { header: columnTitleNameList[i], dataIndex: this.columnField[i]
                 ,width: parseInt(columnTitleWidthList[i]), sortable:sortFlag};
            if(columnTitleNameList[i] == ""){//�������һ�еİ�ť��Ⱦ
                 column_obj.renderer = this.tableProperty[this.tableProperty.length-1];
            }else{
                //���������ֶ�
                var hiddenFlag = false;
                for(var j = 0; j < columnTitleHiddenList.length; j++){
                    if(i == parseInt(columnTitleHiddenList[j])){
                        hiddenFlag = true;
                        break;
                    }
                }
                column_obj.hidden = hiddenFlag;
                //�����ʽ���ֶ�
                for(var m = 0; m < columnFormatKeyList.length; m++){
                    if(i == parseInt(columnFormatKeyList[m])){
                        switch(columnFormatValueList[m]){
                            case "date" : {
                                column_obj.renderer = function(value){
                                    if(value!=null&&value!=undefined&&value!=""){
                                        return BFC.util.Time.digitalToOcx(value);
                                    }else{
                                        return "";
                                    }
                                };
                                break;
                            }
                            case "day" : {
                                column_obj.renderer = function(value){
                                    if(value!=null&&value!=undefined&&value!=""){
                                        return BFC.util.Time.digitalToOcxDay(value);
                                    }else{
                                        return "";
                                    }
                                };
                                break;
                            }
                            case "time" : {
                                column_obj.renderer = function(value){
                                    if(value!=null&&value!=undefined&&value!=""){
                                        return value.substring(0,10)+"<br>"+value.substring(11,value.length);
                                    }else{
                                        return "";
                                    }
                                };
                                break;
                            }
                            case "money" : {
                                column_obj.renderer = function(value){
                                    return BFC.biz.MoneyConverter.LiToYuan(value);
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
        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            pageSize: this.pageSize,
            displayInfo: true,
            displayMsg: "��ʾ��{0}����{1}����¼��һ��{2}��",
            emptyMsg: "û�����������ļ�¼"
        });
        Ext.grid.JsonGridPanel.superclass.initComponent.call(this); 
    }
});