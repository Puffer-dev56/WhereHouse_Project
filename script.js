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
    pros.push(pro);
    HistoryList(pro);
}

//Add Element in Production List
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
        order.className = "product";
        order_name.innerText = pros[i][0];
        order_amut.innerText = pros[i][1];
        order.append(order_name,order_amut);
        frameOrder.appendChild(order);
    }
}

//Add Element in History List 
function HistoryList(pro){
    let order = document.createElement("div");
    order.className = "product";
    order.innerText = pro[0] + " " + pro[1] + " " + pro[3];
    history.appendChild(order);
}

//remove stock
function RemoveStok(){

}

//add on stock
function AddStock(){
    
}