/** @flow */
import React, {Component, PropTypes} from "react";
import {InfiniteLoader, Grid} from "react-virtualized";
import Toolbar from "./Toolbar";
import cn from "classnames";

import styles from "./DataList.scss";


const limit = 30,
  totalRows = 999999;

export default class DataList extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {

    _mgr: PropTypes.object.isRequired,    // Менеджер данных
    _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера
    selection_mode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
    columns: PropTypes.array,             // Настройки колонок динамического списка. Если не указано - генерируем по метаданным
    select: PropTypes.object,             // Параметры запроса к couchdb. Если не указано - генерируем по метаданным

    read_only: PropTypes.object,          // Элемент только для чтения
    deny_add_del: PropTypes.bool,         // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    modal: PropTypes.bool,                // Показывать список в модальном диалоге
    width: PropTypes.number.isRequired,   // Ширина элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`
    height: PropTypes.number.isRequired,  // Высота элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`
    Toolbar: PropTypes.func,              // Индивидуальная панель инструментов. Если не указана, рисуем типовую

    // Redux actions
    handleSelect: PropTypes.func,         // обработчик выбора значения в списке
    handleAdd: PropTypes.func,            // обработчик добавления объекта
    handleEdit: PropTypes.func,           // обработчик открытия формы редактора
    handleRevert: PropTypes.func,         // откатить изменения - перечитать объект из базы данных
    handleMarkDeleted: PropTypes.func,    // обработчик удаления строки
    handlePost: PropTypes.func,           // обработчик проведения документа
    handleUnPost: PropTypes.func,         // отмена проведения
    handlePrint: PropTypes.func,          // обработчик открытия диалога печати
    handleAttachment: PropTypes.func,     // обработчик открытия диалога присоединенных файлов
  }

  static defaultProps = {
    width: 1000,
    height: 400
  }

  constructor(props, context) {

    super(props);

    this.state = {
      totalRowCount: totalRows,
      selectedRowIndex: 0,
      do_reload: false,
      columns: props.columns,
      _meta: props._meta || props._mgr.metadata(),

      // готовим фильтры для запроса couchdb
      select: props.select || {
        _view: 'doc/by_date',
        _raw: true,
        _top: 30,
        _skip: 0,
        _key: {
          startkey: [props.params.options || props._mgr.class_name, 2000],
          endkey: [props.params.options || props._mgr.class_name, 2020]
        }
      }
    }

    const {state} = this
    const {$p} = context

    if (!state.columns || !state.columns.length) {

      state.columns = []

      // набираем поля
      if (state._meta.form && state._meta.form.selection) {
        state._meta.form.selection.cols.forEach(fld => {
          const fld_meta = state._meta.fields[fld.id] || props._mgr.metadata(fld.id)
          state.columns.push({
            id: fld.id,
            synonym: fld.caption || fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: (fld.width == '*') ? 250 : (parseInt(fld.width) || 140)
          });
        });

      } else {

        if (props._mgr instanceof $p.classes.CatManager) {
          if (state._meta.code_length) {
            state.columns.push('id')
          }

          if (state._meta.main_presentation_name) {
            state.columns.push('name')
          }

        } else if (props._mgr instanceof $p.classes.DocManager) {
          state.columns.push('number_doc')
          state.columns.push('date')
        }

        state.columns = state.columns.map((id, index) => {
          // id, synonym, tooltip, type, width
          const fld_meta = state._meta.fields[id] || props._mgr.metadata(id)
          return {
            id,
            synonym: fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: fld_meta.width || 140
          }
        })
      }
    }

    this._list = {
      _data: [],
      get size() {
        return this._data.length
      },
      get(index){
        return this._data[index]
      },
      clear(){
        this._data.length = 0
      }
    }

  }

  componentDidUpdate (prevProps, prevState) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if (this.state.do_reload) {
      this.state.do_reload = false;
      this._loadMoreRows({
        startIndex: 0,
        stopIndex: 30
      })
    }
  }

  render() {

    const {columns, totalRowCount, select} = this.state
    const {width, height, selection_mode, params, _mgr} = this.props
    const key0 = params.options || _mgr.class_name

    if(select._key.startkey[0] != key0){
      select._key.startkey[0] = key0
      select._key.endkey[0] = key0
      setTimeout(() => {
        this._list.clear()
        this.setState({
          do_reload: true,
          totalRowCount: 0
        })
      })
    }

    return (
      <div>

        <Toolbar

          selection_mode={!!selection_mode}
          handleSelect={this.handleSelect}

          handleAdd={this.handleAdd}
          handleEdit={this.handleEdit}
          handleRemove={this.handleRemove}
          handlePrint={this.handlePrint}
          handleAttachment={this.handleAttachment}

          handleSelectionChange={this.handleSelectionChange}
          selectionValue={{}}
        />

        <InfiniteLoader
          isRowLoaded={this._isRowLoaded}
          loadMoreRows={this._loadMoreRows}
          rowCount={totalRowCount}
          minimumBatchSize={limit}
        >
          {({onRowsRendered, registerChild}) => {

            const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex}) => {

              onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex
              })
            }

            let left = 0;

            return (

              <div>

                <div
                  //className={styles.BodyGrid}
                  style={{position: 'relative'}}>
                  {
                    columns.map(function (column, index) {

                      let res = <div
                        key={'caption_' + column.id}
                        className={ cn(styles.oddRow, styles.cell)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          height: 30,
                          width: column.width,
                          left: left
                        }}>{column.synonym}</div>

                      left += column.width

                      return res;
                    })

                  }
                </div>

                <Grid
                  ref={registerChild}
                  //className={styles.BodyGrid}
                  onSectionRendered={onSectionRendered}
                  cellRenderer={this._cellRenderer}
                  columnCount={columns.length}
                  columnWidth={({index}) => columns[index].width }
                  rowCount={totalRowCount}
                  rowHeight={30}
                  width={width}
                  height={height - 90}
                  style={{top: 30}}
                />

              </div>

            )
          }

          }

        </InfiniteLoader>

      </div>
    )
  }

  // обработчик выбора значения в списке
  handleSelect = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleSelect, _mgr} = this.props
    if (row && handleSelect) {
      handleSelect(row, _mgr)
    }
  }

  // обработчик добавления элемента списка
  handleAdd = () => {
    const {handleAdd, _mgr} = this.props
    if (handleAdd) {
      handleAdd(_mgr)
    }
  }

  // обработчик редактирования элемента списка
  handleEdit = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleEdit, _mgr} = this.props
    if (row && handleEdit) {
      handleEdit(row, _mgr)
    }
  }

  // обработчик удаления элемента списка
  handleRemove = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleRemove, _mgr} = this.props
    if (row && handleRemove) {
      handleRemove(row, _mgr)
    }
  }

  // обработчик изменении свойств отбора
  handleSelectionChange = () => {

  }

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handlePrint, _mgr} = this.props
    if (row && handlePrint) {
      handlePrint(row, _mgr)
    }
  }

  // обработчик вложений теущей строки
  handleAttachment = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleAttachment, _mgr} = this.props
    if (row && handleAttachment) {
      handleAttachment(row, _mgr)
    }
  }

  _formatter(row, index) {

    const {$p} = this.context
    const {columns} = this.state
    const column = columns[index]
    const v = row[column.id]

    switch ($p.UI.control_by_type(column.type, v)) {

      case 'ocombo':
        return $p.utils.value_mgr(row, column.id, column.type, false, v).get(v).presentation

      case 'dhxCalendar':
        return $p.utils.moment(v).format($p.utils.moment._masks.date)

      default:
        return v

    }
  }

  _isRowLoaded = ({index}) => {
    const res = !!this._list.get(index)
    return res
  }

  _getRowClassName(row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _loadMoreRows = ({startIndex, stopIndex}) => {

    const {select, totalRowCount} = this.state
    const {_mgr} = this.props
    const increment = Math.max(limit, stopIndex - startIndex + 1)

    Object.assign(select, {
      _top: increment,
      _skip: startIndex,
      _view: 'doc/by_date',
      _raw: true
    })

    // выполняем запрос
    return _mgr.find_rows_remote(select)

      .then((data) => {

        // обновляем массив результата
        for (var i = 0; i < data.length; i++) {
          if (!this._list._data[i + startIndex]) {
            this._list._data[i + startIndex] = data[i];
          }
        }

        // обновляем состояние - изменилось количество записей
        if (totalRowCount != startIndex + data.length + (data.length < increment ? 0 : increment )) {
          this.setState({
            totalRowCount: startIndex + data.length + (data.length < increment ? 0 : increment )
          })
        } else {
          this.forceUpdate()
        }

      })
  }

  /**
   *
   * @param columnIndex - Horizontal (column) index of cell
   * @param isScrolling - The Grid is currently being scrolled
   * @param key - Unique key within array of cells
   * @param rowIndex - Vertical (row) index of cell
   * @param style - Style object to be applied to cell
   * @return {Component}
   * @private
   */
  _cellRenderer = ({columnIndex, isScrolling, key, rowIndex, style}) => {

    const setState = ::this.setState
    // var grid = this.refs.AutoSizer.refs.Grid

    const classNames = cn(
      this._getRowClassName(rowIndex),
      styles.cell,
      {
        [styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
        [styles.hoveredItem]: rowIndex === this.state.hoveredRowIndex && rowIndex != this.state.selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
        [styles.selectedItem]: rowIndex === this.state.selectedRowIndex
      }
    )

    const row = this._list.get(rowIndex)

    let content

    if (row) {
      content = this._formatter(row, columnIndex)

    } else {
      content = (
        <div
          className={styles.placeholder}
          style={{width: 10 + Math.random() * 80}}
        />
      )
    }

    // It is important to attach the style specified as it controls the cell's position.
    // You can add additional class names or style properties as you would like.
    // Key is also required by React to more efficiently manage the array of cells.
    return (
      <div
        className={classNames}
        key={key}
        style={style}
        onMouseOver={function () {
          setState({
            hoveredColumnIndex: columnIndex,
            hoveredRowIndex: rowIndex
          })
        }}
        onTouchTap={function () {
          setState({
            selectedRowIndex: rowIndex
          })
        }}
        onDoubleClick={this.handleEdit}
      >
        {content}
      </div>
    )
  }

}
