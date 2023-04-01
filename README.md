# Posquare 社群網站 (前端)

## Project Description

Posquare 是採前後端分離的仿社群網站作品，此 repo 為前端部分，
後端 repo: https://github.com/Aswexx/server

整體專案架構與一些功能製作的規劃與一些實作細節，請參考以下用 reveal.js 作的簡報:
https://aswexx.github.io/posquare-presentation/


### 實現功能
1. Google 註冊登入、一般帳號註冊登入
2. 發文、留言、按讚、追蹤(取消追蹤)。
3. 上傳圖片或短片。
4. 即時一對多聊天。
5. 特定條件(如被追蹤、被按讚、被留言)獲取即時通知。
6. 模擬 line pay 串接支付，解鎖更多功能。
7. 網站後台- 簡易資料視覺化與資料導出 (csv 檔)。
8. 網站後台- 可依照篩選條件，查看所有使用者資料以及貼文內容。

### 主要使用工具
<li>Vue 2</li>
<li>vuex</li>
<li>vue-router</li>
<li>socket.io-client</li>
<li>chart.js / vue-chart.js</li>
<li>sass</li>
<li>axios</li>
<li>jwt-decode</li>
<li>date-fns</li>

## 成品展示
請至 https://joeln.site/

登入方式:
1. 使用 Google 帳號登入
2. 使用非 gmail 信箱註冊新帳號後登入(需收驗證碼信)
3. 直接使用以下任一組測試帳號密碼登入:

帳號: test1@example.com
密碼: 123
帳號: test2@example.com
密碼: 123
帳號: test3@example.com
密碼: 123
帳號: test4@example.com
密碼: 123

================

## Project Description
Posquare is a social networking site with a front-end and back-end separation. This repo contains the front-end portion, with the back-end repo available at https://github.com/Aswexx/server.

For the overall project structure, as well as planning for functionality and implementation details, please refer to: https://aswexx.github.io/posquare-presentation/.

## Implemented Features
1. Registration and login using Google or a regular account
2. Posting, commenting, liking, and following/unfollowing
3. Uploading images or short videos
4. Real-time group chat
5. Real-time notifications for specific events (e.g. followed, liked, commented)
6. Simulation of Line Pay integration to unlock additional features
7. Admin site feature for simple data visualization and data export to CSV files
8. Admin site feature for viewing user data and post content based on specified filters

## Main Tools Used
<li>Vue 2</li>
<li>vuex</li>
<li>vue-router</li>
<li>socket.io-client</li>
<li>chart.js / vue-chart.js</li>
<li>sass</li>
<li>axios</li>
<li>jwt-decode</li>
<li>date-fns</li>

## Demo
Please visit https://joeln.site/ to see the demo.

Login methods:

1. Login using a Google account
2. Register a new account using a non-gmail email address and login (verification email required)
3. Directly use any of the following test account credentials to log in:
Email: test1@example.com
Password: 123
Email: test2@example.com
Password: 123
Email: test3@example.com
Password: 123
Email: test4@example.com
Password: 123