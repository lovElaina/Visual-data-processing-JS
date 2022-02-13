var button = document.getElementById("export");
button.addEventListener("click", saveHandler, false);
function saveHandler(){


/*    let data=[];

    for(let i=0;i<localStorage.length;i++){
        data = [...data,JSON.parse(window.localStorage.getItem(i+""))]
    }
    var content = JSON.stringify(data);*/
    let content = "[\n";
    for(let i=0;i<localStorage.length;i++){
        if(i===localStorage.length-1){
            content = content + window.localStorage.getItem(i+"") + "\n";
            break;
        }
        content = content + window.localStorage.getItem(i+"") + ",\n";
    }
    content = content+"]"
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "save.json");
}