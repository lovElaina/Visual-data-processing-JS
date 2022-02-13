var inputElement = document.getElementById("files");
inputElement.addEventListener("change", handleFiles, false);
sessionStorage.setItem("isRead","false");
function handleFiles() {
    var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
    //var name = selectedFile.name;//读取选中文件的文件名
    //var size = selectedFile.size;//读取选中文件的大小
    var reader = new FileReader();//这里是核心，读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容

    reader.onload = function () {
        let company_set = new Set();
        let brand_set = new Set();
        let sku_set = new Set();

        let row_final = 0;
        console.log("读取结果：", this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
        sessionStorage.setItem("data",this.result.toString());
        sessionStorage.setItem("isRead","true");
        let json = JSON.parse(this.result);
        for(let i=0;i<json.length;i++){
            json[i].isChecked=false;
            row_final = row_final<json[i].row? json[i].row:row_final;
            company_set.add(json[i].company);
            brand_set.add(json[i].brand);
            sku_set.add(json[i].category);
            localStorage.setItem(i+"",JSON.stringify(json[i]));
        }
        sessionStorage.setItem("company",company_set.size+"");
        sessionStorage.setItem("brand",brand_set.size+"");
        sessionStorage.setItem("sku",sku_set.size+"");
        sessionStorage.setItem("row",row_final+"");
        sessionStorage.setItem("nums",json.length+"");


        let company_map = new Map();
        let brand_map = new Map();
        let sku_map = new Map();
        for(let i=0;i<json.length;i++){
            if(company_map.has(json[i].company)){
                company_map.set(json[i].company,company_map.get(json[i].company)+1);
            }else {
                company_map.set(json[i].company,1);
            }

            if(brand_map.has(json[i].brand)){
                brand_map.set(json[i].brand,brand_map.get(json[i].brand)+1);
            }else {
                brand_map.set(json[i].brand,1);
            }

            if(sku_map.has(json[i].category)){
                sku_map.set(json[i].category,sku_map.get(json[i].category)+1);
            }else {
                sku_map.set(json[i].category,1);
            }
        }

        //给三个Map排序，按由大到小顺序
        company_map = new Map(Array.from(company_map).sort(function (a, b){return a[1]-b[1];}))
        brand_map = new Map(Array.from(brand_map).sort(function (a, b){return a[1]-b[1];}))
        sku_map = new Map(Array.from(sku_map).sort(function (a, b){return a[1]-b[1];}))

        let company_obj = Object.create(null);
        for(let[k,v]of company_map){
            company_obj[k]=(v*100/json.length).toFixed(2);
        }
        sessionStorage.setItem("company_map",JSON.stringify(company_obj));
        let brand_obj = Object.create(null);
        for(let[k,v]of brand_map){
            brand_obj[k]=(v*100/json.length).toFixed(2);
        }
        sessionStorage.setItem("brand_map",JSON.stringify(brand_obj));
        let sku_obj = Object.create(null);
        for(let[k,v]of sku_map){
            sku_obj[k]=(v*100/json.length).toFixed(2);
        }
        sessionStorage.setItem("sku_map",JSON.stringify(sku_obj));

    };
}
