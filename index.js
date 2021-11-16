var data= []
   
function findBestPack(orcamento) {
    console.log(numberOfBolos)
    var m= [[0]]; // maximum pack valor found so far
    var b= [[0]]; // best combination found so far
    var opts= [0]; // item index for 0 of item 0 
    var P= [1]; // item encoding for 0 of item 0
    var choose= 0;
    for (var j= 0; j<data.length; j++) {
        opts[j+1]= opts[j]+data[j].quantidade; // item index for 0 of item j+1
        P[j+1]= P[j]*(1+data[j].quantidade); // item encoding for 0 of item j+1
    }
    for (var j= 0; j<opts[data.length]; j++) {
        m[0][j+1]= b[0][j+1]= 0; // best valors and combos for empty pack: nothing
    }
    for (var w=1; w<=orcamento; w++) {
        m[w]= [0];
        b[w]= [0];
        for (var j=0; j<data.length; j++) {
            var N= data[j].quantidade; // how many of these can we have?
            var base= opts[j]; // what is the item index for 0 of these?
            for (var n= 1; n<=N; n++) {
                var W= n*data[j].custo; // how much do these items weigh?
                var s= w>=W ?1 :0; // can we carry this many?
                var v= s*n*(data[j].valor - data[j].custo); // how much are they worth?
                var I= base+n; // what is the item number for this many?
                var wN= w-s*W; // how much other stuff can we be carrying?
                var C= n*P[j] + b[wN][base]; // encoded combination
                m[w][I]= Math.max(m[w][I-1], v+m[wN][base]); // best valor
                choose= b[w][I]= m[w][I]>m[w][I-1] ?C :b[w][I-1];
            }
        }
    }
    var best= [];
    for (var j= data.length-1; j>=0; j--) {
        best[j]= Math.floor(choose/P[j]);
        choose-= best[j]*P[j];
    }
    var out='<table><tr><td><b>Quantidade | </b></td><td><b>Bolo | </b></td><th>Custo por Unidade | </th><th>Valor de Venda por Unidade</th>';
    var wgt= 0;
    var val= 0;
    for (var i= 0; i<best.length; i++) {
        if (0==best[i]) continue;
        out+='</tr><tr><td>'+best[i]+'</td><td>'+data[i].name+'</td><td>'+data[i].custo+'</td><td>'+data[i].valor+'</td>'
        wgt+= best[i]*data[i].custo;
        val+= best[i]*data[i].valor;
    }
    out+= '</tr></table><br/>Total custo: '+wgt;
    out+= '<br/>Total valor: '+val;
    out+= '<br> Lucro Total: '+(val - wgt);
    document.body.innerHTML+= out;
}

function getCakeDataFromDiv(div) {
    let id = div.id
    let name = document.getElementById("nome"+id).value
    let valor = parseInt(document.getElementById("valor"+id).value)
    let custo = parseInt(document.getElementById("custo"+id).value)
    let quantidade = parseInt(document.getElementById("quantidade"+id).value)
    return {name, custo, valor, quantidade}
}

function handleForm(event) {
    event.preventDefault()
    let form = document.getElementById("form")
    let divs = Array.prototype.slice.call(form.getElementsByTagName("div"))
    data = divs.map(element => getCakeDataFromDiv(element));
    console.log(data)
    findBestPack(1100)
}


function createInput(id, type, placeholder) {
    let input = document.createElement("input")
    input.type = type
    if(type == "number"){
        input.min = "0"
    }
    input.id = id
    input.placeholder = placeholder
    return input
}

function createBoloItem() {
    let div = document.createElement("div")
    let idBolo = `Bolo${numberOfBolos}`
    div.id = idBolo

    let boloNameInput = createInput("nome"+idBolo, "text", "Nome do Bolo")
    let bolovalorInput = createInput("valor"+idBolo, "number", "Valor de Venda")
    let boloCostInput = createInput("custo"+idBolo, "number", "Custo de Produção")
    let boloQuntityInput = createInput("quantidade"+idBolo, "number", "Quantidade máxima")

    div.appendChild(boloNameInput)
    div.appendChild(bolovalorInput)
    div.appendChild(boloCostInput)
    div.appendChild(boloQuntityInput)


    numberOfBolos++;
    return div
}

function adicionarBolo() {
    let form = document.getElementById("form")
    form.insertBefore(createBoloItem(), document.getElementById("addCakeItem"))
}

function main(){
    let form = document.getElementById("form")
    form.insertBefore(createBoloItem(), document.getElementById("addCakeItem"))
    form.addEventListener('submit', handleForm);
    let orcamentoInput = createInput("orcamento", "number", "Orçamento")
    form.prepend(orcamentoInput)
}

var numberOfBolos = 0
main()