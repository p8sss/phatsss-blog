---
slug: promises-async-await-in-javascript
date: 2023-05-06
title: "JavaScript EP7: Promises & Async/Await⏳🪄"
description: Promises & Async/Await in JavaScript
authors: phatsss
tags: [Javascript]
language: lo
---
ເຄີຍຮັບມືກັບ JS code ທີ່ແບບວ່າ...ມັນບໍ່ໄດ້ເຮັດວຽກຕາມທີ່ເຮົາຄາດຫວັງໄວ້ບໍ່? ອາດຈະເບິ່ງຄືກັບວ່າ function ຕ່າງໆຖືກ execute ແບບສຸ່ມ-ໝາຍຄວາມວ່າເຮົາບໍ່ສາມາດຄາດເດົາເວລາທີ່ໃຊ້ໃນການ execute ໄດ້ເລີຍ ຫຼື ເກີດເຫດການທີ່ວ່າການ execute ລ່າຊ້າ, ມື້ນີ້ເຮົາຈະມາເບິ່ງ feature ສຸດຄັກທີ່ຊື່ວ່າ Promises ຂອງ JavaScript ນຳກັນ🧙🏻‍♂️.

<!-- truncate -->
ເຄີຍຮັບມືກັບ JS code ທີ່ແບບວ່າ...ມັນບໍ່ໄດ້ເຮັດວຽກຕາມທີ່ເຮົາຄາດຫວັງໄວ້ບໍ່? ອາດຈະເບິ່ງຄືກັບວ່າ function ຕ່າງໆຖືກ execute ແບບສຸ່ມ-ໝາຍຄວາມວ່າເຮົາບໍ່ສາມາດຄາດເດົາເວລາທີ່ໃຊ້ໃນການ execute ໄດ້ເລີຍ ຫຼື ເກີດເຫດການທີ່ວ່າການ execute ລ່າຊ້າ, ມື້ນີ້ເຮົາຈະມາເບິ່ງ feature ສຸດຄັກທີ່ຊື່ວ່າ **Promises** ຂອງ JavaScript ນຳກັນ🧙🏻‍♂️.

> ຖ້າໃຜຍັງບໍ່ໄດ້ອ່ານ EP1 ທີ່ໄດ້ອະທິບາຍເຖິງການເຮັດວຽກຂອງ Event Loop, ແນະນຳໃຫ້ກັບໄປອ່ານກ່ອນ, ເນື່ອງຈາກມັນເປັນເນື້ອຫາທີ່ກ່ຽວຂ້ອງກັນ.
[JavaScript EP1: Event Loop♻️](https://dev.to/phatsss/javascript-ep1-event-loop-2mop)

ເມື່ອເຮົາຂຽນ JS ສິ່ງໜຶ່ງທີ່ເຮົາມັກຈະຕ້ອງໄດ້ພົບຢູ່ຕະຫຼອດກໍ່ຄືການຈັດການ tasks ທີ່ມີການເຮັດວຽກກັບ tasks ອື່ນໆ, ສົມມຸດວ່າເຮົາຕ້ອງການທີ່ຈະ get image, compress, ໃສ່ filter ແລະ ບັນທຶກຮູບນັ້ນໆຈະມີຂັ້ນຕອນການເຮັດວຽກດັ່ງນີ້:
- ສິ່ງທຳອິດທີ່ເຮົາຈະເຮັດກໍ່ຄືການດຶງເອົາຮູບທີ່ເຮົາຕ້ອງການແກ້ໄຂ(get image), ເຮົາມີ `getImage` function ທີ່ຈະເຮັດວຽກໃນສ່ວນນີ້.
- ຫຼັງຈາກໄດ້ຮູບມາແລ້ວຕໍ່ມາຈະເປັນການ resize image ຈະເປັນສ່ວນຂອງ `compressImage` function ຮັບໄມ້ຕໍ່.
- ເມື່ອ resize image ສຳເລັດເຮົາຕ້ອງການໃສ່ filter ເຊິ່ງເຮົາມີ `applyFilter` function ຮັບໜ້າທີ່ສ່ວນນີ້ໄປ.
- ສຸດທ້າຍແມ່ນຈະເປັນການບັນທຶກຮູບພາບໂດຍໃຊ້ `saveImage` function ຖ້າຫາກບໍ່ມີຫຍັງຜິດພາດກໍ່ຈະທຳການແຈ້ງໃຫ້ user ຮູ້ວ່າໄດ້ທຳການບັນທຶກຮູບພາບສຳເລັດ.

ສຸດທ້າຍເຮົາຈະໄດ້ code ປະມານນີ້:
![getImage function](https://res.cloudinary.com/practicaldev/image/fetch/s---Kv6sJn7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/ixceqsql5hpdq8txx43s.png)
ສັງເກດເຫັນຫຍັງບາງຢ່າງບໍ່? ຮູ້ສຶກວ່າໃນ code ຂອງເຮົາມີການໃຊ້ nested callback functions ຫຼາຍເກີນໄປເຊິ່ງມັນພັດຂຶ້ນກັບ callback ກ່ອນໜ້າອີກ. callback ໃນລັກສະນະນີ້ມັກຖືກເອີ້ນວ່າ callback hell🤯 ເນື່ອງຈາກມັນມີ callback function ຊ້ອນກັນຫຼາຍເກີນໄປຈຶ່ງເຮັດໃຫ້ code ອ່ານຍາກຂຶ້ນໄປອີກ.

ໂຊກດີທີ່ເຮົາມີສິ່ງທີ່ເອີ້ນວ່າ promises ທີ່ຈະເຂົ້າມາຊ່ວຍເຮົາຈັດການກັບບັນຫາແບບນີ້, ເຮົາໄປທຳຄວາມຮູ້ຈັກກັບ promises ນຳກັນແບບເລິກໆກັນເລີຍ🫡.

---

## Promise Syntax
ຖ້າໃຜເຄີຍໄດ້ອ່ານບົດຄວາມ ຫຼື ເອກະສານໃດໆກໍ່ຕາມທີ່ອະທິບາຍກ່ຽວກັບ Promises ກໍ່ອາດຈະຄຸ້ນຕາກັບນິຍາມ ຫຼື ຄຳອະທິບາຍ Promises ປະມານວ່າ:

> "A promise is a placeholder for a value that can either resolve or reject at some time in the future"

ຖ້າຈະເບິ່ງຕາມນິຍາມ ໂດຍສ່ວນຕົວຜູ້ຂຽນເອງກໍ່ຍັງຮູ້ສຶກວ່າມັນຍັງຄຸມເຄືອ ແລະ ບໍ່ຊັດເຈນໃນບາງຈຸດຢູ່, ເພື່ອໃຫ້ເຮົາເຂົ້າໃຈຫຼາຍຂຶ້ນ ເຮົາມາເບິ່ງລັກສະນະການເຮັດວຽກຂອງມັນແທ້ໆເລີຍດີກວ່າ.
ເຮົາສາມາດສ້າງ promise ໂດຍໃຊ້ `Promise` constructor ທີ່ມີການຮັບ callback function ດັ່ງນີ້:
![promise construtor](https://res.cloudinary.com/practicaldev/image/fetch/s--phTVdCKA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/79zi452hphe7ecylhozy.gif)
ເຫັນຫຍັງບໍ່ວ່າມີຫຍັງທີ່ຖືກ return ອອກມາ?
`Promise` ເປັນ object ໜຶ່ງທີ່ທາງໃນປະກອບມີ **status**(`[[PromiseStatus]]`) ແລະ **value**(`[[PromiseValue]]`). ໃນຕົວຢ່າງດດ້ານເທິງເຮົາຈະເຫັນວ່າ value ຂອງ `[[PromiseStatus]]` ແມ່ນ `"pending"` ແລະ value ຂອງ promise ແມ່ນ `undefined`.
ແຕ່ບໍ່ຕ້ອງຫ່ວງ, ເຮົາບໍ່ໄດ້ເຮັດຫຍັງກັບ object ນີ້ດອກ. ໃນຄວາມເປັນຈິງເຮົາບໍ່ສາມາດ access `[[PromiseStatus]]` ແລະ `[[PromiseValue]]` properties ໄດ້, ແຕ່ value ຂອງທັງ 2 properties ນີ້ແມ່ນສຳຄັນຫຼາຍເມື່ອເຮົາໃຊ້ promise.

---
value ຂອງ `PromiseStatus` ຫຼື **state** ສາມາດເປັນ 1 ໃນ 3 values ດັ່ງນີ້:
- ✅ `fulfilled`: promise ໄດ້ທຳການ `resolved` ໝາຍຄວາມວ່າທຸກຢ່າງເຮັດວຽກໄດ້ສຳເລັດ, ບໍ່ມີ error ໃດໆເກີດຂຶ້ນໃນ promise.
- ❌ `rejected`: promise ໄດ້ທຳການ `rejected` ໝາຍຄວາມວ່າມີບາງຢ່າງຜິດພາດ ຫຼື ອາດຈະເກີດ error ຫຍັງບາງຢ່າງໃນ promise.
- ⏳ `pending`: promise ຍັງບໍ່ມີການ `resolved` ແລະ ໃນຂະນະດຽວກັນກໍ່ຍັງບໍ່ `rejected` ເຊັ່ນກັນ, ເຊິ່ງມັນຍັງ `pending` ຢູ່.

ແລ້ວຕອນໃດທີ່ promise status ຈະເປັນ `"pending"`, `"fulfilled"` ຫຼື `"rejected"`? ແລະ ສະຖານະຂອງ promise ມັນສຳຄັນຈັ່ງໃດ?

ໃນຕົວຢ່າງດ້ານເທິງເຮົາໄດ້ທຳການ pass callback function `() => {}` ເຂົ້າໄປໃນ `promise` constructor. ແຕ່ໃນ callback function ຈະມີການຮັບອີກ 2 arguments, ເຊິ່ງ value ຂອງ argument ທຳອິດເອີ້ນວ່າ `resolve` ຫຼື `res` ເປັນ method ທີ່ຈະຖືກເອີ້ນເມື່ອ Promise ທຳການ **resolve** ແລະ 
argument ທີ 2 ເອີ້ນວ່າ `reject` ແລະ `rej` ເປັນ method ທີ່ຈະຖືກເອີ້ນຕອນທີ່ Promise ທຳການ **reject** ຫຼື ມີບາງຢາດຜິດພາດ.
![callback arguments](https://res.cloudinary.com/practicaldev/image/fetch/s--9A_mOYMP--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/duen4peq0bdr55cka5ya.png)
ມາເບິ່ງກັນວ່າເມື່ອເຮົາເອີ້ນໃຊ້ `resolve` ຫຼື `reject` method ຈະໄດ້ຜົນລັບແນວໃດ:
![call resolve and reject method](https://res.cloudinary.com/practicaldev/image/fetch/s--qKIq-sYt--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/z0b9v0h7aiq073l5tl2l.gif)
ໃນທີ່ສຸດເຮົາກໍ່ຮູ້ວິທີທີ່ເຮັດໃຫ້ promise status ບໍ່ເກີດສະຖານະ `"pending"` ແລະ `undefined` value. **status** ຂອງ promise ຈະເປັນ `"fulfilled"` ຖ້າເຮົາເອີ້ນໃຊ້ `resolve` method ແລະ status ຈະເປັນ `"rejected"` ຖ້າເຮົາເອີ້ນໃຊ້ `rejected` method.
ລອງມາເບິ່ງໃນສ່ວນຂອງ **value** ຂອງ promise ກັນຕື່ມ, ເຊິ່ງ value ຂອງ `[[PromiseValue]]` ຈະເປັນ value ທີ່ເຮົາ pass ເຂົ້າໄປໃນ `resolved` ຫຼື `rejected` method ໃນຮູບແບບຂອງ argument ຂອງມັນ.

---
ມາຮອດຕອນນີ້ເຮົາພໍຈະຮູ້ວິທີຈັດການກັບ Promise object ໃນລະດັບໜຶ່ງແລ້ວ, ຄຳຖາມຕໍ່ມາກໍ່ຄື ມັນໃຊ້ໄວ້ເພື່ອຫຍັງ?🧐.

ໃນຕົວຢ່າງແລກໆແມ່ນເຮົາໄດ້ເຫັນຕົວຢ່າງທີ່ເຮົາໄດ້ທຳການ get image, compress, ໃສ່ filter ແລະ ບັນທຶກຮູບພາບກັນໄປແລ້ວ, ສຸດທ້າຍເຮົາກໍ່ໄດ້ code ທີ່ມີ nasted callback function ແບບເບິ້ມໆມາຊຸດໜຶ່ງ.

Promise ກໍ່ສາມາດນຳມາແກ້ບັນຫາທີ່ວ່າມາໄດ້ເຊັ່ນກັນ, ແຕ່ກ່ອນອື່ນໝົດເຮົາຕ້ອງໄດ້ທຳການຂຽນ code ໃໝ່, ເຊິ່ງເຮົາຈະໃຫ້ແຕ່ລະ function ທຳການ return Promise ແທນ.
ຖ້າຫາກໂຫຼດຮູບສຳເລັດ ແລະ ທຸກຢ່າງເຮັດວຽກໂດຍທີ່ບໍ່ມີ error ໃດໆ, ເຮົາຈະທຳການ **resolve** promise ດ້ວຍໄຟລ໌ທີ່ຖືກໂຫຼດມາແລ້ວ ໃນທີ່ນີ້ຈະເປັນ image ແລະ ຖ້າຫາກເກີດ error ໃນຂະນະທີ່ທຳການໂຫຼດໄຟລ໌ ເຮົາຈະທຳການ **reject** promise ດ້ວຍການໂຍນ error ອອກມາແທນ.
![getImage return promise](https://res.cloudinary.com/practicaldev/image/fetch/s--r9xngcNz--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/iebp0rzfnfqsrmmjplme.png)
ເມື່ອເຮົາລອງສັ່ງ run code ດັ່ງກ່າວຈະໄດ້ຜົນລັບດັ່ງນີ້:
![result of getImage return promise](https://res.cloudinary.com/practicaldev/image/fetch/s--uERkfSWf--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/wsu5nn26dp4elcwh764m.gif)
ຈະເຫັນວ່າ Promise ໄດ້ທຳການ return value ຂອງ parsed data.

ແລ້ວແນວໃດຕໍ່? ເຮົາຈະບໍ່ສົນໃຈ promise object ທັງໝົດທີ່ວ່າມາ, ເຮົາສົນໃຈພຽງ value ຂອງ data ທີ່ຖືກໂຍນອອກມາເທົ່ານັ້ນ, ມັນຈະມີ built-in methods 3 ໂຕທີ່ເຮັດໃຫ້ເຮົາສາມາດດຶງ promise value ອອກມາໃຊ້ໄດ້.
- `.then()`: ຖືກເອີ້ນເມື່ອ promise ຖືກ resolved.
- `.catch()`: ຖືກເອີ້ນເມື່ອ promise ຖືກ rejected.
- `.finally()`: ຈະຖືກເອີ້ນທຸກຄັ້ງບໍ່ວ່າ promise ຈະ resolved ຫຼື rejected ກໍ່ຕາມ.
![built in method](https://res.cloudinary.com/practicaldev/image/fetch/s--19tIvFJQ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/mu1aqqnyfjsfon5hwrtw.png)
*`{` ໃນຮູບດ້ານເທິງໜ້າຈະໃສ່ມາຜິດ

`.then` method ຈະຮັບ value ທີ່ຖືກ pass ມາໃນ resolve method.
![then method](https://res.cloudinary.com/practicaldev/image/fetch/s--DZld0c-0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/11vxhn9cun7stpjbdi80.gif)
`.catch` method ຈະຮັບ value ທີ່ຖືກ pass ມາໃນ rejected method.
![catch method](https://res.cloudinary.com/practicaldev/image/fetch/s--e9SZHcPk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/v5y24jz4u89flazvdyn4.gif)

ໃນທີ່ສຸດເຮົາກໍ່ໄດ້ value ທີ່ຖືກ resolve ໂດຍ promise ໂດຍທີ່ບໍ່ໄດ້ຢູ່ໃນຮູບແບບຂອງ promise object, ເຊິ່ງເຮົາສາມາດນຳ value ດັ່ງກ່າວໄປເຮັດຫຍັງກໍ່ໄດ້.

---
ເມື່ອເຮົາຮູ້ແລ້ວວ່າ promise ຈະທຳການ resolve ຫຼື reject ທຸກໆຄັ້ງ, ດັ່ງນັ້ນເຮົາກໍ່ສາມາດຂຽນ `Promise.resolve` ຫຼື `Promise.reject` ດ້ວຍການ pass value ທີ່ເຮົາຕ້ອງການ resolve ຫຼື reject ເຂົ້າໄປໃຫ້ promise ໄດ້ດັ່ງນີ້.
![Promise.resolve and Promise.reject](https://res.cloudinary.com/practicaldev/image/fetch/s--61Gva3Ze--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/90hxwjfadzslvdbkr4l8.png)
ໃນຕົວຢ່າງຕໍ່ໄປກໍ່ຈະໄດ້ໃຊ້ syntax ແບບນີ້ເປັນຫຼັກ.

---
ຢູ່ໃນຕົວຢ່າງຂອງ `getImage` ເຮົາມີ nested callback function ຫຼາຍອັນ, ເຊິ່ງເຮົາກໍ່ສາມາດໃຊ້ `.then` ໃນການຈັດການກັບ code ສ່ວນນີ້🤩.
result ຂອງ `.then` ເອງກໍ່ແມ່ນ promise value ເຊັ່ນກັນ-ໝາຍຄວາມວ່າເຮົາສາມາດໃຊ້ `.then` ເປັນ chain ຕໍ່ກັນຫຼາຍໆ `.then` ເທົ່າທີ່ເຮົາຕ້ອງການໄດ້. ເຊິ່ງ result ຂອງ `.then` callback ກ່ອນໜ້າຈະຖືກ pass ເປັນໜຶ່ງ argument 
ໃນ `.then` callback ຕໍ່ໄປ.
![then chain](https://res.cloudinary.com/practicaldev/image/fetch/s--X8h-NDc2--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/i6busbetmoya9vny2eku.png)
ໃນກໍລະນີຂອງຕົວຢ່າງ `getImage` ເຮົາສາມາດຂຽນ `.then` callback chain ໄດ້ເຊັ່ນກັນໂດຍເຮົາຈະທຳການ pass ໄຟລ໌ຮູບເຂົ້າໄປໃນ function ຕໍ່ໄປແທນທີ່ຈະໃຊ້ nested callback ຫຼາຍໆຊັ້ນເຊິ່ງມັນຈະເຮັດໃຫ້ code ຂອງເຮົາອ່ານງ່າຍຂຶ້ນ.
![then chain in getImage example](https://res.cloudinary.com/practicaldev/image/fetch/s--e1nVrqe1--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/u9l3lxwxlxgv2edv79xh.png)

---
## Microtasks and (Macro)tasks
ມາຮອດບ່ອນນີ້ເຮົາກໍ່ໄດ້ຮູ້ວິທີສ້າງ promise ແລະ ວິທີຈັດການກັບ values ທີ່ໄດ້ຈາກ promise ກັນໄປແລ້ວ, ເຮົາລອງເພີ່ມ script ອີກໜ້ອຍໜຶ່ງແລ້ວທຳການ run ລອງເບິ່ງອີກຄັ້ງລອງເບິ່ງ.
![microtask queue](https://res.cloudinary.com/practicaldev/image/fetch/s--uNG7sXon--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/ey4ubnv5yjgi6hbh97xq.gif)
ເຫັນຫຍັງບໍ່?🤯 ນັ້ນມັນແບ້ຫຍັງຫັ້ນ?
ທຳອິດເຮົາຈະ log ຄຳວ່າ `Start!` ອອກມາ, ເຊິ່ງບ່ອນນີ້ກໍ່ເປັນຜົນມາຈາກ code ໃນແຖວທຳອິດ. ຕໍ່ມາເຮົາຈະເຫັນວ່າມັນ log ຄຳວ່າ `End!` ແທນທີ່ຈະເປັນ value ຂອງ `Promise.resolve` ແຕ່ສ່ວນນີ້ພັດຖືກ log ອອກມາຫຼັງຈາກ `End!`. ເຮົາມາເບິ່ງນຳກັນຕໍ່ວ່າມັນເກີດຫຍັງຂຶ້ນໃນສ່ວນນີ້.
ມາຮອດບ່ອນນີ້ເຮົາກໍ່ເຫັນແລ້ວວ່າ `promises` ມັນເຮັດຫຍັງໄດ້ແນ່, ເຖິງ JavaScript ມັນຈະເປັນ single-thread ແຕ່ເຮົາກໍ່ສາມາດເພິ່ມຄວາມສາມາດແບບ asynchronous ໂດຍໃຊ້ `Promise` ໄດ້ເຊັ່ນກັນ.
ແຕ່ຮູ້ສຶກວ່າເຮົາໄດ້ເວົ້າເຖິງເລື່ອງນີ້ໄປແລ້ວໃນບົດຄວາມ EP1: Event loop?🤔, ແຕ່ເຮົາຍັງສາມາດໃຊ້ວິທີການແບບເດີມໆທີ່ເຮົາເຄີຍເຮັດຜ່ານມາເຊັ່ນ: setTimeout ໃນການສ້າງ asynchronous behavior ບາງປະເພດໄດ້ຫຼືບໍ່?🧐🤨🤯
ແມ່ນແລ້ວ, ແຕ່ໃນ Event loop ມີຄິວ(Queues)ຢູ່ 2 ປະເພດຄື: (macro)task queue (ບາງຄັ້ງກໍ່ເອີ້ນວ່າ task queue) ແລະ microtask queue. ເຊິ່ງ (macro)task queue ກໍ່ເປັນ queue ສຳລັບ (macro)tasks ແລະ microtask queue ກໍ່ເປັນ queue ສຳລັບ microtask.
ແລ້ວ (macro)task ແລະ microtask ແມ່ນຫຍັງ?, ມາທຳຄວາມເຂົ້າໃຈໄປພ້ອມໆກັນເລີຍ.

![(macro)task and microtask](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6yjvljj7jdt17un9lpxu.png)
ຈາກຕາຕະລາງຈະເຫັນວ່າ `Promise` ຈະຢູ່ໃນ microtask list, ເມື່ອ `Promise` ທຳການ resolve ແລະ ໄດ້ເອີ້ນໃຊ້ `then()`, `catch()` ຫຼື `finally()` method. callback ທີ່ຢູ່ໃນ method ຈະຖືກເພີ່ມເຂົ້າໃນ **microtask queue** ໝາຍຄວາມວ່າບັນດາ callback ທີ່ຢູ່ໃນ `then()`, `catch()` ຫຼື `finally()` method ຈະບໍ່ຖືກ execute ທັນທີ, ແຕ່ໂດຍພື້ນຖານແລ້ວມັນຈະທຳການເພີ່ມ `async` ໃຫ້ JavaScript code ຂອງເຮົາໂດຍອັດຕະໂນມັດຢູ່ແລ້ວ.
ແລ້ວ `then()`, `catch()` ຫຼື `finally()` callback ຖືກ execute ຕອນໃດ? event loop ຈະເປັນຕົວທີ່ຈັດການກັບ priority ໃຫ້ແຕ່ລະ tasks ແຕກຕ່າງກັນດັ່ງນີ້:
- function ທັງໝົດທີ່ຢູ່ໃນ **call stack** ຈະຖືກ execute, ເມື່ອມັນໄດ້ທຳການ return value ອອກມາ ພວກມັນຈະຖືກໂຍນອອກ(pop)ຈາກ call stack.
- ເມື່ອ call stack ວ່າງ, microtasks ທັງໝົດທີ່ຢູ່ໃນ queue ຈະຖືກໂຍນມາທີ່ callstack ເທື່ອລະຕົວ ແລະ ທຳການ execute ຕໍ່ໄປ(ໂຕ Microtasks ເອງກໍ່ຍັງສາມາດ return microtasks ໃໝ່ອອກມາໄດ້ເຊັ່ນກັນ, ເຊິ່ງມັນຈະສ້າງ infinite microtask loop ໄດ້ຢ່າງມີປະສິດທິພາບ).
- ຖ້າຫາກທັງ call stack ແລະ microtask queue ວ່າງ, event loop ຈະທຳການກວດເບິ່ງ tasks ທີ່ຍັງຄ້າງຢູ່ໃນ (macro)task queue ວ່າຍັງມີຫຼືບໍ່?, ຖ້າມີມັນກໍ່ຈະຖືກໂຍນມາທີ່ callstack ເພື່ອທຳການ execute ແລະ ເມື່ອ return value ອອກໄປແລ້ວມັນຈະທຳການໂຍນ task ອອກຈາກ callstack.

---
ເພື່ອໃຫ້ເຫັນພາບຫຼາຍຂຶ້ນ, ເຮົາມາເບິ່ງຕົວຢ່າງງ່າຍໆດ້ານລຸ່ມນຳກັນ:
- Task1: function ທີ່ຖືກເພີ່ມເຂົ້າໄປໃນ call stack ຈະຖືກ execute ທັນທີ, ຕົວຢ່າງ: ການເອີ້ນໃຊ້ function ທີ່ຢູ່ໃນ code ຂອງເຮົາມັນຈະຖືກເອີ້ນໃຊ້ທັນທີ.
- Task2, Task3, Task4: microtasks, ຕົວຢ່າງ: promise `then` callback ຫຼື task ທີ່ຖືກເພີ່ມໂດຍ `queueMicrotask`.
- Task5, Task6: (macro)task, ຕົວຢ່າງ: setTimeout ຫຼື setImmediate callback.
![task queue and microtask queue with event loop](https://res.cloudinary.com/practicaldev/image/fetch/s--05Fi8vBq--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/42eatw03fcha0e1qcrf0.gif)
ທຳອິດ `Task1` ຈະທຳການ return value ແລະ ຈະຖືກໂຍນອອກຈາກ call stack. ຈາກນັ້ນ engine ຈະກວດເບິ່ງ tasks queue ທີ່ຢູ່ໃນ microtask queue. ເມື່ອ tasks ທັງໝົດຖືກເພີ່ມເຂົ້າໄປໃນ call stack ແລະ ຖືກໂຍນອອກໃນຕອນສຸດທ້າຍ engine ຈະທຳການກວດເບິ່ງ task ທີ່ຍັງເຫຼືອໃນ (macro)task queue ຕໍ່ ແລະ ຈະທຳການເພີ່ມເຂົ້າໄປໃນ call stack ແລະ ໂຍນອອກຫຼັງຈາກທີ່ມັນໄດ້ທຳການ return value ອອກມາ.

ດຽວເຮົາມາເບິ່ງຈາກ code ເລີຍດີກວ່າ.
![call stack example](https://res.cloudinary.com/practicaldev/image/fetch/s--fnbqqf1d--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/g61wwyi8wchk2hpzeq4u.png)
ໃນ code ດ້ານເທິງເຮົາມີ macro task ແມ່ນ `setTimeout` ແລະ microtask ແມ່ນ promise `then()` callback, ເມື່ອ engine ເຮັດວຽກມາຮອດແຖວຂອງ `setTimeout` function ຈະເກີດຫຍັງຂຶ້ນ? ເຮົາໄປເບິ່ງການເຮັດວຽກຂອງແຕ່ລະຂັ້ນຕອນນຳກັນເລີຍວ່າເຮົາຈະເຫັນຫຍັງໃນ log ແນ່.

> ປລ: ໃນຕົວຢ່າງຕໍ່ໄປແມ່ນຈະສະແດງເຖິງບັນດາ methods ເຊັ່ນ: `console.log`, `setTimeout` ແລະ `Promise.resolve` ທີ່ຖືກເພີ່ມເຂົ້າໄປໃນ call stack. ເຊິ່ງພວກມັນເປັນ internal methods ດັ່ງນັ້ນເຮົາອາດຈະບໍ່ເຫັນມັນປາກົດຢູ່ໃນ stack traces, ແຕ່ບໍ່ຕ້ອງຕົກໃຈໄປ ຖ້າຫາກໃຊ້ debugger ແລ້ວບໍ່ເຫັນ ເນື່ອງຈາກເຮົາຕ້ອງການຍົກຕົວຢ່າງໃຫ້ເຫັນຄອນເຊັບຂອງການເຮັດວຽກຂອງມັນໂດຍທີ່ບໍ່ໄດ້ຂຽນ code ທີ່ຊັບຊ້ອນຫຍັງ.

ໃນແຖວທຳອິດ, engine ຈະພົບ `console.log()` method, ມັນຈະຖືກເພີ່ມເຂົ້າໄປໃນ call stack ຫຼັງຈາກນັ້ນມັນຈະ log ຄ່າ `Start!` ອອກມາຜ່ານ console ແລະ method ດັ່ງກ່າວຈະຖືກໂຍນອອກຈາກ call stack ແລ້ວ engine ກໍ່ຈະດຳເນີນການເຮັດວຽກຂອງມັນຕໍ່ໄປ.
![engine encounter console.log](https://res.cloudinary.com/practicaldev/image/fetch/s---Bt6DKsn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/6cbjuexvy6z9ltk0bi18.gif)
ຕໍ່ມາ engine ຈະພົບ `setTimeout` method, ເຊິ່ງມັນກໍ່ຈະຖືກເພີ່ມເຂົ້າໄປໃນ call stack. ຕົວ `setTimeout` method ແມ່ນເປັນ method ຂອງ browser ໂດຍທີ່ call back function ຂອງມັນ(`() => console.log('Timeout')`)ຈະຖືກເພີ່ມເຂົ້າໄປໃນ Web API ຈົນກວ່າ timer ເຮັດວຽກສຳເລັດ. ແຕ່ໃນທີ່ນີ້ເຮົາໄດ້ກຳນົດຄ່າໃຫ້ timer ມີຄ່າເປັນ `0` ແຕ່ call back ກໍ່ຍັງຄົງຖືກເພີ່ມລົງໄປໃນ Web API ກ່ອນຢູ່ດີ. ຫຼັງຈາກນັ້ນມັນຈະຖືກເພີ່ມເຂົ້າໄປໃນ **(macro)task queue**: `setTimeout` ເປັນ macro task.
![setTimeout is macro task](https://res.cloudinary.com/practicaldev/image/fetch/s--6NSYq-nO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/yqoemb6f32lvovge8yrp.gif)
step ຕໍ່ໄປ engine ຈະພົບ `Promise.resolve()` method. `Promise.resolve()` method ຈະຖືກເພີ່ມເຂົ້າໄປໃນ call stack, ຫຼັງຈາກທີ່ມັນທຳການ resolve ດ້ວຍ value `Promise!` ແລ້ວ, `then` callback function ຈະຖືກເພີ່ມເຂົ້າໄປໃນ **microtask queue**.
![Promise added to call stack](https://res.cloudinary.com/practicaldev/image/fetch/s--us8FF30N--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/6wxjxduh62fqt531e2rc.gif)
ເມື່ອ engine ເຮັດວຽກມາຮອດແຖວສຸດທ້າຍມັນຈະພົບ `console.log()` method. ມັນຈະຖືກເພີ່ມເຂົ້າໄປໃນ call stack ທັນທີ, ຫຼັງຈາກມັນໄດ້ທຳການ log ຄ່າ `End!` ອອກມາທາງ console ແລ້ວ ມັນຈະຖືກໂຍນອອກຈາກ call stack ທັນທີ. ສ່ວນ engine ຈະເຮັດວຽກສ່ວນທີ່ເຫຼືອຕໍ່ໄປ.
![console.log added to call stack](https://res.cloudinary.com/practicaldev/image/fetch/s--oOS_-CiG--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/a6jk0exl137yka3oq9k4.gif)
ມາຮອດບ່ອນນີ້ engine ຈະເຫັນວ່າ call stack ຂອງເຮົາວ່າງຢູ່. ເມື່ອ call stack ວ່າງມັນຈະໄປກວດເບິ່ງ task ທີ່ລໍຖ້າຢູ່ `microtask queue` ໃນ code ຕົວຢ່າງຂອງເຮົາຈະເຫັນວ່າຍັງມີ promise `then` callback ທີ່ຍັງລໍຖ້າຢູ່, ດັ່ງນັ້ນມັນຈຶ່ງຖືກໂຍນເຂົ້າໄປໃນ call stack ຫຼັງຈາກນັ້ນມັນຈະທຳການ resolve value ຂອງ promise ເຊິ່ງໃນຕົວຢ່າງແມ່ນມັນຈະ log ຄ່າ `Promise!`.
![resolve value of promise](https://res.cloudinary.com/practicaldev/image/fetch/s--5iH5BNWm--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/lczn4fca41is4vpicr6w.gif)
call stack ເຫັນວ່າຄິວວ່າງພໍດີມັນເລີຍເຂົ້າໄປກວດຢູ່ **microtask queue** ອີກຄັ້ງເພື່ອຊອກເບິ່ງວ່າຍັງມີ task ທີ່ຍັງຕໍ່ຄິວ(queue)ຫຼືບໍ່? ແຕ່ວ່າໃນກໍລະນີນີ້ microtask queue ກໍ່ວ່າງເຊັ່ນກັນ🤷🏻.
ເມື່ອຫາຢູ່ microtassk queue ບໍ່ເຫັນມັນຈຶ່ງທຳການໄປຫາຢູ່ **(macro)task queue** ຕໍ່, ເຊິ່ງໃນນີ້ຍັງມີ `setTimeout` callback ທີ່ຍັງຖ້າແລ້ວຖ້າອີກ ແຕ່ຕອນນີ້ເຖິງເວລາທີ່ຕ້ອງໂຍນເຂົ້າໄປໃນ call stack ແລ້ວ. callback function ທຳການ return `console.log` method ທີ່ທຳການ log ຄ່າ `"Timeout!"` ອອກໄປ. ຫຼັງຈາກນັ້ນ `setTimeout` callback ຈະຖືກໂຍນອອກຈາກ call stack.
![setTimeout callback](https://res.cloudinary.com/practicaldev/image/fetch/s--hPFPTZp2--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/p54casaaz9oq0g8ztpi5.gif)
ຈາກຕົວຢ່າງດ້ານເທິງກໍ່ນັບວ່າຈົບບໍລິບູນສຳລັບຕົວຢ່າງນີ້.

---
## Async/Await
ES7 ໄດ້ແນະນຳວິທີໃໝ່ໃນການເພີ່ມ async behavior ໃນ JavaScript ແລະ ເຮັດໃຫ້ມັນເຮັດວຽກຮ່ວມກັບ promises ແບບງ່າຍໆ. ເຊິ່ງໃນນັ້ນຈະໃຊ້ `async` ແລະ `await` keyword ໃນການສ້າງ `async` functions ທີ່ສາມາດ return promise ອອກມາໄດ້, ສ່ວນວິທີການຈະເປັນແນວໃດນັ້ນ ໄປເບິ່ງນຳກັນເລີຍ.
ກ່ອນໜ້ານີ້ເຮົາໄດ້ເຫັນແລ້ວວ່າເຮົາສາມາດສ້າງ Promise ໄດ້ໂດຍໃຊ້ `Promise` object, ເຊິ່ງມັນກໍ່ຍັງມີອີກແບບອື່ນໆເຊັ່ນ: `new Promise(() => {})`, `Promise.resolve`, ຫຼື `Promise.reject`.
ແທນທີ່ຈະໃຊ້ `Promise` object ເຮົາສາມາດສ້າງ asynchronous functions ທີ່ return object ອອກມາໄດ້ເລີຍໂດຍທີ່ເຮົາບໍ່ຈຳເປັນຕ້ອງໄປຂຽນ `Promise` object ດ້ວຍຕົວເອງ.
![asynchronous functions](https://res.cloudinary.com/practicaldev/image/fetch/s--5ED_HyNC--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/72lqrcvy9lc8ehbpitd0.png)

ເຖິງແມ່ນວ່າໃນຄວາມເປັນຈິງແລ້ວ `async` functions ສາມາດ return promises ອອກມາໄດ້ນັ້ນກໍ່ນັບວ່າເປັນເລື່ອງດີ, ແຕ່ວ່າການທີ່ເຮົາຈະສາມາດສຳຜັດເຖິງຂຸມພະລັງທີ່ແທ້ຈິງຂອງ `async` functions ໄດ້ນັ້ນກໍ່ຄືຕອນທີ່ເຮົາໃຊ້ `await` keyword. ດ້ວຍ `await` keyword ເຮົາສາມາດລະງັບການເຮັດວຽກ(suspended)ຂອງ `asynchronous` function ໃນຂະນະທີ່ເຮົາລໍຖ້າ `await` value ຖືກ return ຈາກການ resolve promise ໄດ້ນັ້ນເອງ🥳. ຖ້າເຮົາຕ້ອງການ value ຂອງ promise ຫຼັງຈາກທີ່ຖືກ resolve ແລ້ວນັ້ນເຮົາກໍ່ພຽງແຕ່ເຮັດຄືຕົວຢ່າງທີ່ຜ່ານມາຄືໃຊ້ `then()` callback ແລະ ເຮົາຍັງສາມາດ assign variables ໃຫ້ກັບ `await` promise value ໄດ້ນຳ.
ມັນໝາຍຄວາມວ່າເຮົາສາມາດລະງັບການເຮັດວຽກ(suspended)ຂອງ async function ໄດ້ຫວາ? ຊິວ່າຈັ່ງຊັ້ນກໍ່ໄດ້, ແຕ່ວ່າມັນໝາຍຄວາມວ່າແນວໃດລ່ະ?.
ເຮົາໄປເບິ່ງ code ຕົວຢ່າງພ້ອມໆກັນເລີຍ:
![async function](https://res.cloudinary.com/practicaldev/image/fetch/s--aOWmZxnV--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/e5duygomitj9o455107a.gif)
ເກີດຫຍັງຂຶ້ນກັບ code ຂອງເຮົາແນ່?
![call stack with async function](https://res.cloudinary.com/practicaldev/image/fetch/s--bfscMU3t--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/d27d7xxiekczftjyic4b.gif)
ທຳອິດ engine ມັນຈະພົບກັບ `console.log`. ມັນຈະຖືກໂຍນເຂົ້າໄປໃນ call stack ຫຼັງຈາກນັ້ນມັນຈະທຳການ log ຄ່າ `Before function!` ອອກມາ.
![call stack with async function2](https://res.cloudinary.com/practicaldev/image/fetch/s--wN7yFTnt--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/9wqej2269vmntfcuxs9t.gif)
ຈາກນັ້ນເຮົາໄດ້ທຳການເອີ້ນໃຊ້ async function ທີ່ຊື່ວ່າ `myFunc()`, ຫຼັງຈາກນັ້ນຕົວ `myFunc()` function ກໍ່ຈະເຮັດວຽກ. ໃນແຖວທຳອິດຂອງ function body ເຮົາໄດ້ທຳການເອີ້ນໃຊ້ console.log ອີກຄັ້ງ, ເທື່ອນີ້ມັນຈະ log ຄ່າ `In function!`, ເຊິ່ງ console.log ຈະຖືກໂຍນເຂົ້າໄປໃນ call stack, log ຄ່າອອກມາ ແລະ ຖືກໂຍນອອກຈາກ call stack ຕາມ step ເດີມໆ.
![myFunc on call stack](https://res.cloudinary.com/practicaldev/image/fetch/s--lX9JfreE--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/lch6lutxnl88j0durpyh.gif)
ໃນ function body ຍັງຄົງທຳການ execute ຕໍ່ໄປ, ເຊິ່ງເຮົາຈະເຫັນພະເອກຂອງເຮົາຄື `await` keyword ຢູ່ໃນແຖວທີ 2 🥳🥳🥳.

ສິ່ງທຳອິດທີ່ຈະເກີດຂຶ້ນກໍ່ຄື: value ຈະລໍຖ້າ execute, ເຊິ່ງໃນກໍລະນີນີ້ແມ່ນ `one` function. ມັນຈະຖືກໂຍນເຂົ້າໄປໃນ call stack ແລະ ມັນຈະທຳການ return value ຂອງ resolve promise ອອກມາ. ເມື່ອ promise ຖືກ resolve ແລ້ວ ແລະ `one` ໄດ້ return value ອອກມາ, ຈາກນັ້ນ engine ກໍ່ຈະພົບ `await` keyword.

ເມື່ອມັນພົບ `await` keyword ແລ້ວ, `async` function ຈະຖືກລະງັບການເຮັດວຽກ(suspended). ການ execute ພາຍໃນ function body ຈະທຳການຢຸດຊົ່ວຄາວ(paused) ແລະ ສ່ວນທີ່ເຫຼືອໃນ `async` function ຈະໄປ run ຢູ່ microtask ແທນ task ທຳມະດາແທນ.
![finally call console.log](https://res.cloudinary.com/practicaldev/image/fetch/s--UC78HoCO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/b6l3psgewvtrtmrr60tg.gif)
ຕອນນີ້ async function ທີ່ຊື່ວ່າ `myFunc` ຈະຖືກລະງັບການເຮັດວຽກ(suspended)ໃນກໍລະນີທີ່ທັນພົບ `await` keyword, engine ຈະໂດດອອກຈາກ `async` function ແລະ ທຳການ execute code ຕໍ່ໄປໃນບໍລິບົດຂອງການ execution ທີ່ `async` function ຖືກເອີ້ນໃຊ້. ເຊິ່ງໃນກໍລະນີນີ້ແມ່ນ **global execution context**.
![after await](https://res.cloudinary.com/practicaldev/image/fetch/s--V8u36kEG--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/hlhrtuspjyrstifubdhs.gif)
ສຸດທ້າຍກໍ່ບໍ່ເຫຼືອ task ໃດທີ່ຢູ່ໃນ global execution context. event loop ຈະທຳການກວດເບິ່ງວ່າພົບ microtasks ທີ່ລໍຖ້າ queue ຢູ່ຫຼືບໍ່? ແລະ ມັນກໍ່ຍັງມີ async `myFunc` function ທີ່ຢູ່ໃນ queue ຫຼັງຈາກທີ່ທຳການ resolve value ຂອງ `one`. `myFunc` ຈະຖືກເພີ່ມເຂົ້າໄປໃນ call stack ອີກຄັ້ງ ແລະ ທຳການ run ຕໍ່ຈາກທີ່ຄ້າງໄວ້ກ່ອນໜ້ານີ້.

ໃນທີ່ສຸດ variable `res` ກໍ່ໄດ້ value ອອກມາ, ເຊິ່ງມັນກໍ່ເປັນ value ທີ່ຖືກ resolve ຈາກ promise ນັ້ນກໍ່ຄື `one` ນັ້ນເອງ. ເຮົາໄດ້ທຳການເອີ້ນໃຊ້ `console.log` ດ້ວຍ value ຂອງ res ໃນກໍລະນີນີ້ແມ່ນ `One!`, ເຊິ່ງ `One!` ຈະຖືກ log ອອກມາຜ່ານ console ແລະ ມັນຈະຖືກໂຍນອອກຈາກ call stack.

ມາຮອດຕອນນີ້ກໍ່ເປັນອັນຈົບຊີຣີ່ຂອງ JavaScript ພື້ນຖານ(ແບບສຸດໆ), ຈາກຫຼາຍໆຕົວຢ່າງຜ່ານມາເຮົາກໍ່ຈະເຫັນພາບແລ້ວວ່າພາສາ JavaScript ເອງມັນກໍ່ມີຈຸດທີໜ້າສົນໃນໃນຫຼາຍໆເລື່ອງ ແລະ ຫຼາຍໆ feature ຢູ່ບໍ່ໜ້ອຍ, ຖ້າເຮົາເຂົ້າໃຈຂະບວນການເຮັດວໜກຂອງມັນເຮົາກໍ່ຈະສາມາດຂຽນ code ໄດ້ຢ່າງມີປະສິດທິພາບຫຼາຍຂຶ້ນ ແຕ່ທັງນີ້ກໍ່ຂຶ້ນກັບຄວາມຮູ້ດ້ານອື່ນໆນຳ.

---

ອ້າງອີງ: [⭐️🎀 JavaScript Visualized: Promises & Async/Await](https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke)
