(this["webpackJsonplog-extraction"]=this["webpackJsonplog-extraction"]||[]).push([[0],{21:function(e,t,a){e.exports=a(43)},26:function(e,t,a){},43:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(16),s=a.n(i),o=(a(26),a(19)),l=a(17),c=a(18),u=a(1),d=a(4),m=a.n(d),h=a(20),p=m.a.create({baseURL:"https://classic.warcraftlogs.com:443/v1/"}),f=function(e){return e.params=Object(h.a)({},e.params,{api_key:"ce3902772ae4b70c973b6a9f54f844fd"}),p(e).then((function(e){return console.debug("Request Successful!",e),e.data})).catch((function(e){return console.error("Request Failed:",e.config),e.response?(console.error("Status:",e.response.status),console.error("Data:",e.response.data),console.error("Headers:",e.response.headers)):console.error("Error Message:",e.message),Promise.reject(e.response||e.message)}))},g=function(){function e(){var t,a=this;Object(l.a)(this,e),this.raidsToGetFightsFor=[],this.parsesByRaider={},this.zones={},this.loading=!0,this.loadingBracketParses=!0,this.loadingOverallParses=!0,this.loadingZones=!0,this.needToGetData=!1,this.error="",this.timeRemaining=0,this.medianBracket=[],this.bestBracket=[],this.medianOverall=[],this.bestOverall=[],this.healerTypes=["Priest","Paladin","Druid"],this.healerExclusionList=["Lightsaber","Neku","Taede"],this.healers=[],this.isRaidDataOutOfDate=function(){var e=JSON.parse(localStorage.getItem("previousRaids")),t=!1;return!e&&a.raidsToGetFightsFor.length>0?t=!0:a.raidsToGetFightsFor.forEach((function(a){e.includes(a)||(t=!0)})),t},this.findRaids=function(e,t,n){return e.filter((function(e){return e.start>Date.now()-6048e5*n&&e.zone===a.getZoneId(t)})).map((function(e){return e.id}))},this.findRaiders=function(e){var t=[];a.raids.forEach((function(a){e.forEach((function(e){a.start===e.start&&a.title===e.title&&t.push(e)}))})),t.forEach((function(e){e.exportedCharacters.forEach((function(t){var n=e.friendlies.find((function(e){return e.name===t.name}));!a.healerTypes.includes(n.type)||a.healerExclusionList.includes(n.name)||a.healers.includes(n.name)||a.healers.push(n.name),a.parsesByRaider[t.name]={}}))}))},this.handleParseRequests=function(e,t,n,r){var i=a.start-36288e5;setTimeout((function(){m.a.all(e).then(m.a.spread((function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];t.forEach((function(e){if(e[0]){var t=e[0].characterName;a.parsesByRaider[t][n]={},e.forEach((function(e){var r=a.parsesByRaider[t][n];r[e.encounterID]||(r[e.encounterID]={numberOfEncounters:0,best:0,parses:[]}),e.startTime>i&&(r[e.encounterID].numberOfEncounters+=1,r[e.encounterID].parses.push(e.percentile)),r[e.encounterID].best<e.percentile&&(r[e.encounterID].best=e.percentile)}))}})),a[r]=!1}))).catch((function(){a.error="There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.",a[r]=!1}))}),2e3*(t.length+2))},this.updateWhenFinished=Object(u.n)((function(){return a.loadingBracketParses||a.loadingOverallParses||a.loadingZones}),(function(){a.loadingBracketParses||a.loadingOverallParses||a.loadingZones||(console.log("done loading, time elapsed: ".concat((Date.now()-a.start)/1e3,"s")),Object.keys(a.parsesByRaider).sort().forEach((function(e){var t={name:e},n={name:e},r={name:e},i={name:e},s=a.parsesByRaider[e].bracket;s&&Object.keys(s).forEach((function(e){var a=s[e],r=0;a.parses.forEach((function(e){r+=e})),r/=a.parses.length,t[e]=Number.isInteger(a.best)?a.best:a.best.toFixed(2),n[e]=Number.isNaN(r)?"-":Number.isInteger(r)?r:r.toFixed(2)}));var o=a.parsesByRaider[e].overall;o&&Object.keys(o).forEach((function(e){var t=o[e],a=0;t.parses.forEach((function(e){a+=e})),a/=t.parses.length,r[e]=Number.isInteger(t.best)?t.best:t.best.toFixed(2),i[e]=Number.isNaN(a)?"-":Number.isInteger(a)?a:a.toFixed(2)})),a.bestBracket.push(t),a.medianBracket.push(n),a.bestOverall.push(r),a.medianOverall.push(i)})),a.loading=!1,localStorage.setItem("previousRaids",JSON.stringify(a.raidsToGetFightsFor)),localStorage.setItem("parsesByRaider",JSON.stringify(a.parsesByRaider)))})),this.parsesByRaider=null!==(t=JSON.parse(localStorage.getItem("parsesByRaider")))&&void 0!==t?t:{},this.start=Date.now(),f({url:"/zones"}).then((function(e){a.zones=e,a.loadingZones=!1})),Object(u.n)((function(){return a.loadingZones}),(function(){f({url:"/reports/guild/RIVAL/Fairbanks/US"}).then((function(e){a.raids=e,a.raidsToGetFightsFor=a.findRaids(e,"Blackwing Lair",4),a.needToGetData=a.isRaidDataOutOfDate(),a.needToGetData||(a.loadingBracketParses=!1,a.loadingOverallParses=!1)}))})),Object(u.n)((function(){return a.needToGetData}),(function(){var e=[];a.raidsToGetFightsFor.forEach((function(t){e.push(f({url:"/report/fights/".concat(t)}))})),m.a.all(e).then(m.a.spread((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];a.findRaiders(t);var r=[],i=Object.keys(a.parsesByRaider),s=Math.floor(2e3*(i.length+3)/1e3);a.timeRemaining=s;for(var o=0;o<s;o++)setTimeout((function(){a.timeRemaining=a.timeRemaining-1}),1e3*o);for(var l=function(e){setTimeout((function(){var t=i[e];r.push(f({url:"/parses/character/".concat(t,"/Fairbanks/US"),params:{bracket:-1,zone:a.getZoneId("Blackwing Lair"),metric:a.healers.includes(i[0])?"hps":"dps"}}))}),2e3*e)},c=0;c<i.length;c++)l(c);for(var u=[],d=function(e){setTimeout((function(){var t=i[e];u.push(f({url:"/parses/character/".concat(t,"/Fairbanks/US"),zone:a.getZoneId("Blackwing Lair"),params:{metric:a.healers.includes(t)?"hps":"dps"}}))}),2e3*e)},m=0;m<i.length;m++)d(m);a.handleParseRequests(r,i,"bracket","loadingBracketParses"),a.handleParseRequests(u,i,"overall","loadingOverallParses")})))}))}return Object(c.a)(e,[{key:"getZoneId",value:function(e){return this.zones.find((function(t){return t.name===e})).id}},{key:"getZone",value:function(){return this.zones.find((function(e){return"Blackwing Lair"===e.name}))}},{key:"getPartitionName",value:function(){return this.zones.find((function(e){return"Blackwing Lair"===e.name})).partitions[2].name}}]),e}();Object(u.h)(g,{error:u.m,healers:u.m,loading:u.m,loadingBracketParses:u.m,loadingOverallParses:u.m,needToGetData:u.m,timeRemaining:u.m,loadingZones:u.m,bestBracket:u.m,medianBracket:u.m,bestOverall:u.m,medianOverall:u.m});var b=g,v=r.a.createContext({raidStore:new b}),E=Object(o.a)((function(){var e=r.a.useContext(v).raidStore,t=function(e){var t="black";return 100===e?t="#F4D03F":e>=95&&e<100?t="#F39C12":e>=75&&e<95?t="#8E44AD":e>=50&&e<75?t="#3498DB":e>=25&&e<50?t="#2ECC71":e>=0&&e<25&&(t="#BDC3C7"),t},a=function(a){var n=e.getZone(),i=["Raider","Average"];n.encounters.forEach((function(e){i.push(e.name)}));var s=[];return a.forEach((function(e){var t=[e.name],a=[],r=0,i=0;n.encounters.forEach((function(t){var n,s=null!==(n=e[t.id])&&void 0!==n?n:"-";s&&"-"!==s&&(r+=Number(s),i+=1),a.push(s)})),0!==r?t.push((r/i).toFixed(2)):t.push("-"),a.forEach((function(e){return t.push(e)})),s.push(t)})),r.a.createElement("table",{style:{borderCollapse:"collapse",margin:"3px 5px"}},r.a.createElement("thead",null,r.a.createElement("tr",null,i.map((function(e){return r.a.createElement("th",{key:e,style:{padding:"5px",textAlign:"left",fontWeight:"bold",backgroundColor:"#5D6D7E",color:"white",border:"1px solid black"}},e)})))),r.a.createElement("tbody",null,s.map((function(e){return r.a.createElement("tr",null,e.map((function(e){return r.a.createElement("td",{style:{padding:"0px 5px",border:"1px solid black",color:"".concat(t(e))}},e)})))}))))};return r.a.createElement("div",null,e.loading?r.a.createElement("div",null,r.a.createElement("p",{style:{margin:"5px"}},"Due to WarcraftLog's API request limit, loading will take about 2 minutes."),e.timeRemaining>0&&r.a.createElement("p",{style:{margin:"5px"}},"Estimated time remaining: ".concat(e.timeRemaining,"s"))):""!==e.error?"ERROR: ".concat(e.error):r.a.createElement("div",null,r.a.createElement("p",{style:{margin:"5px 0px 5px 5px"}},r.a.createElement("b",null,"Zone:")," ".concat(e.getZone().name)),r.a.createElement("p",{style:{margin:"0px 5px"}},r.a.createElement("b",null,"Partition:")," ".concat(e.getPartitionName())),r.a.createElement("p",{style:{margin:"5px"}},r.a.createElement("b",null,"Details:")," Druids, Paladins, and Priests have healing parses pulled. The following people are excluded from that: ".concat(e.healerExclusionList.sort().join(", "))),r.a.createElement("p",{style:{margin:"15px 5px 7px 5px"}},r.a.createElement("b",null,"Median Bracket:")),a(e.medianBracket),r.a.createElement("p",{style:{margin:"7px 5px"}},r.a.createElement("b",null,"Best Bracket:")),a(e.bestBracket),r.a.createElement("p",{style:{margin:"7px 5px"}},r.a.createElement("b",null,"Median Overall:")),a(e.medianOverall),r.a.createElement("p",{style:{margin:"7px 5px"}},r.a.createElement("b",null,"Best Overall:")),a(e.bestOverall)))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(E,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[21,1,2]]]);
//# sourceMappingURL=main.9f369ac3.chunk.js.map