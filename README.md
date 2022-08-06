# Каморка

## _серверная часть_

версия node.js - 12.15.0

Важные действия перед деплоем:

- сбилдить клиентскую часть (calendar-client) npm run build
- скопировать папку static из папки build(calendar-client) в папку files(calendar-ap)
- сделать npm run client:build (calendar-ap)
- коммит
- push в гит
- pull на сервер
