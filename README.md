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

## 🌊 Fundamentação Teórica: Seleção do Índice Espectral (MNDWI2) e Análise de Tendências

A seleção do índice espectral adotado neste estudo fundamenta-se na evolução dos índices de sensoriamento remoto de corpos hídricos e na análise comparativa de suas respostas físicas, conforme sintetizado a seguir:

### 1. Evolução Metodológica dos Índices de Água

* **NDWI de Gao (1996):**
  $$\text{NDWI}_{\text{Gao}} = \frac{\rho_{\text{NIR}} - \rho_{\text{SWIR}}}{\rho_{\text{NIR}} + \rho_{\text{SWIR}}}$$
  Proposto especificamente para estimar a água líquida contida na vegetação (turgidez foliar e estresse hídrico do dossel). A reflectância no infravermelho de ondas curtas (SWIR) responde ao conteúdo interno de água das folhas, enquanto o infravermelho próximo (NIR) é governado pela estrutura do mesofilo foliar. Como não foi concebido para feições aquáticas em superfícies abertas e não elimina a reflectância do solo de fundo, sua aplicação é restrita a estudos fisiológicos da cobertura vegetal.

* **NDWI de McFeeters (1996):**
  $$\text{NDWI}_{\text{McFeeters}} = \frac{\rho_{\text{Green}} - \rho_{\text{NIR}}}{\rho_{\text{Green}} + \rho_{\text{NIR}}}$$
  Desenvolvido para delinear corpos d'água abertos explorando a premissa de que a água absorve intensamente no NIR e apresenta maior reflectância no Verde. Embora realce corpos hídricos com valores positivos, o NDWI clássico apresenta limitações severas em paisagens heterogêneas: superfícies urbanizadas, solos expostos secos e vegetação senescente frequentemente geram valores positivos, resultando em ruídos de fundo e confusão espectral.

* **MNDWI de Xu (2006):**
  $$\text{MNDWI}_{\text{Xu}} = \frac{\rho_{\text{Green}} - \rho_{\text{SWIR1}}}{\rho_{\text{Green}} + \rho_{\text{SWIR1}}}$$
  Xu (2006) introduziu a substituição da banda NIR pelo canal SWIR ($\approx 1.57 - 1.65\,\mu m$). Como construções e solos expostos refletem muito mais intensamente no SWIR do que no NIR, superfícies não aquáticas passam a assumir valores significativamente negativos no MNDWI, enquanto os corpos d'água retêm valores positivos destacados. Isso ampliou drasticamente a separabilidade de alvos.

| Índice | Autor(es) | Bandas Espectrais | Objetivo Principal | Limitação Principal |
| :--- | :--- | :--- | :--- | :--- |
| **NDWI** | Gao (1996) | NIR e SWIR | Monitoramento do conteúdo de água líquida na vegetação (estresse hídrico). | Não é específico para corpos d'água abertos; inclui reflectância de solo. |
| **NDWI** | McFeeters (1996) | Green e NIR | Delimitação e realce de corpos d'água abertos. | Apresenta ruídos em áreas construídas e solos expostos (confusão espectral). |
| **MNDWI** | Xu (2006) | Green e SWIR1 | Realce de água em ambientes heterogêneos e supressão de ruídos terrestres. | Dependência da resolução espectral/espacial do sensor na banda SWIR. |
| **MNDWI2** | Xu (2006) adaptado | Green e SWIR2 | Máxima absorção hídrica e sensibilidade a lâminas rasas no Pantanal. | Hipótese avaliada por trajetórias temporais e validação temática. |

---

### 2. A Escolha do MNDWI2 ($\text{Green}$ e $\text{SWIR2}$) no Bioma Pantanal

No Pantanal, a substituição da banda SWIR 1 pela SWIR 2 ($\approx 2.11 - 2.29\,\mu m$) — originando a formulação **MNDWI2**:
$$\text{MNDWI2} = \frac{\rho_{\text{Green}} - \rho_{\text{SWIR2}}}{\rho_{\text{Green}} + \rho_{\text{SWIR2}}}$$
fundamenta-se na **maior capacidade de absorção da radiação pela água nessa faixa espectral**, uma vez que o SWIR 2 exibe coeficientes de absorção hídrica consideravelmente mais elevados do que o SWIR 1.

No contexto pantaneiro, essa escolha é adotada como **hipótese metodológica** para ampliar a sensibilidade às variações sutis do conteúdo hídrico superficial, sobretudo durante a estiagem, quando ocorre a transição entre superfícies saturadas, lâminas d'água rasas/túrbidas e solos dessecados com biomassa seca. O script [`Comparacao_IndicesHidricos.js`](file:///c:/Users/matta/Desktop/Pantanal_LTGEE_MNDWI2/Comparacao_IndicesHidricos.js) foi desenhado justamente para evidenciar visual e quantitativamente essas distinções entre os quatro índices em uma mesma cena Landsat no bioma.

---

### 3. Inviabilidade de Limiares Fixos (*Thresholds*) e a Vantagem da Abordagem Temporal (LandTrendr)

Apesar da eficácia do MNDWI, a literatura internacional recente comprova que **a definição de um limiar estático de corte (*threshold*, como o teórico valor 0) é inviável em áreas úmidas complexas**:

| Autores (Ano) | Área de Estudo | Sensor / Satélite | Limiar (*Threshold*) Encontrado |
| :--- | :--- | :--- | :---: |
| **PENA-REGUEIRO et al. (2023)** | Tablas de Daimiel (Espanha) | TM (Landsat 5)<br>OLI (Landsat 8) | $-0,15$<br>$-0,25$ |
| **OGILVIE et al. (2020)** | Rio Senegal (África) | ETM+ (Landsat 7)<br>OLI (Landsat 8) | $-0,16$ a $0,09$<br>$0,08$ a $0,24$ |

Fatores como vegetação submersa, macrófitas, turbidez, profundidade da coluna d'água e discrepâncias radiométricas entre diferentes gerações de sensores (TM, ETM+, OLI) fazem com que os valores ótimos de separação oscilem fortemente (inclusive adentrando faixas negativas em áreas alagadas).

**Por que o LandTrendr é a solução ideal para este problema?**
A aplicação de limiares fixos em séries temporais multidecadais (40 anos) introduziria graves distorções e vieses (subestimando ou superestimando a água conforme o satélite e a estação). Em contrapartida, o algoritmo **LandTrendr não depende de limiares fixos de corte em imagens individuais**: ele modela a **trajetória espectral contínua do pixel** ao longo de quatro décadas, decompondo-a em segmentos lineares e identificando a magnitude e o ano de início de perturbações consistentes (`delta: 'loss'`, `mag > 200`). Isso garante robustez contra flutuações radiométricas interanuais e captura de forma fidedigna a dessecação e os pulsos hídricos no Pantanal.

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

## 📚 Referências Bibliográficas

* **Cochran, W. G.** (2007). *Sampling techniques*. John Wiley & Sons.
* **Gao, B. C.** (1996). NDWI—A normalized difference water index for remote sensing of vegetation liquid water from space. *Remote Sensing of Environment*, 58(3), 257-266.
* **Kennedy, R. E., Yang, Z., & Cohen, W. B.** (2010). Detecting trends in forest disturbance and recovery using yearly Landsat time series: 1. LandTrendr—Temporal segmentation algorithms. *Remote Sensing of Environment*, 114(12), 2897-2910.
* **McFeeters, S. K.** (1996). The use of the Normalized Difference Water Index (NDWI) in the delineation of open water features. *International Journal of Remote Sensing*, 17(7), 1425-1432.
* **Ogilvie, A., et al.** (2020). Multi-sensor normalized difference water index thresholding for water body extraction in floodplains. *Remote Sensing*, 12(18), 3020.
* **Olofsson, P., Foody, G. M., Herold, M., Stehman, S. V., Woodcock, C. E., & Wulder, M. A.** (2014). Good practices for estimating area and assessing accuracy of land change. *Remote Sensing of Environment*, 148, 42-57.
* **Pena-Regueiro, J., et al.** (2023). Reconstructing long-term inundation dynamics in complex wetlands using Landsat time series and dynamic thresholds. *Journal of Hydrology*, 617, 129035.
* **Xu, H.** (2006). Modification of normalised difference water index (MNDWI) to enhance open water features in remotely sensed imagery. *International Journal of Remote Sensing*, 27(14), 3025-3033.

---

## 📜 Licença

* As partes adaptadas do **LT-GEE** respeitam a [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
* As partes adaptadas do código de **He Yin** mantêm as atribuições originais conforme compartilhadas publicamente pela comunidade acadêmica.
* As partes adaptadas do **AREA2** mantêm os créditos a Eric Bullock e Pontus Olofsson ([https://area2.readthedocs.io/](https://area2.readthedocs.io/)).
* Os acréscimos, adaptações para o Pantanal e scripts autorais desenvolvidos por **Matheus Augusto** ([mataugusto1999@gmail.com](mailto:mataugusto1999@gmail.com)) são disponibilizados para fins de pesquisa, ensino e monitoramento ambiental.
