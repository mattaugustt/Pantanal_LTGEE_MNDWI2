//definir o Roi na área de estudos;
//######################################################################################################## 
//#                                                                                                    #\\
//#                           LANDTRENDR GREATEST DISTURBANCE MAPPING                                  #\\
//#                                                                                                    #\\
//########################################################################################################


// date: 2018-10-07
// author: Justin Braaten | jstnbraaten@gmail.com
//         Zhiqiang Yang  | zhiqiang.yang@oregonstate.edu
//         Robert Kennedy | rkennedy@coas.oregonstate.edu
// parameter definitions: https://emapr.github.io/LT-GEE/api.html#getchangemap
// website: https://github.com/eMapR/LT-GEE
// notes: 
//   - you must add the LT-GEE API to your GEE account to run this script. 
//     Visit this URL to add it:
//     https://code.earthengine.google.com/?accept_repo=users/emaprlab/public
//   - use this app to help parameterize: 
//     https://emaprlab.users.earthengine.app/view/lt-gee-change-mapper


//##########################################################################################
// START INPUTS
//##########################################################################################

//var pantanal = ee.FeatureCollection("projects/ee-mattaugustt/assets/subregioes_pantanal");

var pantanal = ee.FeatureCollection("projects/ee-mattaugustt/assets/Pantanal");

//exportando o shape
Export.table.toDrive({
  collection: pantanal,
  description: 'area_estudo_pantanal',
  folder: 'TCC',
  fileFormat: 'SHP'
});

// define collection parameters
var startYear = 1984;
var endYear = 2024;
var startDay = '05-20';
var endDay = '09-20';
var index = 'MNDWI2';  
//NDWI1 (McFeeters, 1996), NDWI2 (Gao, 1996) e MNDWI2 (Xu, 2006)
var maskThese = ['cloud', 'shadow'];


// define landtrendr parameters
var runParams = { 
  maxSegments:            3,
  spikeThreshold:         1.0,
  vertexCountOvershoot:   3,
  preventOneYearRecovery: true, //prevenir recuperação
  recoveryThreshold:      0.25,
  pvalThreshold:          0.05,
  bestModelProportion:    0.75,
  minObservationsNeeded:  15
};


// define change parameters
var changeParams = {
  delta:  'loss', //perda do índice
  sort:   'greatest',
  year:   {checked:true, start:1984, end:2024},
  mag:    {checked:true, value:200,  operator:'>'},
  dur:    {checked:false, value:4,    operator:'<'},
  preval: {checked:false, value:300,  operator:'>'},
  mmu:    {checked:false, value:11},
  
};

//##########################################################################################
// END INPUTS
//##########################################################################################

// load the LandTrendr.js module
//var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js'); 
var ltgee = require('users/mataugusto1999/TCC:LandTrendrCustom.js');

//tentar adicionar o indice ndbi aqui! e colocar como índice;


// add index to changeParams object
changeParams.index = index;

// run landtrendr
var lt = ltgee.runLT(startYear, endYear, startDay, endDay, pantanal, index, [], runParams, maskThese);

// get the change map layers
var changeImg = ltgee.getChangeMap(lt, changeParams);

//recortando para o municipio:


// set visualization dictionaries
var palette = ["25ff00","fffa0e","ff2c14"];
var yodVizParms = {
  min: startYear,
  max: endYear,
  palette: palette
};

var magVizParms = {
  min: 100,  //
  max: 1000,
  palette: palette
};

var area_mudanca = changeImg.clip(pantanal);

// display the change attribute map - note that there are other layers - print changeImg to console to see all
Map.centerObject(pantanal, 7);
Map.addLayer(pantanal, {color: 'LightSteelBlue'}, 'Pantanal', false);
Map.addLayer(area_mudanca.select(['mag']), magVizParms, 'Mag. Área de Estudos');
Map.addLayer(area_mudanca.select(['yod']), yodVizParms, 'Yod. Área de Estudos', false);
Map.addLayer(changeImg.select(['mag']), magVizParms, 'Magnitude of Change', false);
//Map.addLayer(changeImg.select(['yod']), yodVizParms, 'Year of Detection');


var bandas = area_mudanca.bandNames(); // Lista com os nomes das bandas

// Loop para exportar cada banda individualmente
bandas.evaluate(function(lista) { 
  lista.forEach(function(nomeBanda) {
    var bandaSelecionada = area_mudanca.select(nomeBanda); // Seleciona a banda atual
    
    var sampled = bandaSelecionada.sample({
      region: pantanal.geometry(),
      scale: 30,
      geometries: true
    });

    Export.table.toDrive({
      collection: sampled,
      description: "landtrendr_" + nomeBanda, // Nome do arquivo
      fileFormat: "CSV"
    });
  });
});


// export change data to google drive
// mudanças na área de estudo
// var exportImg = changeImg.clip(area).unmask(0).short();
// Export.image.toDrive({
//   image: exportImg, 
//   description: 'lt_Area_Estudos', 
//   folder: 'TCC', 
//   fileNamePrefix: 'lt_Area_Estudos_NDBI', 
//   region: area, 
//   scale: 30, 
//   crs: 'EPSG:4674', 
//   maxPixels: 1e13
// });

var exportImg = changeImg.clip(pantanal).unmask(0).short();
Export.image.toDrive({
  image: exportImg, 
  description: 'lt_Area_Estudos', 
  folder: 'TCC', 
  fileNamePrefix: 'lt_pantanal_MNDWI', 
  region: pantanal, 
  scale: 30, 
  crs: 'EPSG:4674', 
  maxPixels: 1e13
});


var bands = area_mudanca.select(['mag']);

// // Contar o número de pixels na imagem
// var pixelCount = bands.reduceRegion({
//   reducer: ee.Reducer.count(),
//   geometry: pantanal,
//   scale: 30,  // Escala em metros (ajuste de acordo com a resolução da imagem)
//   maxPixels: 1e13
// });


// // Exibir o resultado
// print('Número total de pixels (Área de Estudo):', pixelCount.get('mag'));


// Calcular a área da geometria da FeatureCollection
var area_real = pantanal.geometry().area();

// Converter a área para quilômetros quadrados (opcional)
var areaKm2 = area_real.divide(1e6);

// Imprimir o resultado
print('Área em metros quadrados:', area_real);
print('Área em quilômetros quadrados:', areaKm2);