// --- IMPORTAÇÃO ---
var ltgee = require('users/mataugusto1999/TCC:LandTrendrCustom.js');
var pontos_mudanca = ee.FeatureCollection("projects/ee-mattaugustt/assets/mudou_pantanal");

// IMPORTAÇÃO RASTER RECLASSIFICADO MUDANÇA/NÃO MUDANÇA
var img = ee.Image("projects/ee-mattaugustt/assets/validacao_teste");

var startYear = 1980;
var endYear   = 2024;
var startDay  = '05-20';
var endDay    = '09-20';
var index     = 'MNDWI2';
var maskThese = ['cloud', 'shadow', 'snow'];

var runParams = { 
  maxSegments:            3,
  spikeThreshold:         1.0,
  vertexCountOvershoot:   3,
  preventOneYearRecovery: true,
  recoveryThreshold:      0.25,
  pvalThreshold:          0.05,
  bestModelProportion:    0.75,
  minObservationsNeeded:  6 
};

// --- AMOSTRAGEM DE 5 PONTOS ALEATÓRIOS ---
var cinco_pontos = pontos_mudanca.randomColumn('rand').sort('rand').limit(5);

// --- VISUALIZAÇÃO BASE NO MAPA ---
Map.centerObject(cinco_pontos, 10);
Map.addLayer(img, {min: 1, max: 2, palette: ['black', 'yellow']}, 'Imagem validação');
Map.addLayer(pontos_mudanca, {color: 'blue'}, 'Todos os pontos', false);

// --- PROCESSAMENTO ---
var lista_pontos = cinco_pontos.toList(5);

// Criamos uma função isolada para processar cada ponto.
// Isso "trava" o valor de 'i' para que a numeração não se perca no processo assíncrono.
var processaPonto = function(i) {
  var feature = ee.Feature(lista_pontos.get(i));
  var pt = feature.geometry();
  var numPonto = i + 1;

  // Adiciona o ponto individualmente no mapa com o nome numerado na aba "Layers"
  Map.addLayer(pt, {color: 'red'}, 'Ponto ' + numPonto);

  // Executa a segmentação
  var lt = ltgee.runLT(startYear, endYear, startDay, endDay, pt, index, [], runParams, maskThese);

  // Extração direta dos dados da imagem LandTrendr
  var dict = lt.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: pt,
    scale: 30,
    maxPixels: 1e9
  }).get('LandTrendr');

  // Processamento do gráfico
  dict.evaluate(function(data, error) {
    if (error) {
      print("Erro ao extrair Ponto " + numPonto + ":", error);
      return;
    }
    
    if (data) {
      var anos = data[0];
      var original_invertido = data[1]; 
      var fitted_invertido = data[2];
      
      var tabela = [['Ano', 'Original (MNDWI2)', 'Fitted (MNDWI2)']];
      
      for (var j = 0; j < anos.length; j++) {
        // Multiplicamos por -1 para desfazer a inversão interna do módulo 
        // e mostrar o MNDWI2 no seu formato natural
        tabela.push([
          anos[j], 
          original_invertido[j] * -1, 
          fitted_invertido[j] * -1
        ]);
      }
      
      var chart = ui.Chart(tabela, 'LineChart', {
        // O título reflete corretamente o número do ponto iterado
        title: 'Trajetória MNDWI2 Natural - Ponto ' + numPonto, 
        hAxis: {title: 'Ano', format: '####'},
        vAxis: {title: 'Índice MNDWI2'},
        lineWidth: 2,
        pointSize: 3,
        series: {
          0: {color: 'blue'}, // Original
          1: {color: 'red'}   // Fitted
        }
      });
      print(chart);
    }
  });
};

// --- EXECUÇÃO DO LOOP ---
for (var i = 0; i < 5; i++) {
  processaPonto(i);
}
