# Instruões de instalação

## Chat bot:

1. Instale as dependências com ```npm install```

2. Caso não tenha instalado ainda, instale o npm com ```sudo apt install npm```

3. Rode o códico com o ```node app```

4. Abra no navegador o link mostrado no terminal

## Web Scraping:

1. Altere o caminho de destino do seu download nas linha 146 do botBTG.py

2. Crie o ambiente virtual (realize esse passo apenas uma vez)
```bash
python -m venv venv
```
venv é o nome do seu ambiente virtual, coloque o que preferir

3. Ative o ambiente virtual (realize esse passo toda vez que quiser rodar o pograma)
pip install -r requirements.txt

Linux/Mac
```bash
source venv/bin/activate
```
Windows cmd
```bash
venv\Scripts\activate.bat
```

Windows PowerShell
```bash
venv\Scripts\Activate.ps1
```

4. Instale as dependências
Dentro do ambiente virtual instale todas as dependencias com o comando

```bash
pip install -r requirements.txt
```
5. Execute o programa com
```bash
python3 botBTG.py
```

## API REST:
- Java 17 ```sudo apt install openjdk-17-jdk -y```
- SpringBoot 3.2.3
- Maven s  ```sudo apt install maven -y```
- Lombok
- JDK
- MySQL  ```sudo apt install mysql-server -y```
Importe a pasta investimento no Eclipse como um projeto Maven existente, configure o banco MySQL conforme o application.properties e execute a classe InvestimentoApplication como Spring Boot App.
A API será iniciada localmente em http://localhost:8080
