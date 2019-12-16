

var budgetControler = (function () {

    // create function contructor exp and inc 

    var Expenses = function (id, des, value) {
        this.id = id;
        this.des = des;
        this.value = value;
        this.percentage = 0;
    }
    Expenses.prototype.calcu = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = 0;
        }
    }
    Expenses.prototype.getPer = function () {
        return this.percentage;
    }

    var Incomes = function (id, des, value) {
        this.id = id;
        this.des = des;
        this.value = value;
    }
    // create data structure 
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
    }
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        })
        data.totals[type] = sum;

    }

    return {
        // add new item
        addItem: function (type, des, value) {
            var newItem, ID;
            // Create new Id for newItem
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // check + or -
            if (type === "exp") {
                newItem = new Expenses(ID, des, value);
            } else if (type === "inc") {
                newItem = new Incomes(ID, des, value);
            }

            // push newItem into data 
            data.allItems[type].push(newItem);

            return newItem;
        },
        // testing function 

        testing: function () {
            console.log(data);
        },
        calculateBudget: function () {   // làm lại cách truyền argument type vào  

            // calculate total income and expense

            calculateTotal("inc");
            calculateTotal("exp");

            // calculate the budget : income - expense 

            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExpen: data.totals.exp,
                percentage: data.percentage
            }
        },

        deleteItem: function (type, id) {
            // [0 , 1, 2,  3]
            var ids, index;
            // 2 // index = 2 , id = 2 
            ids = data.allItems[type].map(current => {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            console.log(data);
        },

        calculatePercentages: function () {
            // 
            data.allItems.exp.forEach(cur => {
                cur.calcu(data.totals.inc);
            });
        },
        getPersentage: function () {
            var list = data.allItems.exp.map(element => {
                return element.getPer();
            })
            return list;
        }

    }
})();


var UIcontroler = (function () {
    var DOMStrings = {
        inputType: ".add__type",
        inputDes: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        expenseContainer: ".expenses__list",
        incomeContainer: ".income__list",
        incomeBudget: ".budget__income--value",
        expensesBudget: ".budget__expenses--value",
        budgetPercentage: ".budget__expenses--percentage",
        budgetValue: ".budget__value",
        container: ".container",
        incList: ".income__list",
        expList: ".expenses__list",
        itemPer: ".item__percentage", 
        classTime : ".budget__title--month"
    };
    var formatNumber = function (type, num) {
        /*
            1234.5674 => + 1,234.56
            1234 => + 1,234.00
            
        */
        var inter, float, numSplit;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split(".");
        inter = numSplit[0];

        if (inter.length > 3) {                 // 56,452 
            inter = inter.substr(0, inter.length - 3) + "," + inter.substr(inter.length - 3, 3);
        }

        float = numSplit[1];

        return (type === "inc" ? "+" : "-") + " " + inter + "." + float;
    };

    var nodeForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    // 1. Get the input field data
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                des: document.querySelector(DOMStrings.inputDes).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        // 2 add the item into UI desgin 
        addListItem: function (obj, type) {
            var html, newHTML, element;
            // create HTML string with placehoder text
            if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace HTML String with real data
            newHTML = html.replace("%id%", obj.id);
            newHTML = newHTML.replace("%des%", obj.des);
            newHTML = newHTML.replace("%value%", formatNumber(type, obj.value));

            // Insert newHTML into the DOM

            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);

        },

        // ??? 
        clearFields: function () {
            var field, fieldArray;

            // field is a list 
            field = document.querySelectorAll(DOMStrings.inputDes + "," + DOMStrings.inputValue);

            // old way to convert an argument into an array
            fieldArray = Array.prototype.slice.call(field);

            // loop array and set to ""
            fieldArray.forEach(current => {
                current.value = "";
            });
            fieldArray[0].focus(); // focus on des
        },

        getDomStrings: function () {
            return DOMStrings;
        },

        displayBudget: function (obj) {

            // display value for the information of Budget 
            var type;
            obj.budget >= 0 ? type ="inc" : type = "exp";

            // chuan form chung ta dinh nghia o tren 
            document.querySelector(DOMStrings.budgetValue).innerHTML = formatNumber(type , obj.budget);


            document.querySelector(DOMStrings.incomeBudget).innerHTML = formatNumber("inc" , obj.totalInc);
            document.querySelector(DOMStrings.expensesBudget).innerHTML = formatNumber("exp" ,obj.totalExpen);

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetPercentage).innerHTML = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.budgetPercentage).innerHTML = "-";
            }
        },

        UIdeleteItem: function (selectorID) {
            var ele = document.getElementById(selectorID);
            ele.parentNode.removeChild(ele);
        },

        displayPercentage: function (obj) {
            // get all expenses item We have
            var listItem = document.querySelectorAll(DOMStrings.itemPer);

            

            nodeForEach(listItem, function (current, index) {
                if (obj[index] > 0) {
                    current.innerHTML = obj[index] + "%";
                } else {
                    current.innerHTML = "--";
                }

            })
        },
        
        displayTime : function () {
            var year , now , time, month  , listMonth;
            listMonth = ["Jaunary" , "Frebrury" , "March" , "April" , "May" , "June" , "July" , "August" ,
                        "September" , "October", "November" , "December"];
            
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            
            // switch (monthNum) {
            //     case 1 : {
            //         monthStr = "Jaunary";
            //         break;
            //     }
                                 // ko tối ưu , vẫn dùng đc 
            //     case 11 : {
            //         monthStr = "November";
            //         break;
            //     }
            //     case 12 : {
            //         monthStr = "December";
            //         break;
            //     
            // }
            
            time =  listMonth[month] + " " + year;   
            document.querySelector(DOMStrings.classTime).innerHTML = time;
        }, 
        changeType : function(){
            var list = document.querySelectorAll( DOMStrings.inputDes + "," + DOMStrings.inputType + "," + DOMStrings.inputValue);
            nodeForEach(list , function(cur) {
                cur.classList.toggle("red-focus");
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
        }

    }
})();


var controler = (function (budgetCtrl, UICtrl) {
    // set event
    var DOM = UICtrl.getDomStrings();
    var setupEventListeners = function () {

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        // add event listener 
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change" , UICtrl.changeType);
    }


    var calcPercentages = function () {
        // calculate the persenatges
        budgetCtrl.calculatePercentages();

        // get the persentage
        var listPer = budgetCtrl.getPersentage();

        // Display them on the UI
        UICtrl.displayPercentage(listPer);
    }



    var updateBudget = function () {

        // 1 . Calculate the budget
        budgetCtrl.calculateBudget();

        // 2 . Get the budget
        var budgetInfor = budgetCtrl.getBudget();
        console.log(budgetInfor);

        // 3 . Display the budget on the UI 
        UICtrl.displayBudget(budgetInfor);

        // 4 . Updating the Persentage after delete some element 
        calcPercentages();
    }


    var ctrlAddItem = function () {

        var input, newItem;
        // 1 Get the field input data 
        input = UICtrl.getInput();
        console.log(input);
        if (input.des !== "" && input.value > 0 && !isNaN(input.value)) {

            // 2 Add the Item budget Controler 
            newItem = budgetCtrl.addItem(input.type, input.des, input.value);

            // test     
            var x = budgetCtrl.testing();


            // 3 .  Add the item to the UI 

            UICtrl.addListItem(newItem, input.type);


            // 4 Clear fields
            UICtrl.clearFields();

            // 5 Update Budget 
            updateBudget();

            // 6 Calculate the Persentage of each Item 
            calcPercentages();

        }

    }
    // get the information of the Item ( id && type);
    var ctrlDeleteItem = function (event) { // event bubbing  
        var ID, type, splitID, itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // truy cập lên phần tử cha
        // các cấp bậc 
        console.log(itemID);                // example : inc-0
        splitID = itemID.split("-");        // => ["inc", "0"]

        ID = parseInt(splitID[1]);                    // => 0
        type = splitID[0];                  // => inc

        /*
        Event.target : là phần tử sẽ tham chiếu đến phần tử được thiết lập sự kiện.
                        Hay nói cách khác, nó xác định thành phần HTML mà sự kiện đã xảy ra
        Event.currentTarget() : xác định target hiện tại cho sự kiện, khi sự kiện đi qua DOM.
                                 Hay nói cách khác event.currentTarget sẽ trả về thành phần mà
                                  trên đó eventListener được thêm vào
        Do event bubbing, chúng ta có thể đặt eventListener trên một phần tử HTML cha
        và eventListener đó sẽ được thực thi bất cứ khi nào một sự kiện xảy ra trên bất
        kỳ phần tử con nào của nó - ngay cả khi các phần tử con này được thêm vào trang
        sau khi tải.

        */

        // delete the item from data structure
        budgetCtrl.deleteItem(type, ID);

        // delete the item from UI interface 
        UICtrl.UIdeleteItem(itemID);


        // re-calculate the budget 
        updateBudget();
        // update  the budget   
    }

    return {
        init: function () {
            console.log("Start Application");
            UICtrl.displayTime();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExpen: 0,
                percentage: 0
            });
            setupEventListeners();
            
        }
    }

})(budgetControler, UIcontroler);

controler.init();


// updating the percentages 