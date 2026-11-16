# Pantanal_LTGEE_MNDWI2

Mapeamento e monitoramento da dinâmica hídrica histórica no bioma Pantanal (1984–2024) utilizando o algoritmo **LandTrendr** (Landsat-based Detection of Trends in Disturbance and Recovery) adaptado para o índice espectral **MNDWI2** e desenho amostral estratificado no **Google Earth Engine (GEE)**.

* **Autor:** Matheus Augusto
* **Contato:** [mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)

---

## 📌 Contexto e Objetivos

O Pantanal é a maior planície de inundação contínua do planeta, caracterizada por regimes de pulso de inundação sazonais e plurianuais com alta variabilidade hidrológica. O monitoramento contínuo da cobertura de água e a identificação de trajetórias de dessecação ou perda de lâmina d'água ao longo de décadas exigem abordagens temporais robustas e desenho amostral estatisticamente rigoroso.

Este repositório reúne scripts desenvolvidos e customizados no Google Earth Engine para:
1. **Adaptar o algoritmo LandTrendr** para operar com novos índices espectrais (com destaque para o **MNDWI2** - Green e SWIR2, além de NDBI, UI, NDWI1 e NDWI2), permitindo a detecção de tendências de perda e recuperação hídrica de longo prazo.
2. **Executar o mapeamento de maiores distúrbios hídricos (Greatest Disturbance Mapping)** em uma série temporal de 40 anos (1984–2024), restringindo a análise aos períodos anuais de estiagem (20 de maio a 20 de setembro).
3. **Avaliar e validar temporalmente as alterações** por meio de um inspetor interativo de séries temporais com múltiplas janelas, confrontando pontos amostrais e rasters reclassificados com a resposta histórica espectral.
4. **Extrair trajetórias temporais pontuais** para inspecionar o ajuste do LandTrendr (*original* vs. *fitted*) em pontos amostrais de mudança.
5. **Desenhar amostragem aleatória estratificada (AREA2)** segundo as "Boas Práticas" (Olofsson et al., 2014; Cochran, 2007) para estimativa de área e validação da acurácia temática no Pantanal.
6. **Comparar o desempenho de diferentes formulações de índices hídricos** (NDWI McFeeters, NDWI Gao, MNDWI Xu e MNDWI2) para fundamentar a escolha do índice ideal na diferenciação de corpos d'água no Pantanal.

---

## 👥 Créditos e Códigos de Origem

Este repositório contém códigos adaptados a partir de ferramentas e bibliotecas consolidadas da comunidade de sensoriamento remoto, além de scripts autorais:

### 1. LandTrendr no Google Earth Engine (LT-GEE)
* **Repositório Original:** [https://github.com/emapr/lt-gee](https://github.com/emapr/lt-gee)
* **Autores Originais:** Justin Braaten, Zhiqiang Yang, Robert Kennedy (Oregon State University / USDA Forest Service / Google)
* **Documentação Oficial:** [https://emapr.github.io/LT-GEE/](https://emapr.github.io/LT-GEE/)
* **Licença:** Apache License 2.0
* **Arquivos Adaptados no Projeto:**
  * `LandTrendrCustom.js` (adaptação do módulo central `LandTrendr.js`)
  * `LTGEE_Pantanal.js` (adaptação do script de exemplo *Greatest Disturbance Mapping*)

### 2. Landsat & Sentinel-2 Time Series Viewer
* **Repositório Original:** [https://github.com/hyinhe/GEE-codes/blob/master/Landsat_Sentinel_2_time_series_viewer.js](https://github.com/hyinhe/GEE-codes/blob/master/Landsat_Sentinel_2_time_series_viewer.js)
* **Autor Original:** He Yin (`hyinhe@gmail.com`, 2018)
* **Contribuição Intermediária:** Pedro de Castro (`pbastosd@gmail.com`, 2021)
* **Arquivo Adaptado no Projeto:**
  * `TimeSeriesInspector_Pantanal.js`

### 3. AREA2 (Area Estimation and Accuracy Assessment)
* **Documentação Oficial:** [https://area2.readthedocs.io/](https://area2.readthedocs.io/)
* **Autores Originais:** Eric Bullock, Pontus Olofsson (2019)
* **Fundamentação Teórica:** Olofsson et al. (2014); Cochran (2007)
* **Arquivo Adaptado no Projeto:**
  * `Area2_adaptado.js`

---

## 🔬 Comparativo de Índices: Original vs. Customizado (`LandTrendrCustom.js`)

A partir da análise comparativa direta entre o `LandTrendr.js` original do eMapR ([eMapR/LT-GEE](https://github.com/emapr/lt-gee)) e o módulo `LandTrendrCustom.js`, foram identificados os seguintes **novos índices implementados por Matheus Augusto**:

| Índice | Nome Completo | Bandas Utilizadas (Landsat 5/7) | Função Implementada | Orientação (`indexFlip`) | Finalidade Principal |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **NDBI** | *Normalized Difference Built-up Index* | $(\text{SWIR1} - \text{NIR}) / (\text{SWIR1} + \text{NIR})$ $\rightarrow$ $(\text{B5} - \text{B4}) / (\text{B5} + \text{B4})$ | `ndbiTransform` | `-1` | Áreas urbanas, construídas e solo seco |
| **UI** | *Urban Index* | $(\text{SWIR2} - \text{NIR}) / (\text{SWIR2} + \text{NIR})$ $\rightarrow$ $(\text{B7} - \text{B4}) / (\text{B7} + \text{B4})$ | `uiTransform` | `-1` | Mapeamento e separação de alvos urbanos |
| **NDWI1** | *Water Index 1* (McFeeters, 1996) | $(\text{Green} - \text{NIR}) / (\text{Green} + \text{NIR})$ $\rightarrow$ $(\text{B2} - \text{B4}) / (\text{B2} + \text{B4})$ | `ndwiTransform1` | `-1` | Realce de água aberta superficial |
| **NDWI2** | *Water Index 2* (Gao, 1996) | $(\text{NIR} - \text{SWIR2}) / (\text{NIR} + \text{SWIR2})$ $\rightarrow$ $(\text{B4} - \text{B7}) / (\text{B4} + \text{B7})$ | `ndwiTransform2` | `-1` | Sensibilidade ao teor de água na cobertura |
| **MNDWI2** | *Modified NDWI 2* (Xu, 2006 mod.) | $(\text{Green} - \text{SWIR2}) / (\text{Green} + \text{SWIR2})$ $\rightarrow$ $(\text{B2} - \text{B7}) / (\text{B2} + \text{B7})$ | `mndwiTransform` | `-1` | Discriminação superior de lâminas d'água no Pantanal |

### Modificações Estruturais no Código do LandTrendr:
1. **Rotina de Transformação (`ndfiTransform`):** Inclusão do cálculo de `ndbi`, `iu` (UI), `ndwi1`, `ndwi2` e `mndwi2` anexados às bandas exportadas em `toExp`.
2. **Criação de Funções Próprias:** Definição das funções de transformação individuais escaladas por 1000 para preservar precisão em inteiros de 16 bits.
3. **Despachante de Índices (`calcIndex`):** Adição dos blocos `case` para cada um dos 5 novos índices.
4. **Sentido do Sinal (`indexFlipper`):** Definição do valor `-1` para todos os 5 novos índices, garantindo que eventos de perda hídrica ou retração de áreas úmidas sejam processados de maneira padronizada como perturbação (*loss*).
5. **Interface Gráfica (`indexSelectPanel`):** Inclusão dos novos índices na lista de seleção gráfica (`indexList`).

---

## 📂 Estrutura do Repositório

```text
├── Area2_adaptado.js                # [Adaptado de AREA2] Amostragem aleatória estratificada segundo boas práticas (Olofsson et al., 2014)
├── Comparacao_IndicesHidricos.js    # [Autoral] Comparação espectral entre NDWI Gao, NDWI McFeeters, MNDWI Xu e MNDWI2
├── LT_TimeSeries.js                 # [Autoral] Amostragem pontual e inspeção gráfica das trajetórias LandTrendr
├── LandTrendrCustom.js              # [Adaptado de LT-GEE] Módulo LandTrendr com suporte a MNDWI2, NDBI, UI, NDWI1 e NDWI2
├── LTGEE_Pantanal.js                # [Adaptado de LT-GEE] Aplicação do LandTrendr para mapeamento de mudanças hídricas no Pantanal
├── TimeSeriesInspector_Pantanal.js  # [Adaptado de He Yin] Inspetor visual interativo com MNDWI2 e validação por pontos
└── README.md                        # Documentação do projeto
```

---

## 🛠️ Detalhamento dos Scripts

### 1. `Area2_adaptado.js` *(Adaptado)*
* **Base Original:** [AREA2](https://area2.readthedocs.io/) (Eric Bullock e Pontus Olofsson).
* **Adaptação:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Interface gráfica (GUI) no GEE para desenho e alocação de amostragem probabilística estratificada com base nas equações de Cochran (2007) e nas recomendações de "Boas Práticas" de Olofsson et al. (2014).
* **Adaptações Principais:**
  - Carregamento e corte espacial automático pelo limite do Pantanal (`IMAGE = IMAGE.clip(pantanal)`), garantindo que os estratos e amostras fiquem confinados ao bioma.
  - Extração explícita das coordenadas geográficas (`lat` e `lon`) em cada ponto amostrado (`coords.get(1)` e `coords.get(0)`).
  - Exportação dupla automatizada: tabela em formato CSV para o Google Drive e FeatureCollection diretamente para Asset no Earth Engine.

### 2. `LandTrendrCustom.js` *(Adaptado)*
* **Base Original:** [eMapR/LT-GEE](https://github.com/emapr/lt-gee) (`LandTrendr.js` v0.2.0).
* **Adaptação:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Módulo de biblioteca do algoritmo LandTrendr expandido para incorporar suporte nativo a 5 novos índices espectrais (NDBI, UI, NDWI1, NDWI2 e MNDWI2), com funções de escalonamento ($\times 1000$), inversão de sinal no `indexFlipper` e integração na UI.

### 3. `LTGEE_Pantanal.js` *(Adaptado)*
* **Base Original:** [eMapR/LT-GEE](https://github.com/emapr/lt-gee) (*LandTrendr Greatest Disturbance Mapping*).
* **Adaptação:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Executa o algoritmo LandTrendr utilizando o módulo customizado `LandTrendrCustom.js` para mapear a maior retração hídrica histórica no Pantanal (`delta: 'loss'`, `mag > 200`) em 40 anos de imagens Landsat (1984–2024), aplicando filtro de estiagem ('05-20' a '09-20'). Gera exportações vetoriais (Shapefile), tabulares por amostragem (CSV) e matriciais em SIRGAS 2000 (`EPSG:4674`).

### 4. `TimeSeriesInspector_Pantanal.js` *(Adaptado)*
* **Base Original:** [hyinhe/GEE-codes](https://github.com/hyinhe/GEE-codes/blob/master/Landsat_Sentinel_2_time_series_viewer.js) (He Yin; modificado por Pedro de Castro).
* **Adaptação:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Aplicativo interativo multijanela com centralização espacial no Pantanal, cálculo multissensor do índice MNDWI2 para Landsat 4/5/7, Landsat 8 e Sentinel-2, integração com pontos unificados de validação de campo (Classe 1 = Mudou, Classe 2 = Não Mudou), sobreposição do raster reclassificado de validação e plotagem de séries temporais históricas (1985–2024) por clique no pixel.

### 5. `Comparacao_IndicesHidricos.js` *(Código Autoral)*
* **Autor:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Script desenvolvido para subsidiar a escolha metodológica do índice mais sensível às feições aquáticas do Pantanal. Compara de forma simultânea quatro formulações de índices hídricos (NDWI Gao 1996, NDWI McFeeters 1996, MNDWI Xu 2006 e MNDWI2 Xu modificado) em cena Landsat 8 durante estiagem crítica (2023), gerando visualizações e exportação multibanda para o Google Drive.

### 6. `LT_TimeSeries.js` *(Código Autoral)*
* **Autor:** Matheus Augusto ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)).
* **Resumo:** Realiza a amostragem de pontos de mudança no Pantanal e executa a segmentação temporal do LandTrendr (`runLT`) via `LandTrendrCustom.js`. Reverte a inversão interna de sinal do MNDWI2 ($\times -1$) para exibir os gráficos no formato natural do índice, permitindo inspecionar o ajuste da série observada contra a trajetória segmentada (*fitted*).

---

## 🌊 Por que o MNDWI2 ($\text{Green}$ e $\text{SWIR2}$)?

Na literatura tradicional de sensoriamento remoto, o MNDWI proposto por Xu (2006) utiliza o $\text{SWIR1}$ ($\approx 1.57 - 1.65\,\mu m$). No entanto, para o bioma Pantanal, a substituição pelo canal $\text{SWIR2}$ ($\approx 2.11 - 2.29\,\mu m$) demonstrou vantagens técnicas:
* **Maior coeficiente de absorção da água:** A água apresenta absorção quase total no infravermelho de ondas curtas mais longo ($\text{SWIR2}$), resultando em valores de refletância próximos a zero.
* **Redução de confusão espectral:** Durante o período de estiagem no Pantanal, a abundância de biomassa vegetal seca/senescente e solos arenosos expostos gera reflectâncias elevadas que, no $\text{SWIR1}$, podem se sobrepor a lâminas d'água rasas ou túrbidas. O $\text{SWIR2}$ propicia maior contraste espectral na interface terra-água.

---

## 🚀 Como Executar no Google Earth Engine

1. **Acesso ao Earth Engine:** Certifique-se de possuir uma conta ativa no [Google Earth Engine](https://earthengine.google.com/).
2. **Importação dos Módulos:**
   - Faça o upload de `LandTrendrCustom.js` como um módulo no repositório de scripts do seu usuário (ex.: `users/<seu_usuario>/<pasta>:LandTrendrCustom.js`).
   - Atualize a linha de importação nos scripts:
     ```javascript
     var ltgee = require('users/<seu_usuario>/<pasta>:LandTrendrCustom.js');
     ```
3. **Ativos (Assets):**
   - Substitua os caminhos dos assets das geometrias e pontos amostrais para os seus respectivos arquivos:
     - Limite do Pantanal: `projects/.../assets/Pantanal`
     - Pontos de validação: `projects/.../assets/pontos_novos_validacao_pantanal`
4. **Execução:** Copie e cole os scripts no *Earth Engine Code Editor* e clique em **Run**. Acompanhe os gráficos e inicie as tarefas de exportação na aba **Tasks**.

---

## 📜 Licença

* As partes adaptadas do **LT-GEE** respeitam a [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
* As partes adaptadas do código de **He Yin** mantêm as atribuições originais conforme compartilhadas publicamente pela comunidade acadêmica.
* As partes adaptadas do **AREA2** mantêm os créditos a Eric Bullock e Pontus Olofsson ([https://area2.readthedocs.io/](https://area2.readthedocs.io/)).
* Os acréscimos, adaptações para o Pantanal e scripts autorais desenvolvidos por **Matheus Augusto** ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)) são disponibilizados para fins de pesquisa, ensino e monitoramento ambiental.
