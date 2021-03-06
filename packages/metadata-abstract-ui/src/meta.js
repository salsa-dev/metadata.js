/**
 * Плагин-модификатор abstract-ui для metadata.js
 *
 * @module meta
 *
 * Created 08.01.2017
 */

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

	proto(constructor, classes) {

		// метаданные абстрактных интерфейсов
		classes.Meta._sys.push({
			enm: {
				sort_directions: [
					{
						order: 0,
						name: "asc",
						synonym: "По возрастанию"
					},
					{
						order: 1,
						name: "desc",
						synonym: "По убыванию"
					}
				],
				comparison_types: [
					{
						order: 0,
						name: "gt",
						synonym: "Больше"
					},
					{
						order: 1,
						name: "gte",
						synonym: "Больше или равно"
					},
					{
						order: 2,
						name: "lt",
						synonym: "Меньше"
					},
					{
						order: 3,
						name: "lte",
						synonym: "Меньше или равно "
					},
					{
						order: 4,
						name: "eq",
						synonym: "Равно"
					},
					{
						order: 5,
						name: "ne",
						synonym: "Не равно"
					},
					{
						"order": 6,
						"name": "in",
						"synonym": "В списке"
					},
					{
						order: 7,
						name: "nin",
						synonym: "Не в списке"
					},
					{
						order: 8,
						name: "lke",
						synonym: "Подобно "
					},
					{
						order: 9,
						name: "nlk",
						synonym: "Не подобно"
					}
				],
				label_positions: [
					{
						order: 0,
						name: "auto",
						synonym: "Авто"
					},
					{
						order: 1,
						name: "hide",
						synonym: "Скрыть"
					},
					{
						order: 2,
						name: "left",
						synonym: "Лево"
					},
					{
						order: 3,
						name: "right",
						synonym: "Право"
					},
					{
						order: 4,
						name: "top",
						synonym: "Верх"
					},
					{
						order: 5,
						name: "bottom",
						synonym: "Низ"
					},
				],
				data_field_kinds: [
					{
						order: 0,
						name: "input",
						synonym: "Поле ввода"
					},
					{
						order: 1,
						name: "label",
						synonym: "Поле надписи"
					},
					{
						order: 2,
						name: "toggle",
						synonym: "Поле переключателя"
					},
					{
						order: 3,
						name: "image",
						synonym: "Поле картинки"
					},
					{
						order: 4,
						name: "text",
						synonym: "Редактор многострочного текста"
					},
				]
			},
			cat: {
				meta_objs: {
					fields: {}
				},
				meta_fields: {
					fields: {}
				},
				scheme_settings: {
					name: "scheme_settings",
					synonym: "Настройки отчетов и списков",
					input_by_string: [
						"name"
					],
					hierarchical: false,
					has_owners: false,
					group_hierarchy: true,
					main_presentation_name: true,
					code_length: 0,
					fields: {
						obj: {
							synonym: "Объект",
							tooltip: "Имя класса метаданных",
							type: {
								types: [
									"string"
								],
								str_len: 250
							}
						},
						user: {
							synonym: "Пользователь",
							tooltip: "Если пусто - публичная настройка",
							type: {
								types: [
									"string"
								],
								str_len: 50
							}
						},
						order: {
							synonym: "Порядок",
							tooltip: "Порядок варианта",
							type: {
								types: [
									"number"
								],
								digits: 6,
								fraction_figits: 0,
							}
						},
						query: {
							synonym: "Запрос",
							tooltip: "Индекс CouchDB или текст SQL",
							type: {
								types: [
									"string"
								],
								str_len: 0
							}
						},
						date_from: {
							"synonym": "Начало периода",
							"tooltip": "",
							"type": {
								"types": [
									"date"
								],
								"date_part": "date"
							}
						},
						date_till: {
							"synonym": "Конец периода",
							"tooltip": "",
							"type": {
								"types": [
									"date"
								],
								"date_part": "date"
							}
						},
						formula: {
							synonym: "Формула",
							tooltip: "Формула инициализации",
							type: {
								types: [
									"cat.formulas"
								],
								is_ref: true
							}
						},
						tag: {
							synonym: "Дополнительные свойства",
							type: {
								types: [
									"string"
								],
								str_len: 0
							}
						}
					},
					tabular_sections: {
						fields: {
							name: "fields",
							synonym: "Доступные поля",
							tooltip: "Состав, порядок и ширина колонок",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "Для плоского списка, родитель пустой",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								width: {
									synonym: "Ширина",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 6
									}
								},
								caption: {
									synonym: "Заголовок",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								tooltip: {
									synonym: "Подсказка",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								ctrl_type: {
									synonym: "Тип",
									tooltip: "Тип элемента управления",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								formatter: {
									synonym: "Формат",
									tooltip: "Функция форматирования",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								},
								editor: {
									synonym: "Редактор",
									tooltip: "Компонент редактирования",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								}

							}
						},
						sorting: {
							name: "sorting",
							synonym: "Поля сортировки",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								direction: {
									synonym: "Направление",
									tooltip: "",
									type: {
										types: [
											"enm.sort_directions"
										],
										"is_ref": true
									}
								}
							}
						},
						dimensions: {
							name: "dimensions",
							synonym: "Поля группировки",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								}
							}
						},
						resources: {
							name: "resources",
							synonym: "Ресурсы",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								formula: {
									synonym: "Формула",
									tooltip: "По умолчанию - сумма",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								}
							}
						},
						selection: {
							name: "selection",
							synonym: "Отбор",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								left_value: {
									synonym: "Левое значение",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								comparison_type: {
									synonym: "Вид сравнения",
									tooltip: "",
									type: {
										types: [
											"enm.comparison_types"
										],
										is_ref: true
									}
								},
								right_value: {
									synonym: "Правое значение",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								}
							}
						},
						params: {
							name: "params",
							synonym: "Параметры",
							tooltip: "",
							fields: {
								param: {
									synonym: "Параметр",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								value_type: {
									synonym: "Тип",
									tooltip: "Тип значения",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								value: {
									synonym: "Значение",
									tooltip: "Может иметь примитивный или ссылочный тип или массив",
									type: {
										types: [
											"string",
											"number",
											// "date",
											// "array"
										],
										str_len: 0,
										digits: 15,
										fraction_figits: 3,
										// date_part: "date"
									}
								}
							}
						},
						composition: {
							name: "composition",
							synonym: "Структура",
							tooltip: "",
							fields: {
								parent: {
									"synonym": "Родитель",
									"multiline_mode": false,
									"tooltip": "",
									"type": {
										"types": [
											"string"
										],
										"str_len": 10
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								elm: {
									"synonym": "Элемент",
									"tooltip": "Элемент структуры отчета",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								},
								kind: {
									"synonym": "Вид раздела отчета",
									"tooltip": "список, таблица, группировка строк, группировка колонок",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								},
								definition: {
									"synonym": "Описание",
									"tooltip": "Описание раздела структуры",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								}
							}
						}
					},
					cachable: "doc"
				}
			},
			dp: {
				scheme_settings: {
					name: "scheme_settings",
					synonym: "Варианты настроек",
					fields: {
						scheme: {
							synonym: "Текущая настройка",
							tooltip: "Текущий вариант настроек",
							mandatory: true,
							type: {
								types: [
									"cat.scheme_settings"
								],
								is_ref: true
							}
						}
					}
				}
			}
		})
	}
}
