# GasWeight

1. Use Ardiuno to weigh the gas
2. Send the weighing result to database
3. Show the result on the web
4. Give some service for users

## Hardware material

1. Ardiuno Uno *1
2. breadboard *1
3. 10 k ohm resistance *1
4. 5KG scales sensor *1
5. WIFI-ESP8266 *1
6. 5V to 3V stabilizer(LM-1117) *1
7. dupont lines(M/M), (F/M)


## Database design

import sql to db

DB: wifidb

table: wifi(id, data, time)

table: user_contact(id, name, phone, address)

## install

1. extract file to directory
2. php- DB connection
```javascript
$localhost = "localhost";
$my_user = "user";//db user
$my_password = "password";//db password
$my_db =  "wifidb";
```
3. Arduino setting
```javascript
//connect
String SID = "";//wifi name
String PWD = "";//wifi password
String IP = "";//IP
String file = "directory/receive.php";//under htdocs 
```
