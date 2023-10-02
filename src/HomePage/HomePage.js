import React, { 
     useEffect, 
     useState, 
     useRef 
} from 'react';
import axios from 'axios';
import {Chart} from 'chart.js/auto';
import * as d3 from 'd3';
import { select } from 'd3-selection';



function Homepage() {
     var datasource = {
          datasets: [
              {
                data: [40, 50, 60],
                backgroundcolor: [
                  '#ffcd56',
                  '#ff6384',
                  '#0000ff',
                  '#fd6b19',
                  '#4bc0c0',
                  '#9966cc',
                  '#ff9f40',
                  '#ffd700',
                  
                ],

              }
          ],

         labels: [
                  'Housing',
                  'Electricity',
                  'Groceries',
                  'Transportation',
                  'Savings',
                  'Entertainment',
                  'others',
              ]
      };
      
      function createChart()
            {
                var ctx = document.getElementById("myChart").getContext("2d");
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: datasource
                });
            }
  
  
    const createD3Chart = () => {
      const width = 960;
      const height = 450;
      const radius = Math.min(width, height) / 2;
      
      const svg = select('#d3chart')
        .append('svg')
        .attr('width', 960)
        .attr('height', 450)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
     svg.append("g")
        .attr("class", "slices");
     svg.append("g")
        .attr("class", "labels");
     svg.append("g")
        .attr("class", "lines");
  
      
  
        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });
  
        var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);
    
    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
  
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
        var key = function(d){ return d.data.label; };
        
        var color = d3.scale.ordinal()
            .domain(["Electricity Bill", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  
            axios.get('/budget').then(res => {
               console.log(res);
               var data = res.data.myBudget.map(obj => {
                   return {label: obj.title, value: obj.budget}
               })
               change(data);
           })
  
           function change(data) {
            
                
               var slice = svg.select(".slices").selectAll("path.slice")
                   .data(pie(data), key);
           
               slice.enter()
                   .insert("path")
                   .style("fill", function(d) { return color(d.data.label); })
                   .attr("class", "slice");
           
               slice		
                   .transition().duration(1000)
                   .attrTween("d", function(d) {
                       this._current = this._current || d;
                       var interpolate = d3.interpolate(this._current, d);
                       this._current = interpolate(0);
                       return function(t) {
                           return arc(interpolate(t));
                       };
                   })
  
                   slice.exit()
                   .remove();
  
                   var text = svg.select(".labels").selectAll("text")
                   .data(pie(data), key);
           
               text.enter()
                   .append("text")
                   .attr("dy", ".35em")
                   .text(function(d) {
                       return d.data.label;
                   });
  
                   function midAngle(d){
                    return d.startAngle + (d.endAngle - d.startAngle)/2;
                }
            
                text.transition().duration(1000)
                    .attrTween("transform", function(d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate("+ pos +")";
                        };
                    })
                    .styleTween("text-anchor", function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            return midAngle(d2) < Math.PI ? "start":"end";
                        };
                    });
            
                text.exit()
                    .remove();
  
                    var polyline = svg.select(".lines").selectAll("polyline")
                    .data(pie(data), key);
                
                polyline.enter()
                    .append("polyline");
            
                polyline.transition().duration(1000)
                    .attrTween("points", function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                            return [arc.centroid(d2), outerArc.centroid(d2), pos];
                        };			
                    });
                
                polyline.exit()
                    .remove();
      }
  }
  
  
  
      const getBudget = () => {
        axios.get('http://localhost:3000/budget')
          .then(function (res) {
            for (var i = 0; i < res.data.myBudget.length; i++) {
              datasource.datasets[0].data[i] = res.data.myBudget[i].budget;
              datasource.labels[i] = res.data.myBudget[i].title;
            }
            createChart();
            createD3Chart();
          });
      }
  
      useEffect(() => {
      getBudget();
  },[]);
  return (
    <main className="center" id="main">
          <div className="page-area">
               <article> 
                    <h2>Stay on track</h2> 
                    <p> 
                         Do you know where you are spending your money? If you really stop to track it down, 
                         you would get surprised! Proper budget management depends on real data... and this app 
                         will help you with that! 
                    </p> 
               </article> 
               <article> 
                    <h2>Alerts</h2> 
                         <p> 
                              What if your clothing budget ended? You will get an alert. The goal is to never go 
                              over the budget. 
                         </p> 
                    </article> 
               <article> 
                    <h2>Results</h2> 
                    <p> People who stick to a financial plan, budgeting every expense, get out of debt faster! 
                         Also, they to live happier lives... since they expend without guilt or fear... because 
                         they know it is all good and accounted for. 
                    </p> 
               </article> 
               <article> 
                    <h2>Free</h2> 
                         <p> 
                              This app is free!!! And you are the only one holding your data! 
                         </p> 
                    </article> 
               <article> 
                    <h2>Stay on track</h2> 
                         <p> 
                         Do you know where you are spending your money? If you really stop to track it down, you 
                         would get surprised! Proper budget management depends on real data... and this app will 
                         help you with that! 
                    </p> 
               </article> 
               <article> 
                    <h2>Alerts</h2> 
                         <p> What if your clothing budget ended? You will get an alert. The goal is to never go 
                              over the budget. 
                         </p> 
                    </article> 
               <article> 
                    <h2>Results</h2> 
                    <p> People who stick to a financial plan, budgeting every expense, get out of debt faster! 
                         Also, they to live happier lives... since they expend without guilt or fear... because 
                         they know it is all good and accounted for. 
                    </p> 
               </article> 
               <article>
                    <h1>Free</h1>
                    <p>
                         This app is free!!! And you are the only one holding your data!
                    </p>
               </article>


               <article>
                    <h1>Chart.js</h1>
                    <p>
                         <canvas id="myChart" width="960px" height="650px"></canvas>
                    </p>
               </article>
          

               <article>
                    <h1>D3.js</h1>
                    <p>
                    <svg width="960" height="450"></svg>;
                    </p>
                   
                 </article>
        
         
          </div>

    </main>

  );
}

export default HomePage;
