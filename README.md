# Instruões de instalação

1. Instale as dependências com ```npm install```

2. Caso não tenha instalado ainda, instale o npm com ```sudo apt install npm```

3. Rode o códico com o ```node app```

4. Abra no navegador o link mostrado no terminal

## Chat bot

O chat bot tem como objetivo coletar de maneira amigável e natual as respostas necessárias para fazer a simulação já existente da própria BTG que dirá qual o investimento ideal para aquele usuário.

Com os dados coletados uma api envia os dados para um código em python que realiza um web scraping para coletar o melhor investimento para determinada situação. Essa informação volta para o chat bot via API e a opção de investimento será oferecida para o usuário. 