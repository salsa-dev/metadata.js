'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MetaEventEmitter = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### MetaEventEmitter будет прототипом менеджеров данных
 */
class MetaEventEmitter extends _events2.default {

	/**
  * Расширяем метод _on_, чтобы в него можно было передать объект
  * @param type
  * @param listener
  */
	on(type, listener) {

		if (arguments.length > 1 || typeof type != 'object') {
			super.on(type, listener);
		} else {
			for (var fld in type) {
				if (type.hasOwnProperty(fld)) super.on(fld, type[fld]);
			}
		}
	}
}

exports.MetaEventEmitter = MetaEventEmitter;
class AbstracrAdapter extends MetaEventEmitter {

	constructor($p) {
		super();
		Object.defineProperty(this, '$p', { value: $p });
	}

	/**
  * ### Читает объект из pouchdb
  *
  * @method load_obj
  * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
  * @return {Promise.<DataObj>} - промис с загруженным объектом
  */
	load_obj(tObj) {

		return Promise.resolve(tObj);
	}

	/**
  * Загружает объекты из базы данных по массиву ссылок
  *
  * @method load_array
  * @param _mgr {DataManager}
  * @param refs {Array}
  * @param with_attachments {Boolean}
  * @return {*}
  */
	load_array(_mgr, refs, with_attachments) {

		return Promise.resolve([]);
	}

	/**
  * ### Записывает объект в pouchdb
  *
  * @method save_obj
  * @param tObj {DataObj} - записываемый объект
  * @param attr {Object} - ополнительные параметры записи
  * @return {Promise.<DataObj>} - промис с записанным объектом
  */
	save_obj(tObj, attr) {

		return Promise.resolve(tObj);
	}

	/**
  * ### Возвращает набор данных для дерева динсписка
  *
  * @method get_tree
  * @param _mgr {DataManager}
  * @param attr
  * @return {Promise.<Array>}
  */
	get_tree(_mgr, attr) {

		return Promise.resolve([]);
	}

	/**
  * ### Возвращает набор данных для динсписка
  *
  * @method get_selection
  * @param _mgr {DataManager}
  * @param attr
  * @return {Promise.<Array>}
  */
	get_selection(_mgr, attr) {
		return Promise.resolve([]);
	}

	/**
  * ### Найти строки
  * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
  * Eсли отбор пустой, возвращаются все строки из PouchDB.
  *
  * @method find_rows
  * @param _mgr {DataManager}
  * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
  * @param [selection._top] {Number}
  * @param [selection._skip] {Number}
  * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
  * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
  * @return {Promise.<Array>}
  */
	find_rows(_mgr, selection) {

		return Promise.resolve([]);
	}

}
exports.default = AbstracrAdapter;
