/**
 * Основное окно примеров кода и документации
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  codex
 */


/**
 * Процедура устанавливает параметры работы программы, специфичные для текущей сборки
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 * @param modifiers {Array} - сюда можно добавить обработчики, переопределяющие функциональность объектов данных
 */
$p.settings = function (prm, modifiers) {
	prm.offline = true;             // автономная работа. запросы к 1С запрещены
	prm.allow_post_message = "*";   // разрешаем обрабатывать сообщения от других окон (обязательно для файлового режима)
};


/**
 * Обработчик события при начале работы программы
 */
$p.iface.oninit = function() {

	$p.eve.redirect = true;

	var layout = new dhtmlXLayoutObject({
		parent: document.body,
		pattern: "3L",
		cells: [
			{
				id:     "a",
				header: false,
				width:  300
			},
			{
				id:     "b",
				header: false,
				height: 340
			},
			{
				id:     "c",
				collapsed_text: "результат выполнения javascript",
				header: false
			}
		],
		offsets: {          // optional, offsets for fullscreen init
			top:    2,     // you can specify all four sides
			right:  2,     // or only the side where you want to have an offset
			bottom: 2,
			left:   2
		}
	});

	function on_resize(names){
		if(names.indexOf("b")!=-1){
			var h = layout.cells("b").getHeight();
			$p.iface.editor.setSize(null, h - 66);
		}
	}
	layout.attachEvent("onPanelResizeFinish", on_resize);

	// табы
	var tabs = $p.iface.tabs = layout.cells("b").attachTabbar({
		tabs: [
			{id: "content", text: "Описание", active: true},
			{id: "js", text: "JavaScript"}
		]
	});

	tabs.tabs("js").attachObject("code_mirror");

	$p.iface.editor_bar = new $p.iface.OTooolBar({
		wrapper: document.querySelector("#code_toolbar"),
		width: '99%',
		height: '28px',
		top: '6px',
		left: '10px',
		name: 'top',
		image_path:	dhtmlx.image_path + 'dhxtoolbar_web/',
		buttons: [
			{name: 'run', img: 'execute.png', text: 'Выполнить', width: '110px', float: 'left'},
			{name: 'reload', img: 'refresh.png', text: 'Очистить окно результата', width: '220px', float: 'left'}
		], onclick: function (name) {
			switch(name) {
				case 'run':
					$p.iface.result.execute($p.iface.editor.getValue());
					break;
				case 'reload':
					$p.iface.result.execute('location.reload();');
					break;

				default:
					$p.msg.show_msg(name);
					break;
			}
		}});

	$p.iface.editor = CodeMirror.fromTextArea(document.querySelector("#code_editor"), {
		mode: "javascript",
		lineNumbers: true,
		lineWrapping: true,
		scrollbarStyle: "simple"
	});


	tabs.tabs("content").attachHTMLString("<div style='height: 100%; width: 100%; overflow: auto'></div>")
	$p.iface.content = tabs.tabs("content").cell.firstChild.firstChild;

	tabs.attachEvent("onSelect", function(id, lastId){
		$p.iface.set_hash(tree.getSelectedItemId(), "", "", id);
		return true;
	});

	// iframe с результатами
	layout.cells("c").attachURL(opt_url());
	setTimeout(function () {
		$p.iface.result = new function Results() {

			this.show = function () {
				layout.cells("c").expand();
				on_resize(["b"]);
			};

			this.hide = function () {
				layout.cells("c").collapse();
				on_resize(["b"]);
			};

			this.execute = function (code) {
				frames[0].postMessage(code, "*");
			};

			this.navigate = function (url) {
				$p.iface.result.execute('navigate("' +url+ '")');
			};

		};
	}, 100);

	// дерево
	var tree = $p.iface.tree = layout.cells("a").attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	tree.attachEvent("onSelect", tree_select);
	tree.loadJSONObject(require('tree'));
	setTimeout(function () {
		tree.selectItem("0100", true);
	}, 300);

	// совместимость браузеров

};

function tree_select(id){

	// обновляем текст описания
	$p.iface.content.innerHTML = marked(require('md'+id));

	// обновляем текст js
	var js = require('js'+id);
	if(js)
		$p.iface.editor.setValue(js.substr(9));
	else
		$p.iface.editor.setValue("");
	$p.iface.editor.clearHistory();

	// при необходимости, обновляем url страницы результата
	if($p.iface.tree.getUserData(id, "exec_hidden"))
		$p.iface.result.hide();
	else{
		$p.iface.result.navigate(opt_url($p.iface.tree.getUserData(id, "url")));
		$p.iface.result.show();
	}

	$p.iface.set_hash(id, "", "", $p.iface.tabs.getActiveTab());

}

function opt_url(url){
	if(typeof url == "undefined")
		url =  "examples/codex/result.html";
	else if(typeof url == "string")
		url = url;
	else if(typeof url == "object")
		url = url.url;

	if(url.indexOf("oknosoft.ru") == -1 && location.protocol.indexOf("file") != -1){
		if(url.indexOf("/unf/"))
			url = "http://www.oknosoft.ru/assets/examples/unf/";
		else if(url.indexOf("/accounting/") != -1)
			url = "http://www.oknosoft.ru/assets/examples/accounting/";
		else
			url = (location.origin + location.pathname).replace("index.html", "") + url;
	}
	return url;
}

/**
 * Обработчик события перед маршрутизацией
 * @param event
 * @return {boolean}
 */
$p.iface.before_route = function (event) {
	var route_prm = $p.job_prm.parse_url();
	if(route_prm.view && (route_prm.view=="js" || route_prm.view=="content")){
		if($p.iface.tabs.getActiveTab() != route_prm.view)
			$p.iface.tabs.tabs(route_prm.view).setActive();
	}
	if(route_prm.obj && route_prm.obj.indexOf("0")==0){
		try{
			if($p.iface.tree.getSelectedItemId() != route_prm.obj)
				$p.iface.tree.selectItem(route_prm.obj, true); }
		catch(e){ }
	}

	return false;
};