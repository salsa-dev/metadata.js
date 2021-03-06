## multi-package repo metadata.js v2

[English version](README.en.md)

### metadata-core
Модуль [metadata-core](metadata-core) обеспечивает слой абстракции для работы с объектами и менеджерами данных (перечисление, документ, справочник, обработка и т.д.), а так же - объектом описания метаданных. Классы `DataManager`, `Meta` и `DataObj` - довольно абстрактные. Они предоставляют интерфейсы для работы с данными, но ничего не знают ни о визуализации данных, но о способе хранения и доступа к этим данным. За взаимодействие с поставщиком данных отвечает _адаптер_.  
Библиотека [alaSQL](https://github.com/agershun/alasql) жестко вшита в ядро.  
Таблицы `alaSQL` используются, как хранилища менеджеров данных, в которых размещены объекты данных.
 
### metadata-abstract-adapter
Экспортирует виртуальный класс с минимально необходимыми методами _адаптера данных_. От него могут быть унаследованы адаптеры для взаимодействия с `1С`, `PostgreSQL` или иными ORM, SQL и NoSQL хранилищами.

### metadata-pouchdb
Реализует функциональность адаптера pouchdb для metadata.js.
Ответственность за репликацию и offline-доступ к данным, лежит целиком на адаптере. Ядро и пользовательский интерфейс ничего не знают о доступности сервера. UI взаимодействует с ядром и оперирует высокоуровневыми объектами данных. Ядро обращается к адаптеру, как к черному ящику. Адаптер, в зависимости от настроек кеширования текущего класса метаданных, может оперировать с данными в ОЗУ, indexedDB или выполнять запрос к внешнему серверу.

### metadata-redux
Содержит _Типы действий_, _Генераторы действий_ и _Обработчики регистрации_ в терминах [Redux](https://github.com/reactjs/redux)

### metadata-abstract-ui
Общие перечисления и методы интерфейса пользователя для metadata.js

### metadata-react-ui
Визуальный интерфейс к данным metadata.js можно реализовать с использованием любого js-фреймворка или на чистом javascript.

Библиотека [metadata-react-ui](metadata-react-ui) содержит набор высокоуровневых визуальных компонентов, использует [React](https://github.com/facebook/react) для рендеринга UI и [Redux](https://github.com/reactjs/redux) для хранения состояния приложения.

### metadata-angular-ui
Компоненты интерфейса пользователя на базе [Angular](https://angularjs.org/)  
_Не реализовано в текущей версии_

### metadata-ember-ui
Компоненты интерфейса пользователя на базе [Ember](http://emberjs.com/)  
_Не реализовано в текущей версии_
