/**
 * COMPARAÇÃO DE ÍNDICES HÍDRICOS NO PANTANAL
 * Autor: Matheus Augusto
 * E-mail: mataugusto1999@gmail.com
 * Ano: 2024
 * 
 * Descrição:
 * Script autoral de análise comparativa entre diferentes formulações de índices hídricos:
 * - NDWI (Gao, 1996): NIR e SWIR1
 * - NDWI (McFeeters, 1996): Green e NIR
 * - MNDWI (Xu, 2006): Green e SWIR1
 * - MNDWI2: Green e SWIR2 (Xu modificado / adaptado)
 * 
 * Avaliação realizada sobre cena Landsat 8 (Surface Reflectance - Collection 2)
 * durante o período de estiagem de 2023 no Pantanal, fundamentando a seleção do MNDWI2
 * para as análises temporais no LandTrendr.
 */

// 1. Definição da Área de Interesse (Geometria pequena no Pantanal)
var roi = ee.Geometry.Polygon([
  [[-56.6, -18.3], [-56.5, -18.3], [-56.5, -18.4], [-56.6, -18.4]]
]);

Map.centerObject(roi, 13);

// 2. Importação e seleção de UMA ÚNICA IMAGEM do Landsat 8
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(roi)
  .filterDate('2023-05-20', '2023-09-20') // Período de estiagem
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .sort('CLOUD_COVER'); // Ordena para garantir a imagem com menos nuvens

// Extrai apenas a primeira imagem da coleção e recorta para a geometria
var image = ee.Image(collection.first()).clip(roi);

// Imprime a data da imagem no console para referência
print('Data da imagem analisada:', image.date().format('YYYY-MM-dd'));

// Função para aplicar os fatores de escala para L8 SR
function applyScaleFactors(img) {
  var opticalBands = img.select('SR_B.').multiply(0.0000275).add(-0.2);
  return img.addBands(opticalBands, null, true);
}

// Aplica a escala na nossa única imagem
var imgScaled = applyScaleFactors(image);

// 3. Seleção das Bandas (Landsat 8)
var green = imgScaled.select('SR_B3');  // Verde [cite: 280]
var nir = imgScaled.select('SR_B5');    // Infravermelho Próximo (NIR)
var swir1 = imgScaled.select('SR_B6');  // SWIR 1
var swir2 = imgScaled.select('SR_B7');  // SWIR 2 [cite: 280]

// 4. Cálculo dos Índices

// A) NDWI (Gao, 1996) - NIR e SWIR 1 [cite: 174]
var ndwiGao = nir.subtract(swir1)
  .divide(nir.add(swir1))
  .rename('NDWI_Gao');

// B) NDWI (McFeeters, 1996) - Green e NIR [cite: 183]
var ndwiMcFeeters = green.subtract(nir)
  .divide(green.add(nir))
  .rename('NDWI_McFeeters');

// C) MNDWI (Xu, 2006) - Green e SWIR 1 [cite: 193]
var mndwiXu = green.subtract(swir1)
  .divide(green.add(swir1))
  .rename('MNDWI_Xu');

// D) MNDWI2 - Green e SWIR 2 [cite: 275, 276]
var mndwi2 = green.subtract(swir2)
  .divide(green.add(swir2))
  .rename('MNDWI2');

// 5. Parâmetros de Visualização
var visParamsRGB = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'], 
  min: 0.0, 
  max: 0.15
};

// Paleta padronizada (Vermelho/Laranja = não-água; Azul = água)
var visParamsIndex = {
  min: -1, 
  max: 1, 
  palette: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4']
};

// 6. Adição das camadas no mapa interativo
Map.addLayer(roi, {color: 'red'}, 'Limite da ROI', false);
Map.addLayer(imgScaled, visParamsRGB, 'Cor Verdadeira', false);

Map.addLayer(ndwiGao, visParamsIndex, 'NDWI Gao (NIR/SWIR1)', false);
Map.addLayer(ndwiMcFeeters, visParamsIndex, 'NDWI McFeeters (Green/NIR)', false);
Map.addLayer(mndwiXu, visParamsIndex, 'MNDWI Xu (Green/SWIR1)', false);
Map.addLayer(mndwi2, visParamsIndex, 'MNDWI2 (Green/SWIR2)', true);

// 7. Exportação das imagens para o Google Drive

// Agrupa os 4 índices em uma única imagem de múltiplas bandas
var indicesMultibanda = ee.Image([ndwiGao, ndwiMcFeeters, mndwiXu, mndwi2]);

// Define a tarefa de exportação para o Google Drive
Export.image.toDrive({
  image: indicesMultibanda,
  description: 'Indices_Hidricos_Pantanal_Comparacao', // Nome da tarefa
  folder: 'GEE_Exports',                               // Pasta que será criada no seu Drive
  region: roi,                                         // Limita a exportação à sua geometria
  scale: 30,                                           // Resolução nativa de 30 metros do Landsat
  crs: 'EPSG:4326',                                    // Sistema de coordenadas (WGS84)
  maxPixels: 1e10                                      // Prevenção contra estouro de limite de pixels
});

// Opcional: Exportar também a imagem em cor verdadeira (RGB) para compor o mapa
Export.image.toDrive({
  image: imgScaled.select(['SR_B4', 'SR_B3', 'SR_B2']),
  description: 'Landsat8_RGB_Pantanal',
  folder: 'GEE_Exports',
  region: roi,
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1e10
});