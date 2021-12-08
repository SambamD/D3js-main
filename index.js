var width = 700,
    height = 580;

var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// On rajoute un groupe englobant toute la visualisation pour plus tard
var g = svg.append("g");

// Tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr('class', "hidden tooltip");

// Autres projections : geoMercator, geoNaturalEarth1, ...
// https://github.com/d3/d3-geo/blob/master/README.md
var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2800);

// On definie une echelle de couleur
// via https://observablehq.com/@d3/color-schemes?collection=@d3/d3-scale-chromatic
var color = d3
    .scaleQuantize()
    .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);

var path = d3.geoPath().projection(projection);

var jourChoisi = "2021-09-12"
// Chargement des donnees
d3.csv("covid-06-11-2021.csv").then(function (data) {
    //Set input domain for color scale
    color.domain([
        d3.min(data, function (d) {
            return d.hosp;
        }),
        d3.max(data, function (d) {

            return d.hosp;

        })
    ]);

    var cleanData = data.filter(d => d.sexe == "0")
    //console.log(cleanData)

    d3.json("departements-version-simplifiee.geojson").then(function (json) {
        //On fusionne les donnees avec le GeoJSON

        // On parcours les départements du GeoJSON un par un
        for (var j = 0; j < json.features.length; j++) {

            var departement = json.features[j].properties.code;

            var jourDepchoisi = cleanData.find(row => (row.jour == jourChoisi && row.dep == departement));
            var depchoisi = cleanData.filter(row => row.dep == departement)
            console.log(depchoisi)
            // console.log(jourDepchoisi)
            json.features[j].properties.value = depchoisi[j].hosp
            console.log("#########")
            //console.log(jourDepchoisi)
        }
        //3. Affichage des données d'une journée

        for (var i = 0; i < data.length; i++) {

            var jour = data[i].jour;
            // console.log(jour)

            var hosps = data[i].hosp;

            //  console.log(hosps)
        }

        //###############################################Fonction##############################################################
        // 7- Fonction d'affichage de données
        function drawMap(currentDay) {
            // On parcours les départements du GeoJSON un par un
            for (var j = 0; j < json.features.length; j++) {
                // console.log(jourDepchoisi)
                var jourChoisi = cleanData.filter(row => row.jour == currentDay)
                json.features[j].properties.value = jourChoisi[j].hosp
                console.log("#########")
                //console.log(jourDepchoisi)
            }


            d3.select("#slider").on("input", function() {
                drawMap(+this.value);
            });

            d3.select('#day').html("Semaine : " + (Math.floor(this.value/7)+1));

            carte = svg.selectAll("path").data(json.features);
            
            d3.select('#day').html( valeur de la semaine selectionnée );
            carte.join("path")
                .attr("class", "enter")
                .attr("d", path)
                .style("fill", function (d) {
                    //on prend la valeur recupere plus haut
                    var value = d.properties.value;

                    if (value) {
                        return color(value);
                    } else {
                        // si pas de valeur alors en gris
                        return "#ccc";
                    }


                })
                .on("mousemove", function (e, d) {
                    // On récupère la position de la souris,
                    // e est l'object event d
                    var mousePosition = [e.x, e.y];
                    // console.log(mousePosition);

                    // On affcihe le tooltip
                    tooltip.classed("hidden", false)

                        // On positionne le tooltip en fonction de la postion de la souris
                        .attr("style", "left:" + (mousePosition[0] + 15) + 'px; top:' + (mousePosition[1] - 35) + 'px')
                        // On récupère le nom et la valeur de région
                        .html(d.properties.nom + " : " + d.properties.value)

                })
                .on('mouseout', function () {
                    // on cache le toolip
                    tooltip.classed('hidden', true);
                });
        }

        //###############################################Fonction##############################################################
          /*g.selectAll("path")
               .data(json.features)
               .join("path")
               .attr("d", path)
               .style("fill", function (d) {
                   //on prend la valeur recupere plus haut
                   var value = d.properties.value;
   
                   if (value) {
                       return color(value);
                   } else {
                       // si pas de valeur alors en gris
                       return "#ccc";
                   }
   
   
   
               })
               .on("mousemove", function (e, d) {
                   // On récupère la position de la souris,
                   // e est l'object event d
                   var mousePosition = [e.x, e.y];
                   // console.log(mousePosition);
   
                   // On affcihe le tooltip
                   tooltip.classed("hidden", false)
   
                       // On positionne le tooltip en fonction de la postion de la souris
                       .attr("style", "left:" + (mousePosition[0] + 15) + 'px; top:' + (mousePosition[1] - 35) + 'px')
                       // On récupère le nom et la valeur de région
                       .html(d.properties.nom + " : " + d.properties.value)
   
               })
               .on('mouseout', function () {
                   // on cache le toolip
                   tooltip.classed('hidden', true);
               });
   */
   
   
// 8- Update Slider
            
    });
});