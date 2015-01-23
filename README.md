# Andylight - шаблон для быстрого старта верстки

## Как начать?

У вас должен быть установлен [bower](http://bower.io/) и [gulp](http://gulpjs.com/).

Далее выполняем:

```
npm i
bower i
gulp build
```

## Как работать дальше?

После того, как у вас выкачались все зависимости проекта, вы можете приступить к верстке. Но перед этим запустите задачу `gulp` или `gulp watch`.

## Что включено?

- стандартный шаблон index.html
- подгрузка зависимостей с помощью Bower
- компиляция sass
- сжатие стилей, скриптов и изображений
- генерация PNG из SVG
- генерация спрайтов
- поддержка изображений для retina-экранов (см. [Retina-Images](https://github.com/Retina-Images/Retina-Images/))

#### Bower

Все сторонние библиотеки описаны в файле bower.json. Вы можете добавить еще несколько или удалить лишнее. Также вам нужно будет поправить пути paths в файле gulpfile.js.

#### Стили

Все стили находятся в папке src/sass. Gulp собирает их в один файл main.css и кладет в папку dist/css.

Все делится на логические блоки. Если вы хотите добавить еще один, создайте новый sass-файл и подключите его в main.sass. Или можете действовать по собственному сценарию.

#### Изображения

За сжатие изображений отвечает задача images. Вы можете вызывать ее самостоятельно, либо запустить `gulp` или `gulp watch`, и после этого каждый файл изображения, размещенный в src/img будет сжат и положен в dist/img с тем же именем.

#### SVG

SVG-файлы хранятся в папке src/img/svg. Изначально ее нет и ее нужно создать. Это сделано потому, что на проекте может не использоваться SVG вовсе. После запуска задачи `gulp` или `gulp watch` можно будет сладывать svg в исходную папку, а gulp сожмет его и положит в dist/img/svg.

#### Спрайты

После выполнения задачи `gulp build` появится возможность использовать спрайты.

Например, мы создаем тег `<i class="icon icon-test"></i>`. После этого прописываем в файл `_icons.sass` стиль для этого тега:

```
.icon
    display: inline-block

.icon-test
    +sprite($test)
```

Или вы можете описать свою версию использования спрайтов.

#### Изображения для экранов высокой четкости

В шаблоне подключен скрипт, который позволяет загружать изображения повышенной четкости для тех устройств, где это необходимо. Причем имя файла будет одно и то же, но картинка в итоге будет другая.

Имеется поддержка @2x и @3x изображений. Необходимо позаботиться о том, чтобы все три связанных файла лежали в одной папке.

Например:

```
src/img/image.jpg
src/img/image@2x.jpg
src/img/image@3x.jpg
```

#### Тестируем баги верстки

Откройте отладчик и выполните следующий код:

```
var a,w=document.createTreeWalker(document,NodeFilter.SHOW_TEXT);while(a=w.nextNode()){if(a.textContent.trim().length)a.textContent='Одиннадцатиклассница пошла посмотреть на достопримечательность, она шла долго, несколько строчек, пока не пришла'}
```

Это поможет вам увидеть, где что поехало, какие блоки сломались.

Код взят [из статьи на Хабрахабре](http://habrahabr.ru/company/2gis/blog/246831/) от 2ГИС.

## Контакты

Если у вас имеются какие-либо вопросы или пожелания, пишите письма на [nikbelikov@me.com](mailto:nikbelikov@me.com) или воспользуйтесь [твиттером](https://twitter.com/_nikbelikov).

## Лицензия

Copyright (c) 2015 [nikbelikov.ru](http://nikbelikov.ru/)

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, добавление, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, также как и лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторском праве и данные условия должны быть включены во все копии или значимые части данного Программного Обеспечения.

ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ ПРАВ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО ИСКАМ О ВОЗМЕЩЕНИИ УЩЕРБА, УБЫТКОВ ИЛИ ДРУГИХ ТРЕБОВАНИЙ ПО ДЕЙСТВУЮЩИМ КОНТРАКТАМ, ДЕЛИКТАМ ИЛИ ИНОМУ, ВОЗНИКШИМ ИЗ, ИМЕЮЩИМ ПРИЧИНОЙ ИЛИ СВЯЗАННЫМ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫМИ ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
