// selector input
const pro_name = document.querySelector(".input-box #name");
const pro_amut = document.querySelector(".input-box #amut");
const pro_label = document.querySelector(".input-box #label");
const pro_alert = document.querySelector(".input-box #alert");
const btnSave = document.querySelector(".input-box #btnSave");
btnSave.addEventListener("click",OrderList); // Save Button

//order variable
const goods = document.querySelector(".goods");
let frameOrder = document.createElement("div");
goods.appendChild(frameOrder);

//history variable
const history = document.querySelector(".history");

//Product list
let pros = [];

//Get Product infomation
function getProduct(){
    let pro = [pro_name.value,pro_amut.value,pro_alert.value,pro_label.value];
    // check if products are in the list
    for(let i=0; i<pros.length; i++){
        if(pros[i][0] === pro_name.value){
            if(parseInt(pro_amut.value) < 0){
                RemoveStok(pros[i][1],i);
            }else if(parseInt(pro_amut.value) > 0){
                AddStock(pros[i][1],i)
            }else{
                editWorning(i);
                alert("อัพเดทข้อมูลเรียบร้อย");
            }
            return;
        }
    }
    if(parseInt(pro_amut.value) < 0){
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    }else{
        if(pro[0].trim() != "" && pro[1].trim() != "" && pro[2].trim() != "" ){
            pros.push(pro);
            alert("อัพเดทข้อมูลเรียบร้อย");
            HistoryList(pro,pro_amut.value,"+");
        }else{
            alert("กรุณากรอกข้อมูลให้ครบ");
        }
    }
}

//Amount of Product Output
function OrderList(){
    getProduct();
    frameOrder.remove();
    frameOrder = document.createElement("div");
    goods.appendChild(frameOrder);
    for(let i=0 ; i<pros.length; i++){
        let order = document.createElement("div");
        let order_name = document.createElement("div");
        let order_amut = document.createElement("div");
        order_amut.className = "order_amut";
        order.className = proWorning(pros[i][1],pros[i][2]);
        order_name.innerText = pros[i][0];
        order_amut.innerText = pros[i][1];
        order.append(order_name,order_amut);
        frameOrder.appendChild(order);
    }
}

//Product History Output
function HistoryList(pro,amut,operator){
    let order = document.createElement("div");
    order.className = "product";
    order.innerText = pro[0] + " " + operator + amut + " " + pro[3];
    history.appendChild(order);
}

//remove stock
function RemoveStok(amut,i){
    let newAmut = parseInt(amut) + parseInt(pro_amut.value);
    if(newAmut < 0){
        alert("จำนวนสินค้าติดลบ");
        return;
    }else{
        pros[i][1] = newAmut;
        editWorning(i);
        alert("อัพเดทข้อมูลเรียบร้อย");
        HistoryList(pros[i],pro_amut.value,"");
    }
}

//Out of stock
function proWorning(amut,proAlert){
    if(amut <= proAlert){
        return "proAlert";
    }else{
        return "product";
    }
}

function editWorning(i){
    if(pro_alert.value.trim() != ""){
        pros[i][2] = pro_alert.value;
    }
}

//add on stock
function AddStock(amut,i){
    let newAmut = parseInt(amut) + parseInt(pro_amut.value);
    pros[i][1] = newAmut;
    editWorning(i);
    alert("อัพเดทข้อมูลเรียบร้อย");
    HistoryList(pros[i],pro_amut.value,"+"); 
}