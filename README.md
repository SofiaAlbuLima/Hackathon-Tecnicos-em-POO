# Instruões de instalação

## Chat bot

1. Instale as dependências com ```npm install```

2. Caso não tenha instalado ainda, instale o npm com ```sudo apt install npm```

3. Rode o códico com o ```node app```

4. Abra no navegador o link mostrado no terminal

## Web Scraping

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

# Como funciona

O chat bot tem como objetivo coletar de maneira amigável e natual as respostas necessárias para fazer a simulação já existente da própria BTG que dirá qual o investimento ideal para aquele usuário.

Com os dados coletados o código em python realiza um web scraping para coletar o melhor investimento para determinada situação com base no simulador da BTG. Essa informação fica salva em um JSON