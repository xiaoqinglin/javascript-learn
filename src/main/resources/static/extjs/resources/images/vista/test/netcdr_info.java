package com.newland.ia.accountquery.cdrquery.data;

import java.util.ArrayList;
import java.util.List;

import com.newland.base.util.MoneyUnitConvert;

public class netcdr_info {
	
	private List billitem_list;
//	private String netLog = "" ;
//
//	public String getNetLog() {
//		return netLog;
//	}
//
//	public void setNetLog(String netLog) {
//		this.netLog = netLog;
//	}

	public List getBillitem_list() {
		return billitem_list;
	}

	public void setBillitem_list(List billitem_list) {
		this.billitem_list = billitem_list;
	}
	
	public String convert2HTML(  String bill_start_date ) {
		int totalCol = 7;//固定展示的列长度
		StringBuffer sb = new StringBuffer();

		sb.append("<ul >");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>起始时间</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>通讯地点</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>上网方式</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>时长</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>流量</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:18%'>套餐优惠</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>通信费</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>基站编码</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>基站名称</li>");
		sb.append("<li class='DIV_LI_TITLE' style='width:9%'>位置区码</li>");
		sb.append("</ul>");
			  
		List dayList = new ArrayList();
		dayList = getDayList();
		String v = "0";
		String value = "";
		for (int i=0;i< dayList.size();i++){
			String day = (String)dayList.get(i);
			List days = getSameDay( day );
			sb.append("<ul>");
			sb.append("<li class='DIV_LI_TITLE_LEFT' style='width:99%'>"+ getDayFormat( day,bill_start_date ) +"</li>");
			sb.append("</ul>");
			for (int j=0;j< days.size();j++){
				String items[] = (String[])days.get(j);
//				if ( netLog != null && "1".equals(netLog)){
//					sb.append("<ul ondblclick='setChargingID(" +items[19]+ ");'>");
//				}else {
					sb.append("<ul>");
//				}
				for (int k=0;k<totalCol;k++){
					String width = "9" ;
					if ( k== 5 ){
						width = "18" ;//套餐优惠长度加长 
					}
					//System.out.println(" result is:"+ (k == totalCol-1)  );
					if ( k == totalCol-1 ){
						v = CdrUtil.getTotal( v ,items[k] );
						value = MoneyUnitConvert.LiToYuanStr(items[k]);
					}else {
						if(k == 3){
							value = CdrUtil.coverSecond(items[k]);
						}else if( k== 4){
							value = CdrUtil.bytes2k(items[k]) + "KB";
						}else {
							value = items[k];
						}
					}
					sb.append("<li class='DIV_TEXT' style='width:" + width+ "%'>"+ value +"</li>");
					if ( k == totalCol-1){
						sb.append("<li class='DIV_TEXT' style='width:" + width+ "%'>"+ items[16] +"</li>");
						sb.append("<li class='DIV_TEXT' style='width:" + width+ "%'>"+ items[17] +"</li>");
						sb.append("<li class='DIV_TEXT' style='width:" + width+ "%'>"+ items[18] +"</li>");
					}
				}
				sb.append("</ul>");
			}
		}
		sb.append("<ul >");
		sb.append("<li class='DIV_TEXT' style='width:9%'>合计：</li>");
		sb.append("<li class='DIV_TEXT_RIGHT' style='width:90%'> " + MoneyUnitConvert.LiToYuanStr(v) + "元</li>");
		sb.append("</ul>");
		
		sb.append("<ul >");
		sb.append("<li class='DIV_TEXT' style='width:9%'></li>");
		sb.append("<li class='DIV_TEXT_RIGHT' style='width:90%'>1MB=1024KB</li>");
		sb.append("</ul>");
		  
		return sb.toString();
	}
	
	
	public String getDayFormat( String day  ,String bill_start_date){
		String ret = "" ;
		String year = bill_start_date.substring(0,4) ;
		ret = year + "-" + day.substring(0,2) + "-" + day.substring(2,4);
		return ret ;	
	}
	
	public List getSameDay( String same_day ){
		List dayList = new ArrayList();
		for (int j=0;j< billitem_list.size();j++){
			String info = (String)billitem_list.get(j);
			String items[] = info.split(",");
			if ( items.length == 0 ) continue ; 
			String day = getDay( items[0] ) ;
			if ( same_day.equals( day) ) {
				dayList.add( items ) ;
			}
		}
		return dayList ;
	}
	
	public List getDayList( ){
		List dayList = new ArrayList();
		for (int i=0;i<billitem_list.size();i++){
			String info = (String)billitem_list.get(i);	//12-02 00:24:33
			String items[] = info.split(",");
			if ( items.length == 0 ) continue ;
			String day = getDay( items[0] ) ;
			if ( !"".equals(day) ) {
				if ( !dayList.contains( day )) {
					dayList.add(day);
	        	}
			}			
		}
		return dayList ;
	}
	
	public String getDay(String src_day ){
		String des_day = ""; 
		if ( src_day.length() < 5 ) return des_day ;
		des_day = src_day.substring(0,2) + "" + src_day.substring(3,5) ;
		return des_day ;
	}
	
}


for (int i=0;i< dayList.size();i++){
			String day = (String)dayList.get(i);
			List days = getSameDay( day );
			sb.append("<ul>");
			sb.append("<li class='DIV_LI_TITLE_LEFT' style='width:99%'>"+ getDayFormat( day,bill_start_date ) +"</li>");
			sb.append("</ul>");
			for (int j=0;j< days.size();j++){
