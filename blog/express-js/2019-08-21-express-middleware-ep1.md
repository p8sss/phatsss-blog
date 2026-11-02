---
slug: express-middleware-ep1
date: 2019-08-21
title: Express Middleware ep1
description: Express Middleware
authors: phatsss
tags: [NodeJS, Express]
language: lo
---
Middleware function ແມ່ນຟັງຊັ່ນທີ່ສາມາດເຂົ້າໄປຈັດການກັບ request object(req), response object(res) ແລະ next function ທີ່ຢູ່ໃນຂະບວນການ request-response cycle ຂອງ applications. next function ເປັນຟັງຊັ່ນທີ່ຢູ່ໃນ Express route ທີ່ຈະຖືກເອີ້ນໃຊ້ເມື່ອ middleware ດັ່ງກ່າວເຮັດວຽກສຳເລັດ,ໝາຍຄວາມວ່າ next() ຈະເປັນຕົວທີ່ສັ່ງໃຫ້ເຮັດວຽກໃນ function ລຳດັບຖັດໄປ ຫຼື middleware ຖັດໄປ ຖ້າຫາກວ່າ middleware ປະຈຸບັນເຮັດວຽກສຳເລັດແລ້ວນັ້ນເອງ.
<!-- truncate -->

![[https://expressjs.com](https://expressjs.com/)](https://cdn-images-1.medium.com/max/2486/1*wOuV8q4fumAb1tgOxzmm5w.png)*[https://expressjs.com](https://expressjs.com/)*

## ໜ້າທີ່ຂອງ middleware ໃນ express ມີດັ່ງນີ້:

* ຣັນຄຳສັ່ງຕ່າງໆທີ່ຢູ່ໃນ middleware ທີ່ກຳນົດ.

* ແກ້ໄຂ request object(req) ແລະ response object(res).

* ຈົບການເຮັດວຽກຂອງ request-response cycle.

* ເອີ້ນໃຊ້ middleware ຖັດໄປໂດຍໃຊ້ next().
> ຖ້າຫາກ middleware ປະຈຸບັນບໍ່ຈົບຂະບວນການ request-response cycle ໄດ້, ຈະຕ້ອງໄດ້ກຳນົດ next() ເພື່ອສັ່ງໃຫ້ທຳການເຮັດວຽກຟັງຊັ່ນລຳດັບຖັດໄປ, ຖ້າບໍ່ດັ່ງນັ້ນການ request ຫຼື ການຮ້ອງຂໍໃດໆກໍ່ຈະບໍ່ສາມາດເຮັດວຽກຕໍ່ໄດ້.

**ຕົວຢ່າງ: **ການໃຊ້ middleware ແບບງ່າຍດາຍ

![](https://cdn-images-1.medium.com/max/2534/1*y6khZei0EjMUqNjwn-EhGQ.png)

ຈາກຕົວຢ່າງຂ້າງເທິງຈະເຫັນໄດ້ວ່າບໍ່ມີການກຳນົດ next() ໃດໆ, ດັ່ງນັ້ນ ເມື່ອມີການເອີ້ນໃຊ້ middleware ຈະຈົບຂະບວນການ request-response cycle ແລ້ວຈະສະແດງ ‘Hello World!’ ອອກມາ.

**ຕົວຢ່າງ**:Middleware function myLogger

![](https://cdn-images-1.medium.com/max/2000/1*yl1dg7e_uySsf9IyUlR0iw.png)

ຈາກຕົວຢ່າງຂ້າງເທິງຈະເຫັນວ່າ: ທຸກໆຄັ້ງທີ່ມີ request ເຂົ້າມາ ກໍ່ຈະມີການສະແດງ ‘Hello World!’ ແລະ ສະແດງຜ່ານ console ວ່າ ‘LOGGED’ ເນື່ອງຈາກ myLogger ຖືກປະກາດໄວ້ກ່ອນທີ່ຈະມີການເຂົ້າມາເຮັດວຽກທີ່ root path(‘/’) ແລະ ມີການເອີ້ນໃຊ້ next() ເພື່ອໃຫ້ສາມາດເຂົ້າໄປເຮັດວຽກ middleware ຖັດໄປນັ້ນເອງ.
> ປ.ລ: ເມື່ອໃດກໍ່ຕາມທີ່ມີການເອີ້ນໃຊ້ຟັງຊັ່ນ send() ຈະເປັນການຈົບຂະບວນການ request-response cycle, ດັ່ງນັ້ນ ຖ້າຫາກໃຊ້ຟັງຊັ່ນ send() ແລ້ວມີການເອີ້ນໃຊ້ next() ພາຍຫຼັງກໍ່ຈະບໍ່ມີຜົນໃດໆ ເນື່ອງຈາກຂະບວນການ request-response cycle ໄດ້ສິ້ນສຸດແລ້ວນັ້ນເອງ.

**ຂະບວນການເກີດ request-response cycle ມີດັ່ງນີ້:**

* ຜູ່ໃຊ້ທຳການສົ່ງ request ໄປຍັງ server(ພິມ URL ໃນ Browser ແລ້ວກົດ Enter)

* ເມື່ອ request ທີ່ສົ່ງມາກົງກັບ Route ຫຼື URL path ທີ່ກຳນົດກໍ່ຈະເຮັດວຽກ

* ເມື່ອເຮັດວຽກສຳເລັດກໍ່ຈະທຳການສົ່ງ response ໄປສະແດງທີ່ browser ຂອງຜູ່ໃຊ້(ອາດຈະເປັນການ render ໜ້າ HTML ໄປສະແດງ ຫຼື ສົ່ງຄ່າໃດໜຶ່ງໄປອັບເດດ content ຢູ່ທີ່ໜ້າເວບ)

**ປະເພດຂອງ middleware ໃນ Express Application ມີດັ່ງນີ້:**

* Application-level middleware

* Router-level middleware

* Error-handling middleware

* Built-in middleware

* Third-party middleware

## Application-level middleware

application-level middleware ໄດ້ຜູກກັບ instance ຂອງ app object ໂດຍຈະເອີ້ນໃຊ້ຜ່ານ app.use() ແລະ app.METHOD(), ໂດຍທີ່ METHOD ກໍ່ຄື HTTP method(get,post,put ແລະ delete) ເຊັ່ນ: app.get(), app.post(), app.put(), app.delete() ດັ່ງນີ້ເປັນຕົ້ນ.

**ຕົວຢ່າງ**:

* middleware function ທີ່ບໍ່ມີການ mount path, ຈະເຮັດວຽກທຸກຄັ້ງເມື່ອ app ໄດ້ຮັບ request ເຂົ້າມາ.

![](https://cdn-images-1.medium.com/max/2556/1*kGNAHSdaVf0pi_yBvSjOUg.png)

* middleware ທີ່ມີການລະບຸ path ‘/user/:id’, ໂດຍທີ່ function ນີ້ຈະເຮັດວຽກກັບທຸກໆ HTTP request ທີ່ມາຍັງ ‘/user/:id’

![](https://cdn-images-1.medium.com/max/2554/1*XiicOFxFvSxehDEb2XEBjg.png)

* ຕໍ່ມາຈະເປັນການນຳໃຊ້ຮູບແບບ app.METHOD() ໂດຍມີການກຳນົດ route path ແລະ HTTP request ເປັນ GET method ໄປທີ່ path: ‘/user/:id’

![](https://cdn-images-1.medium.com/max/2562/1*yY1e4l1B2_QpKccDFQtLzg.png)

* ຖ້າມີຟັງຊັ່ນຫຼາຍກວ່າ 1 ຟັງຊັ່ນທີ່ຢາກໃຫ້ເຮັດວຽກໄປຕາມລຳດັບເມື່ອມີ request ເຂົ້າມາກໍ່ສາມາດກຳນົດໄດ້ດັ່ງນີ້:

![](https://cdn-images-1.medium.com/max/2566/1*cH4y95D231gp34pZCywSAw.png)

ຈາກຕົວຢ່າງດ້ານເທິງຈະເຫັນວ່າ: ເມື່ອມີ request ຈາກທຸກໆ method ມາທີ່ path: ‘/user/:id’ ຈະທຳການເຮັດວຽກທີ່ຟັງຊັ່ນທຳອິດແລ້ວເຮັດວຽກຟັງຊັ່ນຕໍ່ໄປທັນທີ ເນື່ອງຈາກຟັງຊັ່ນ next() ນັ້ນເອງ.

* ໃນກໍລະນີທີ່ມີການກຳນົດ route path ຊ້ຳກັນ(HTTP method ແບບດຽວກັນ)ດັ່ງຕົວຢ່າງດ້ານລຸ່ມຈະເຫັນວ່າ: ເມື່ອມີ request ມາທີ່ path: ```‘/user/:id’``` ໂດຍໃຊ້ GET method ກໍ່ຈະເຂົ້າໄປເຮັດວຽກທີ່ middleware ທຳອິດແຕ່ຈະບໍ່ເຂົ້າໄປເຮັດວຽກທີ່ middleware ຕໍ່ໄປ ເຖິງວ່າ middleware ທີ 2 ຈະບໍ່ມີ error ໃດໆເລີຍ, ທີ່ເປັນແບບນີ້ກໍ່ເນື່ອງມາຈາກໃນ middleware ທຳອິດໄດ້ມີການເອີ້ນໃຊ້ ```send()``` ເຊິ່ງເປັນການຈົບຂະບວນການ request-response cycle ນັ້ນເອງ.

![](https://cdn-images-1.medium.com/max/2572/1*rtTyWzKdz_vzTbMnq1YDTg.png)

* ນອກຈາກນີ້ເຮົາຍັງສາມາດຂ້າມຟັງຊັ່ນທີ່ຢູ່ໃນ middleware ນັ້ນໆໄປເຮັດວຽກ midleware ລຳດັບຖັດໄປທີ່ມີ route path ຊ້ຳກັນໄດ້ໂດຍນຳໃຊ້ next(‘route’)
> *ປ.ລ:ການນຳໃຊ້ ```next(‘route’)``` ໃຊ້ໄດ້ສະເພາະ ```app.METHOD()``` ແລະ ```router.METHOD() ``` ເທົ່ານັ້ນເຊິ່ງບໍ່ສາມາດໃຊ້ຜ່ານ ```app.use()``` ແລະ ```router.use()```

![](https://cdn-images-1.medium.com/max/2570/1*TGOp-qjr4LAe4QMhQar_Sg.png)

* ເຮົາສາມາດເກັບຟັງຊັ່ນໄວ້ໃນ Array ແລ້ວທຳການເອີ້ນໃຊ້ໄດ້ເຊັ່ນ: ເວລາທີ່ມີຟັງຊັ່ນຫຼາຍຟັງຊັ່ນທີ່ຕ້ອງເຮັດວຽກຢູ່ໃນ middleware ດຽວກັນແຕ່ບໍ່ຕ້ອງການທີ່ຈະຍັດທັງໝົດໄວ້ໃນ middleware ຕົວດຽວ

![](https://cdn-images-1.medium.com/max/2568/1*_isJCywGWYVK7XtyOwalag.png)

## Router-level middleware

Router-level middleware ມີວິທີການນຳໃຊ້ແບບດຽວກັນກັບ Application-level middleware ສິີ່ງທີ່ຕ່າງກັນກໍ່ມີພຽງແຕ່: router ເປັນ instance ຂອງ ```express.Router()``` ແຕ່ app ເປັນ instance ຂອງ Express() ເຊິ່ງເປັນ top-level ຟັງຊັ່ນນັ້ນເອງ.

![](https://cdn-images-1.medium.com/max/2558/1*slcZvDLl8ogtt_3TsXGboQ.png)

ໃນການນຳໃຊ້ route ເຮົາກໍ່ສາມາດນຳໃຊ້ຟັງຊັ່ນ ```route.use()``` ແລະ ```route.METHOD()``` ເຊັ່ນດຽວກັບ Application-level middleware ດັ່ງຕົວຢ່າງດ້ານລຸ່ມ:

![](https://cdn-images-1.medium.com/max/2000/1*E3nf1_Z3lYfsKRXRoPjx5Q.png)
> *ເຖິງແມ່ນວ່າ router ຈະມີວິທີການນຳໃຊ້ແບບດຽວກັນກັບ app ແຕ່ router ກໍ່ຕ້ອງລໍຖ້າໃຫ້ມີການເອີ້ນໃຊ້ຈາກ app ເສີຍກ່ອນ ຫຼື app ຈະຕ້ອງກຳນົດ path ໃຫ້ມີການນຳໃຊ້ router ນັ້ນເອງ

ເຮົາສາມາດນຳໃຊ້ ```next(‘route’)``` ເພື່ອຂ້າມຟັງຊັ່ນໄປເຮັດວຽກ middleware ອື່ນໄດ້ເຊັ່ນກັນ:

![](https://cdn-images-1.medium.com/max/2000/1*zj7zNf93VVth-dV-io8UqQ.png)

ຈາກຕົວຢ່າງຂ້າງເທິງຈະສາມາດແບ່ງລຳດັບການເຮັດໄດ້ດັ່ງນີ້:

1: ເມື່ອມີ request ມາທີ່ ```path: ‘/admin’``` ດ້ວຍ HTTP method ໃດໆກໍ່ຕາມຈະເຂົ້າໄປເຮັດວຽກທີ່ ```router.use()``` ເນື່ອງຈາກ ເມື່ອມີການເອີ້ນໃຊ້ router ສ່ວນທີ່ຕ້ອງເຮັດວຽກກ່ອນທຸກໆຄັ້ງແມ່ນ ```router.use()``` ທີ່ບໍ່ມີການ mount path.

2: ໃນ ```router.use()``` ກໍ່ຈະທຳການກວດສອບວ່າ: ມີການສົ່ງ req.headers[‘x-auth’] ມາຫຼືບໍ່ ຖ້າມີກໍ່ຈະເຂົ້າໄປເຮັດວຽກທີ່ middleware ຖັດໄປດ້ວຍຟັງຊັ່ນ ```next()```, ກໍ່ຈະສະແດງຂໍ້ຄວາມ ```‘hello, user!’```.

3: ຖ້າຫາກເງື່ອນໄຂໃນ ```router.use()``` ຜິດ ກໍ່ຈະກັບມາເຮັດວຽກຟັງຊັ່ນທີ່ middleware ເດີມຕໍ່ໂດຍຈະສົ່ງ 401 status ຄືບໍ່ໄດ້ຮັບສິດເຂົ້າໃຊ້ໃນສ່ວນນີ້.

## Error-handling middleware

ໃນສ່ວນຂອງ Error-handling middleware ຈະມີ arguments 4 ຕົວ ໂດຍຈະມີ ```err(error)``` ມາຕື່ມໃນການສ້າງ middleware, ໃນການສ້າງ middleware ທຸກຄັ້ງຈະຕ້ອງກຳນົດ arguments ໃຫ້ຄົບ 4 ຕົວສະເໝີ ເພາະຖ້າບໍ່ດັ່ງນັ້ນມັນຈະຖືວ່າເປັນ middleware ທຳມະດາ.

ຕົວຢ່າງການກຳນົດ error-handling middleware

![](https://cdn-images-1.medium.com/max/2556/1*F8C4_m2CqxWMTQcLw7wbiQ.png)
> ສ່ວນວິທີການນຳໃຊ້ error-handling middleware ແມ່ນຈະນຳສະເໜີໃນບົດຄວາມຕໍ່ໄປ

## Built-in middleware

ເປັນຟັງຊັ່ນທີ່ມີມາໃນ express ເພື່ອຊ່ວຍນັກພັດທະນາໃຫ້ ພັດທະນາ app ສະດວກສະບາຍຍິ່ງຂຶ້ນເຊັ່ນ:

* ```express.static()``` // ເປັນການເອີ້ນໃຊ້ static file ເຊັ່ນ: ໄຟລ໌ຮູບ, css …

* ```express.json()``` // ແປງຂໍ້ມູນທີ່ຢູ່ໃນຮູບແບບ json string ໃຫ້ເປັນ json object

* ```express.urlencoded()``` //ແປງຂໍ້ມູນທີ່ຮັບເຂົ້າມາໃນຮູບແບບ url-encoded ໃຫ້ເປັນ object

## Third-party middleware

ເປັນ middleware ທີ່ນັກພັດທະນາແຍກພັດທະນາເປັນ package ໄວ້, ເມື່ອເຮົາຕ້ອງການໃຊ້ middleware ຕົວໃດກໍ່ສາມາດດາວໂຫຼດຜ່ານ NPM(Node Package Manager) ໄດ້.

ຕົວຢ່າງ:ການໂຫຼດ cookie-parser ມາໃຊ້ໃນໂປຣເຈັກທີ່ເຮົາພັດທະນາຢູ່ກໍ່ສາມາດເຮັດໄດ້ດັ່ງນີ້:

![](https://cdn-images-1.medium.com/max/2560/1*O31-m3FzzMsPQXnL44jNSw.png)

ນອກຈາກ cookie-parser ແລ້ວ ທ່ານສາມາດເຂົ້າໄປເບິ່ງ middleware ອື່ນໆເພີ່ມເຕີມໄດ້ຕາມລິ້ງດ້ານລຸ່ມ:
[**Express middleware**
*The Express middleware modules listed here are maintained by the Expressjs team. These are some additional popular…*expressjs.com](https://expressjs.com/en/resources/middleware.html)

    ສຳລັບບົດຄວາມນີ້ກໍ່ຂໍຈົບເນື້ອຫາພຽງເທົ່ານີ້, ສ່ວນບົດຄວາມໜ້ານັ້ນຈະມີຫຍັງມານຳສະເໜີຝາກຕິດຕາມຕໍ່ໄປ 

ບົດຄວາມທີ່ກ່ຽວຂ້ອງ:
[**ວ່າດ້ວຍເລື່ອງ Routing ຂອງ Express**
*Routing ແມ່ນຫຍັງ?*medium.com](https://medium.com/@pphatskps/%E0%BA%A7%E0%BB%88%E0%BA%B2%E0%BA%94%E0%BB%89%E0%BA%A7%E0%BA%8D%E0%BB%80%E0%BA%A5%E0%BA%B7%E0%BB%88%E0%BA%AD%E0%BA%87-routing-%E0%BA%82%E0%BA%AD%E0%BA%87-express-27f857308e34)

ຂໍ້ມູນອ້າງອີງ:
[**Using middleware**
*Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is…*expressjs.com](https://expressjs.com/en/guide/using-middleware.html)

    ‍‍ຮູບພາບທັງໝົດມາຈາກ expressjs.com
