<!-- Плеер будет создан с задержкой, после того как загрузятся все ресурсы на странице. Для этого используется событие `DOMContentLoaded`. Благодаря этой особенности можно вызывать функцию `createPlayer` раньше, чем загрузятся все необходимые библиотеки: jQuery и Playable.
 -->

Построен на базе библиотеки [Playable](https://wix.github.io/playable/).


JS код поставляется в виде одного файла `player.js`. Для работы он требует двух библиотек - [jQuery](https://jquery.com/) и [Playable](https://wix.github.io/playable/). Пример подключения в браузере:

```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://unpkg.com/playable@2.10.3/dist/statics/playable.bundle.min.js"></script>
<script src="player.js"></script>
```

Для работы библиотека требует HTML разметки. Вот полный пример с минимальным количеством настроек:

```html
<div id="player">
  <div class="js-video-container" style="width: 800px; height: 600px;"></div>
</div>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://unpkg.com/playable@2.10.3/dist/statics/playable.bundle.min.js"></script>
<script src="player.js"></script>

<script type="text/javascript">
  createPlayer({elementId: 'player'});
</script>
```


Внутри элемента с указанным id плеер ищет теги с классами:

`js-video-container` — тег, внутри которого будет размещен сам плеер. Такой элемент обязательно должен присутствовать в вёрстке, без него не заведётся.

`js-play-button` — кнопка запуска видео-плеера. Автоматически скрывается, когда плеер начинает воспроизведение видео — тег получает аттрибут [hidden](https://developer.mozilla.org/ru/docs/Web/HTML/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5_%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D1%8B/hidden).

`js-pause-button` — кнопка паузы видео-плеера. Автоматически скрывается при создании плеера и в случае остановки пользователем — тег получает аттрибут [hidden](https://developer.mozilla.org/ru/docs/Web/HTML/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5_%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D1%8B/hidden).


`js-volume-button` —

`js-mute-button` —

`js-fullscreen-button` — кнопка включает полноэкранный режим.

`js-current-time` — внутри тега отобразится текущее время видео-записи.

`js-duration`

`.js-progress` и `js-progress-slider` — комбинация из двух тегов для отображения ползунка видео-плеера. Он показывает какая часть видео была просмотрена и позволяет быстро промотать на интересный момент ролика. Нужны два тега, один внутри другого. Внешний тег отвечает за перетаскивание ползунка — перехватывает клики мышкой. Внутренний блок отображает прогресс ­— заполняет слайдер. Пример вёрстки:

```html
<div class="js-progress" style="background-color: grey;">
  <div class="js-progress-slider" style="background-color: red;">Прогресс</div>
</div>
```

Два рабочих примера:

- Страница с минимальными настройками — `example_min.html`
- Страница с максимальными настройками — `example_max.html`

С помощью аргумента `src` плееру можно указать как видео проигрывать:

```html
<script type="text/javascript">
  createPlayer({
    elementId: 'player',
    src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
});
</script>
```

## TODO


- Переписать документацию, снабдить наглядными примерами
- Сопроводить примеры пояснениями
