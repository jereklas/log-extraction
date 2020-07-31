(this["webpackJsonplog-extraction"]=this["webpackJsonplog-extraction"]||[]).push([[0],{21:function(e,a,t){e.exports=t(43)},26:function(e,a,t){},43:function(e,a,t){"use strict";t.r(a);var r=t(0),n=t.n(r),s=t(16),i=t.n(s),o=(t(26),t(19)),l=t(17),c=t(18),u=t(1),d=t(4),h=t.n(d),m=t(20),f=h.a.create({baseURL:"https://classic.warcraftlogs.com:443/v1/"}),p=function(e){return e.params=Object(m.a)({},e.params,{api_key:"ce3902772ae4b70c973b6a9f54f844fd"}),f(e).then((function(e){return console.debug("Request Successful!",e),e.data})).catch((function(e){return console.error("Request Failed:",e.config),e.response?(console.error("Status:",e.response.status),console.error("Data:",e.response.data),console.error("Headers:",e.response.headers)):console.error("Error Message:",e.message),Promise.reject(e.response||e.message)}))},g=function(){function e(){var a,t=this;Object(l.a)(this,e),this.raidsToGetFightsFor=[],this.parsesByRaider={},this.zones={},this.loading=!0,this.loadingBracketParses=!0,this.loadingOverallParses=!0,this.loadingZones=!0,this.needToGetData=!1,this.error="",this.timeRemaining=0,this.medianBracket=[],this.bestBracket=[],this.medianOverall=[],this.bestOverall=[],this.healerTypes=["Priest","Paladin","Druid"],this.healerExclusionList=["Lightsaber","Neku","Taede"],this.healers=[],this.isRaidDataOutOfDate=function(){var e=JSON.parse(localStorage.getItem("previousRaids")),a=!1;return!e&&t.raidsToGetFightsFor.length>0?a=!0:t.raidsToGetFightsFor.forEach((function(t){e.includes(t)||(a=!0)})),a},this.findRaids=function(e,a,r){return e.filter((function(e){return e.start>Date.now()-6048e5*r&&e.zone===t.getZoneId(a)})).map((function(e){return e.id}))},this.findRaiders=function(e){var a=[];t.raids.forEach((function(t){e.forEach((function(e){t.start===e.start&&t.title===e.title&&a.push(e)}))})),a.forEach((function(e){e.exportedCharacters.forEach((function(a){var r=e.friendlies.find((function(e){return e.name===a.name}));!t.healerTypes.includes(r.type)||t.healerExclusionList.includes(r.name)||t.healers.includes(r.name)||t.healers.push(r.name),t.parsesByRaider[a.name]={}}))}))},this.updateWhenFinished=Object(u.n)((function(){return t.loadingBracketParses||t.loadingOverallParses||t.loadingZones}),(function(){t.loadingBracketParses||t.loadingOverallParses||t.loadingZones||(console.log("done loading, time elapsed: ".concat((Date.now()-t.start)/1e3,"s")),Object.keys(t.parsesByRaider).sort().forEach((function(e){var a={name:e},r={name:e},n={name:e},s={name:e},i=t.parsesByRaider[e].bracket;i&&Object.keys(i).forEach((function(e){var t=i[e],n=0;t.parses.forEach((function(e){n+=e})),n/=t.parses.length,a[e]=Number.isInteger(t.best)?t.best:t.best.toFixed(2),r[e]=Number.isNaN(n)?"-":Number.isInteger(n)?n:n.toFixed(2)}));var o=t.parsesByRaider[e].overall;o&&Object.keys(o).forEach((function(e){var a=o[e],t=0;a.parses.forEach((function(e){t+=e})),t/=a.parses.length,n[e]=Number.isInteger(a.best)?a.best:a.best.toFixed(2),s[e]=Number.isNaN(t)?"-":Number.isInteger(t)?t:t.toFixed(2)})),t.bestBracket.push(a),t.medianBracket.push(r),t.bestOverall.push(n),t.medianOverall.push(s)})),t.loading=!1,localStorage.setItem("previousRaids",JSON.stringify(t.raidsToGetFightsFor)),localStorage.setItem("parsesByRaider",JSON.stringify(t.parsesByRaider)))})),this.parsesByRaider=null!==(a=JSON.parse(localStorage.getItem("parsesByRaider")))&&void 0!==a?a:{},this.start=Date.now();var r=this.start-36288e5;p({url:"/zones"}).then((function(e){t.zones=e,t.loadingZones=!1})),Object(u.n)((function(){return t.loadingZones}),(function(){p({url:"/reports/guild/RIVAL/Fairbanks/US"}).then((function(e){t.raids=e,t.raidsToGetFightsFor=t.findRaids(e,"Temple of Ahn'Qiraj",4),t.needToGetData=t.isRaidDataOutOfDate(),t.needToGetData||(t.loadingBracketParses=!1,t.loadingOverallParses=!1)}))})),Object(u.n)((function(){return t.needToGetData}),(function(){var e=[];t.raidsToGetFightsFor.forEach((function(a){e.push(p({url:"/report/fights/".concat(a)}))})),h.a.all(e).then(h.a.spread((function(){for(var e=arguments.length,a=new Array(e),n=0;n<e;n++)a[n]=arguments[n];t.findRaiders(a);var s=[],i=Object.keys(t.parsesByRaider),o=Math.floor(2e3*(i.length+3)/1e3);t.timeRemaining=o;for(var l=0;l<o;l++)setTimeout((function(){t.timeRemaining=t.timeRemaining-1}),1e3*l);for(var c=function(e){setTimeout((function(){var a=i[e];s.push(p({url:"/parses/character/".concat(a,"/Fairbanks/US"),params:{bracket:-1,zone:t.getZoneId("Temple of Ahn'Qiraj"),metric:t.healers.includes(i[0])?"hps":"dps"}}))}),2e3*e)},u=0;u<i.length;u++)c(u);for(var d=[],m=function(e){setTimeout((function(){var a=i[e];d.push(p({url:"/parses/character/".concat(a,"/Fairbanks/US"),zone:t.getZoneId("Temple of Ahn'Qiraj"),params:{metric:t.healers.includes(a)?"hps":"dps"}}))}),2e3*e)},f=0;f<i.length;f++)m(f);setTimeout((function(){h.a.all(s).then(h.a.spread((function(){for(var e=arguments.length,a=new Array(e),n=0;n<e;n++)a[n]=arguments[n];a.forEach((function(e){if(e[0]){var a=e[0].characterName;t.parsesByRaider[a].bracket={},e.forEach((function(e){var n=t.parsesByRaider[a].bracket;n[e.encounterID]||(n[e.encounterID]={best:0,parses:[]}),e.startTime>r&&n[e.encounterID].parses.push(e.percentile),n[e.encounterID].best<e.percentile&&(n[e.encounterID].best=e.percentile)}))}})),t.loadingBracketParses=!1}))).catch((function(e){t.error="There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.",t.loadingBracketParses=!1}))}),2e3*i.length),setTimeout((function(){h.a.all(d).then(h.a.spread((function(){for(var e=arguments.length,a=new Array(e),n=0;n<e;n++)a[n]=arguments[n];a.forEach((function(e){if(e[0]){var a=e[0].characterName;t.parsesByRaider[a].overall={},e.forEach((function(e){var n=t.parsesByRaider[a].overall;n[e.encounterID]||(n[e.encounterID]={best:0,parses:[]}),e.startTime>r&&n[e.encounterID].parses.push(e.percentile),n[e.encounterID].best<e.percentile&&(n[e.encounterID].best=e.percentile)}))}})),t.loadingOverallParses=!1}))).catch((function(e){t.error="There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.",t.loadingOverallParses=!1}))}),2e3*(i.length+2))})))}))}return Object(c.a)(e,[{key:"getZoneId",value:function(e){return this.zones.find((function(a){return a.name===e})).id}}]),e}();Object(u.h)(g,{error:u.m,healers:u.m,loading:u.m,loadingBracketParses:u.m,loadingOverallParses:u.m,needToGetData:u.m,timeRemaining:u.m,loadingZones:u.m,bestBracket:u.m,medianBracket:u.m,bestOverall:u.m,medianOverall:u.m});var b=g,v=n.a.createContext({raidStore:new b}),y=Object(o.a)((function(){var e=n.a.useContext(v).raidStore,a=function(e){var a="black";return 100===e?a="#F4D03F":e>=95&&e<100?a="#F39C12":e>=75&&e<95?a="#8E44AD":e>=50&&e<75?a="#3498DB":e>=25&&e<50?a="#2ECC71":e>=0&&e<25&&(a="#BDC3C7"),a},t=function(t){var r=e.zones.find((function(e){return 1002===e.id})),s=["Raider","Average"];r.encounters.forEach((function(e){s.push(e.name)}));var i=[];return t.forEach((function(e){var a=[e.name],t=[],n=0,s=0;r.encounters.forEach((function(a){var r=e[a.id];r&&"-"!==r&&(n+=Number(r),s+=1),t.push(null!==r&&void 0!==r?r:"-")})),0!==n&&(a.push((n/s).toFixed(2)),t.forEach((function(e){return a.push(e)})),i.push(a))})),n.a.createElement("table",{style:{borderCollapse:"collapse"}},n.a.createElement("thead",null,n.a.createElement("tr",null,s.map((function(e){return n.a.createElement("th",{key:e,style:{padding:"5px",textAlign:"left",fontWeight:"bold",backgroundColor:"#5D6D7E",color:"white",border:"1px solid black"}},e)})))),n.a.createElement("tbody",null,i.map((function(e){return n.a.createElement("tr",null,e.map((function(e){return n.a.createElement("td",{style:{padding:"0px 5px",border:"1px solid black",color:"".concat(a(e))}},e)})))}))))};return n.a.createElement("div",null,e.loading?n.a.createElement("div",null,n.a.createElement("p",{style:{margin:"5px"}},"Due to WarcraftLog's API request limit, loading will take about 2 minutes."),e.timeRemaining>0&&n.a.createElement("p",{style:{margin:"5px"}},"Estimated time remaining: ".concat(e.timeRemaining,"s"))):""!==e.error?"ERROR: ".concat(e.error):n.a.createElement("div",null,n.a.createElement("p",{style:{margin:"5px"}},"Druids, Paladins, and Priests have healing parses pulled. The following people are excluded from that: ".concat(e.healerExclusionList.sort().join(", "))),n.a.createElement("br",null),n.a.createElement("p",{style:{margin:"5px"}},"Median Bracket (last 6 weeks of parses):"),t(e.medianBracket),n.a.createElement("p",null,"Best Bracket:"),t(e.bestBracket),n.a.createElement("p",null,"Median Overall (last 6 weeks of parses):"),t(e.medianOverall),n.a.createElement("p",null,"Best Overall:"),t(e.bestOverall)))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[21,1,2]]]);
//# sourceMappingURL=main.4de4c045.chunk.js.map