#include <HX711.h>
#include <SoftwareSerial.h>

// connect 10 11 to HX711
HX711 hx(10, 11, 128, 0.00267834);

// sensor
int Pin = 2; //analog pin 2 
int Val = 0; //初始 感測值

//connect
String SID = "your wifi name";
String PWD = "your wifi password";
String IP = "your IP address";
String file = "/arduino/receive_sql.php";//xampp-under htdoc

String str = "Connection"; //http 回覆狀態

SoftwareSerial esp8266(8,9); 
// connect 8 to TX of wifi-esp8266
// connect 9 to RX of wifi-esp8266

void setup() {
    // enable debug serial
    Serial.begin(115200); 
    // enable software serial
    esp8266.begin(115200);
    init_wifi();  //設定ESP8266,改變模式,連線wifi
    hx.set_offset(-37450);
    // 公式調整基準值
}

void loop() {
    
    delay(500);
    
    // sum0 為調整前的值
    // sum1 為公式調整後的值
    double sum0 = 0;
    double sum1 = 0;
    for (int i = 0; i < 10; i++) {
      // Get hx value
      sum0 += hx.read();
      sum1 += hx.bias_read();

    }
    Serial.print(sum0/10);
    Serial.print(" ");
    Serial.println(sum1/10);
    Val = sum1/10;
   //Val = analogRead(Pin);  // 讀取sensor感測值
   // ESP8266 回覆http狀態
   while(esp8266.available())
   {
     Serial.print(esp8266.readString());
     delay(100);
   }
   //上傳
   uploadData();
}

// Setting ESP8266
void init_wifi(){
  Serial.println("=======================================");
  Serial.println("|---  Esp8266 Setting  ---|\n");
  sendCommand("AT+RST",5000); // reset module
  sendCommand("AT+CWMODE=1",2000); // configure as access point
  sendCommand("AT+CWJAP=\""+SID+"\",\""+PWD+"\"",5000);
  sendCommand("AT+CIPMUX=0",2000); // configure for single connections
  Serial.println("\n|---  Setting Finish  ---|");
  Serial.println("=======================================");
}
// Setting Esp8266 (Send Command)
void sendCommand(String command, const int timeout)
{
    String response = "";    
    esp8266.println(command); // send the read character to the esp8266   
    long int time = millis();   
    while( (time+timeout) > millis())
    {
      while(esp8266.available())
      {    
        // The esp has data so display its output to the serial window 
        response = esp8266.readString(); // read the next character.
      }  
    }    

    Serial.println(command +" : "+ response);
    delay(100);
}

// Upload Data
void uploadData()
{
  // convert to string
  // TCP connection
  String cmd = "AT+CIPSTART=\"TCP\",\"";
  cmd += IP; //host
  cmd += "\",80"; // port setting-default is 80
  esp8266.println(cmd);
  Serial.println(cmd);
  if(esp8266.find("Error")){
    Serial.println("AT+CIPSTART");
    return;
  }
  
  // prepare GET string
  String getStr = "GET /"+file+"?value=";
  getStr += String(Val);
  getStr +="\r\n\r\n";

  // send data length
  cmd = "AT+CIPSEND=";
  cmd += String(getStr.length());
  esp8266.println(cmd);

  if(esp8266.find(">")){
    esp8266.print(getStr);
  }
  else{
    esp8266.println("AT+CIPCLOSE");
    // alert user
    Serial.println("AT+CIPCLOSE");
  }
  delay(2000);  
}
