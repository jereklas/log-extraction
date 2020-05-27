(this["webpackJsonplog-extraction"]=this["webpackJsonplog-extraction"]||[]).push([[0],{20:function(e,a,r){e.exports=r(42)},25:function(e,a,r){},42:function(e,a,r){"use strict";r.r(a);var t=r(0),n=r.n(t),s=r(16),o=r.n(s),i=(r(25),r(18)),l=r(17),c=r(1),u=r(4),d=r.n(u),h=r(19),m=d.a.create({baseURL:"https://classic.warcraftlogs.com:443/v1/"}),p=function(e){return e.params=Object(h.a)({},e.params,{api_key:"ce3902772ae4b70c973b6a9f54f844fd"}),m(e).then((function(e){return console.debug("Request Successful!",e),e.data})).catch((function(e){return console.error("Request Failed:",e.config),e.response?(console.error("Status:",e.response.status),console.error("Data:",e.response.data),console.error("Headers:",e.response.headers)):console.error("Error Message:",e.message),Promise.reject(e.response||e.message)}))},f=function e(){var a,r=this;Object(l.a)(this,e),this.raidsToGetFightsFor=[],this.parsesByRaider={},this.zones={},this.loading=!0,this.loadingBracketParses=!0,this.loadingOverallParses=!0,this.loadingZones=!0,this.error="",this.timeRemaining=0,this.medianBracket=[],this.bestBracket=[],this.medianOverall=[],this.bestOverall=[],this.healerTypes=["Priest","Paladin","Druid"],this.healerExclusionList=["Lightsaber","Neku","Taede"],this.healers=[],this.updateWhenFinished=Object(c.n)((function(){return r.loadingBracketParses||r.loadingOverallParses||r.loadingZones}),(function(){r.loadingBracketParses||r.loadingOverallParses||r.loadingZones||(console.log("done loading, time elapsed: ",Date.now()-r.start),Object.keys(r.parsesByRaider).sort().forEach((function(e){var a={name:e},t={name:e},n={name:e},s={name:e},o=r.parsesByRaider[e].bracket;o&&Object.keys(o).forEach((function(e){var r=o[e],n=0;r.parses.forEach((function(e){n+=e})),n/=r.parses.length,a[e]=Number.isInteger(r.best)?r.best:r.best.toFixed(2),t[e]=Number.isNaN(n)?"-":Number.isInteger(n)?n:n.toFixed(2)}));var i=r.parsesByRaider[e].overall;i&&Object.keys(i).forEach((function(e){var a=i[e],r=0;a.parses.forEach((function(e){r+=e})),r/=a.parses.length,n[e]=Number.isInteger(a.best)?a.best:a.best.toFixed(2),s[e]=Number.isNaN(r)?"-":Number.isInteger(r)?r:r.toFixed(2)})),r.bestBracket.push(a),r.medianBracket.push(t),r.bestOverall.push(n),r.medianOverall.push(s)})),r.loading=!1,localStorage.setItem("previousRaids",JSON.stringify(r.raidsToGetFightsFor)),localStorage.setItem("parsesByRaider",JSON.stringify(r.parsesByRaider)))}));var t=JSON.parse(localStorage.getItem("previousRaids"));this.parsesByRaider=null!==(a=JSON.parse(localStorage.getItem("parsesByRaider")))&&void 0!==a?a:{},console.log(this.parsesByRaider.Zero),this.start=Date.now();var n=this.start-24192e5,s=this.start-36288e5;p({url:"/zones"}).then((function(e){r.zones=e,r.loadingZones=!1})),p({url:"/reports/guild/RIVAL/Fairbanks/US"}).then((function(e){var a={};Object.values(e).forEach((function(e){if(e.end-e.start>0){var t=new Date(e.start).getDay();a[e.id]=e,e.start>n&&(3===t||4===t)&&1002===e.zone&&r.raidsToGetFightsFor.push(e.id)}}));var o=!1;if(t?r.raidsToGetFightsFor.forEach((function(e){t.includes(e)||(o=!0)})):o=!0,o){var i=[];r.raidsToGetFightsFor.forEach((function(e){i.push(p({url:"/report/fights/".concat(e)}))})),d.a.all(i).then(d.a.spread((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var o=[];Object.values(a).forEach((function(e){t.forEach((function(a){e.start===a.start&&e.title===a.title&&o.push(a)}))})),o.forEach((function(e){e.exportedCharacters.forEach((function(a){var t=e.friendlies.find((function(e){return e.name===a.name}));console.log(t),!r.healerTypes.includes(t.type)||r.healerExclusionList.includes(t.name)||r.healers.includes(t.name)||r.healers.push(t.name),r.parsesByRaider[a.name]={}}))}));var i=[],l=Object.keys(r.parsesByRaider),c=Math.floor(2e3*(l.length+3)/1e3);r.timeRemaining=c;for(var u=0;u<c;u++)setTimeout((function(){r.timeRemaining=r.timeRemaining-1}),1e3*u);for(var h=function(e){setTimeout((function(){var a=l[e];i.push(p({url:"/parses/character/".concat(a,"/Fairbanks/US"),params:{bracket:-1,metric:r.healers.includes(a)?"hps":"dps"}}))}),2e3*e)},m=0;m<l.length;m++)h(m);for(var f=[],g=function(e){setTimeout((function(){var a=l[e];f.push(p({url:"/parses/character/".concat(a,"/Fairbanks/US"),params:{metric:r.healers.includes(a)?"hps":"dps"}}))}),2e3*e)},v=0;v<l.length;v++)g(v);setTimeout((function(){d.a.all(i).then(d.a.spread((function(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];a.forEach((function(e){if(e[0]){var a=e[0].characterName;r.parsesByRaider[a].bracket={},e.forEach((function(e){var t=r.parsesByRaider[a].bracket;t[e.encounterID]||(t[e.encounterID]={best:0,parses:[]}),e.startTime>s&&t[e.encounterID].parses.push(e.percentile),t[e.encounterID].best<e.percentile&&(t[e.encounterID].best=e.percentile)}))}})),r.loadingBracketParses=!1}))).catch((function(e){r.error="There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.",r.loadingBracketParses=!1}))}),2e3*l.length),setTimeout((function(){d.a.all(f).then(d.a.spread((function(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];a.forEach((function(e){if(e[0]){var a=e[0].characterName;r.parsesByRaider[a].overall={},e.forEach((function(e){var t=r.parsesByRaider[a].overall;t[e.encounterID]||(t[e.encounterID]={best:0,parses:[]}),e.startTime>s&&t[e.encounterID].parses.push(e.percentile),t[e.encounterID].best<e.percentile&&(t[e.encounterID].best=e.percentile)}))}})),r.loadingOverallParses=!1}))).catch((function(e){r.error="There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.",r.loadingOverallParses=!1}))}),2e3*(l.length+2))})))}else r.loadingBracketParses=!1,r.loadingOverallParses=!1}))};Object(c.h)(f,{error:c.m,healers:c.m,loading:c.m,loadingBracketParses:c.m,loadingOverallParses:c.m,timeRemaining:c.m,loadingZones:c.m,bestBracket:c.m,medianBracket:c.m,bestOverall:c.m,medianOverall:c.m,zones:c.m});var g=f,v=n.a.createContext({raidStore:new g}),b=Object(i.a)((function(){var e=n.a.useContext(v).raidStore,a=function(e){var a="black";return 100===e?a="#F4D03F":e>=95&&e<100?a="#F39C12":e>=75&&e<95?a="#8E44AD":e>=50&&e<75?a="#3498DB":e>=25&&e<50?a="#2ECC71":e>=0&&e<25&&(a="#BDC3C7"),a},r=function(r){var t=e.zones.find((function(e){return 1002===e.id})),s=["Raider","Average"];t.encounters.forEach((function(e){s.push(e.name)}));var o=[];return r.forEach((function(e){var a=[e.name],r=[],n=0,s=0;t.encounters.forEach((function(a){var t=e[a.id];t&&"-"!==t&&(n+=Number(t),s+=1),r.push(null!==t&&void 0!==t?t:"-")})),0!==n&&(a.push((n/s).toFixed(2)),r.forEach((function(e){return a.push(e)})),o.push(a))})),n.a.createElement("table",{style:{borderCollapse:"collapse"}},n.a.createElement("thead",null,n.a.createElement("tr",null,s.map((function(e){return n.a.createElement("th",{key:e,style:{padding:"5px",textAlign:"left",fontWeight:"bold",backgroundColor:"#5D6D7E",color:"white",border:"1px solid black"}},e)})))),n.a.createElement("tbody",null,o.map((function(e){return n.a.createElement("tr",null,e.map((function(e){return n.a.createElement("td",{style:{padding:"0px 5px",border:"1px solid black",color:"".concat(a(e))}},e)})))}))))};return n.a.createElement("div",null,e.loading?n.a.createElement("div",null,n.a.createElement("p",{style:{margin:"5px"}},"Due to WarcraftLog's API request limit, loading will take about 2 minutes."),e.timeRemaining>0&&n.a.createElement("p",{style:{margin:"5px"}},"Estimated time remaining: ".concat(e.timeRemaining,"s"))):""!==e.error?"ERROR: ".concat(e.error):n.a.createElement("div",null,n.a.createElement("p",{style:{margin:"5px"}},"Druids, Paladins, and Priests have healing parses pulled. The following people are excluded from that: ".concat(e.healerExclusionList.sort().join(", "))),n.a.createElement("br",null),n.a.createElement("p",{style:{margin:"5px"}},"Median Bracket:"),r(e.medianBracket),n.a.createElement("p",null,"Best Bracket:"),r(e.bestBracket),n.a.createElement("p",null,"Median Overall:"),r(e.medianOverall),n.a.createElement("p",null,"Best Overall:"),r(e.bestOverall)))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[20,1,2]]]);
//# sourceMappingURL=main.3e77780c.chunk.js.map