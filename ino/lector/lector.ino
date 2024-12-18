#include <Ethernet.h>
#include <SPI.h>
#include <Wiegand.h>

// Wiegand
WIEGAND wg;
#define WIEGAND_D0 2  // Pin D0 del lector
#define WIEGAND_D1 3  // Pin D1 del lector

#define RELAY_PIN 8 

// Configuración de Ethernet
//Ethernet setup
EthernetClient client;
const byte mac[] PROGMEM  = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

const IPAddress ip(192, 168, 1, 3) PROGMEM ;     // IP estática del Arduino
const IPAddress subnet(255, 255, 255, 0) PROGMEM ; // Máscara de subred
const IPAddress gateway(192, 168, 1, 1) PROGMEM ; // Puerta de enlace
const IPAddress server(192, 168, 1, 10) PROGMEM ; // Dirección IP del servidor

void setup() {
  Serial.begin(9600);
  Serial.println("Iniciando...");
 
  Ethernet.begin(mac, ip, gateway, subnet);
  Serial.print(F("IP estática configurada: "));
  Serial.println(Ethernet.localIP());

  // Configurar pines
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Apagar relay al inicio

  // Iniciar Wiegand
  wg.begin(WIEGAND_D0, WIEGAND_D1);
  Serial.println("Sistema iniciado y esperando tarjetas...");
}

void loop() {
  if(wg.available())
  {
    uint32_t codigo = wg.getCode();
    Serial.print("Tarjeta leída (Hex): ");
    Serial.println(codigo, HEX); // Mostrar en formato hexadecimal
    Serial.print("Valor original (Decimal): ");
    Serial.println(codigo);

    bool hasAccess = checkCard(String(codigo));

    if(hasAccess){
      Serial.println("Acceso permitido, ahi va un focaso");
      turnRelay();
    }else{
      Serial.println("Acceso DENEGADO y reportado al historial");
    }

  }
}

bool checkCard(String codigo) {
  String url = "/tarjetas/" + codigo; 

  if (client.connect(server, 5000)) {
    Serial.println("Conectado al servidor");

    // Crear la solicitud GET
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: 192.168.1.10");
    client.println("Connection: close");
    client.println();

    while (client.connected()) {
      if (client.available()) {
        String line = client.readStringUntil('\n');
        Serial.println("RESPONSE: " + line);

        // Buscar palabra "success" en la respuesta
        if (line.indexOf("true") != -1) {
          client.stop();
          return true; // PERMITIDO 
        }
      }
    }
    client.stop();
  } else {
    Serial.println("Error conectando al servidor");
  }
  return false; // DENEGADO 
}

void turnRelay(){
  Serial.println("Activando relay...");
  digitalWrite(RELAY_PIN, HIGH); // Activar relay
  delay(5000);                   // Mantener relay activado por 5 segundos
  digitalWrite(RELAY_PIN, LOW);  // Apagar relay
  Serial.println("relay apagado...");
}