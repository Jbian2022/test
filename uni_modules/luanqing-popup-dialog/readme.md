# luanqing-popup-dialog

##### 基本属性
名称|说明|默认值|是否必须
--|--|--|--
isShow|显隐气泡弹框菜单|false|是
list|菜单数据,{name:'...',icon:'...'},name属性必须|[]|是
top|顶部位置|0|非
right|右边位置|0|非
triangleMarginRight|三角箭头距离右边的距离|24|非
bgColor|气泡弹框的背景色|'#4B4B4B'|非
textColor|气泡弹窗的文字颜色|'#ffffff'|非
lineColor|气泡弹框的横线颜色|'#6C6C6C'|非
@onClickPopMenu|气泡弹框的点击item事件|无|非


##### 基本用法
```
	<luanqing-popup-dialog 
		:isShow="showMenuPop" 
		:top="150" 
		:right="0" 
		:list="popList" 
		@onClickPopupItem="onClickPopMenu">
	</luanqing-popup-dialog>

```