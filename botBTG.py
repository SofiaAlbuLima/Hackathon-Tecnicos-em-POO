from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
import json
import sys

class perfilInvest:
        def __init__(self,pes,esp,oti,listComp):
            self.dados = {'Pessimista':pes, 'Esperado':esp, 'Otimista': oti, 'Composicao': listComp}

class CrawlerBTG:
    def __init__(self) -> None:
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.maximize_window()
        self.perfis = []

    def clicar(self, item):
        ActionChains(self.driver).move_to_element(item).perform()
        item.click()
        return item

    def find_xpath(self, item):
        return self.driver.find_element('xpath', item)
    
    def get_carregar(self, item, max):
        while max > 0:
            try:
                return self.find_xpath(item)
            except:
               max -= 1
        raise NoSuchElementException
    
    def get_carregartext(self, item, max):
        while max > 0:
            itemL = self.get_carregar(item, 5)
            if itemL.text == '':
                max -= 1
            else:
                return itemL
        raise NoSuchElementException
    
    def clicarCarregar(self, item, max):
        while max > 0:
            try:
                return self.clicar(self.find_xpath(item))
            except:
                max -= 1
        raise NoSuchElementException
    
    def textClicarCarregar(self, item, max):
        while max > 0:
            try:
                texto = self.get_carregartext(item, 500).text
                self.clicar(self.find_xpath(item))
                return texto
            except:
                max -= 1
        raise NoSuchElementException
    
    def get_Dados(self):
        invesIni = "52213,21"
        aplMensal = "1233"
        durAnos = "15"
        objetivo = 1
        relacao = 1

        #fixo
        nome = "John Doe"
        email = "johndoe@gmail.com"
        celular = "31985642023"
        busca = 2

        try:
            self.driver.get('https://simulador.btgpactual.com/step-1')
            self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[1]/div[1]/div/app-input[1]/fieldset/div[1]/input",500).send_keys(invesIni)
            self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[1]/div[1]/div/app-input[2]/fieldset/div[1]/input",500).send_keys(aplMensal)
            slider = self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[1]/div[2]/div/app-simulator-slider/mat-slider/input",500)
            self.driver.execute_script(f"arguments[0].value = '{durAnos}'; arguments[0].dispatchEvent(new Event('input'));", slider)
            self.clicarCarregar("/html/body/app-root/app-simulation/div[1]/app-form/div/div[2]/div/app-button[2]/a",500)
            self.clicarCarregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[2]/div[1]/div/mat-form-field/div[1]/div[2]/div/mat-select/div/div[1]/span",500)
            self.clicarCarregar(f"/html/body/div[5]/div[2]/div/div/mat-option[{objetivo}]",500)
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            self.clicarCarregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[2]/div[2]/div/mat-form-field/div[1]/div[2]/div/mat-select/div/div[1]/span",500)
            self.clicarCarregar(f"/html/body/div[5]/div[2]/div/div/mat-option[{relacao}]",500)
            self.clicarCarregar("/html/body/app-root/app-simulation/div[1]/app-form/div/div[2]/div/app-button[2]/a",500)
            self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[3]/div[1]/div[2]/app-input[1]/fieldset/div[1]/input",500).send_keys(nome)
            self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[3]/div[1]/div[2]/app-input[2]/fieldset/div[1]/input",500).send_keys(email)
            self.get_carregar("/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[3]/div[1]/div[2]/app-input[3]/fieldset/div[1]/input",500).send_keys(celular)
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            self.clicarCarregar(f"/html/body/app-root/app-simulation/div[1]/app-form/div/app-card/div/div/form[3]/div[2]/mat-radio-group/div/mat-radio-button[{busca}]/div/div/input",500)
            self.clicarCarregar("/html/body/app-root/app-simulation/div[1]/app-form/div/div[2]/div/app-button[2]/a",500)
            tent = 0
            while tent <=5000:
                try:
                    self.get_carregartext("/html/body/app-root/app-projection/section[1]/div/app-badge/div",500)
                    break
                except:
                    tent+=1
            for h in range(1,4):
                compos = []
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight-1000);")
                pes = self.get_carregartext(f"/html/body/app-root/app-projection/section[3]/div[2]/projection-profile-card[{h}]/div/div[2]/p[1]",500).text
                esp = self.get_carregartext(f"/html/body/app-root/app-projection/section[3]/div[2]/projection-profile-card[{h}]/div/div[2]/p[2]",500).text
                oti = self.clicarCarregar(f"/html/body/app-root/app-projection/section[3]/div[2]/projection-profile-card[{h}]/div/div[2]/p[3]",500).text
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight / 2.4);")
                for i in range(1,6):
                    try: 
                        if(h == 1):
                            nomeComp = self.textClicarCarregar(f"/html/body/app-root/app-projection/section[2]/div[2]/projection-allocation[{i}]/mat-accordion/mat-expansion-panel/mat-expansion-panel-header/span[1]/mat-panel-title/div/div[1]/div[2]/span[1]",10)
                        else:
                            nomeComp = self.get_carregartext(f"/html/body/app-root/app-projection/section[2]/div[2]/projection-allocation[{i}]/mat-accordion/mat-expansion-panel/mat-expansion-panel-header/span[1]/mat-panel-title/div/div[1]/div[2]/span[1]",10).text
                        invest = []
                        j = 1
                        while True:
                            try:
                                invest.append([self.get_carregartext(f"/html/body/app-root/app-projection/section[2]/div[2]/projection-allocation[{i}]/mat-accordion/mat-expansion-panel/div/div/div/projection-allocation-product[{j}]/div/div[1]",100).text,self.get_carregartext(f"/html/body/app-root/app-projection/section[2]/div[2]/projection-allocation[{i}]/mat-accordion/mat-expansion-panel/div/div/div/projection-allocation-product[{j}]/div/div[2]/div[2]",100).text])                    
                                j += 1
                            except:
                                break
                    except:
                        break
                    compos.append([nomeComp,invest])
                    self.driver.execute_script(f"window.scrollTo(0, document.body.scrollHeight / 2.4 + {150*i});")
                self.perfis.append(perfilInvest(pes,esp,oti,compos))

        except:
            tipo_excecao, valor_excecao, traceback = sys.exc_info()
            print(f"Tipo de Exceção: {tipo_excecao}")
            print(f"Valor da Exceção: {valor_excecao}")
            print(f"Traceback: {traceback}")


site = CrawlerBTG()
site.get_Dados()
with open('lista_dados.json', 'w', encoding='utf-8') as arquivo:
    json.dump([perfil.dados for perfil in site.perfis], arquivo, indent=1, ensure_ascii=False)