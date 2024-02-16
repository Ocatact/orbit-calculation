// import {new Decimal as new Decimal} from "new Decimal.js";
// const new Decimal = require("new Decimal.js");

// const { Plotly } = require("./lib/plotly-2.29.0");

function dvdt(T, v, rho_out, V, g, m, M, p, R, k) {
    return ( rho_out.times(V.times(g))
                .minus(
                    m.plus(
                        p.times(M.times(V))     .div(R.times(T))
                    ).times(g)
                ).minus(
                    k.times(v)
                )
            ).div(
                m.plus(
                    p.times(M.times(V))     .div(R.times(T))
                )
            );
}


function dTdt(T, epsilon, sigma, T_out, C, S, Cv, V) {
    return ( (epsilon.times(
                sigma.times(
                    T_out.toPower(new Decimal(4))
                    .minus(
                        T.toPower(new Decimal(4))
                    )
                )
            ).plus(
                C.times(T_out.minus(T))
            )
            ).times(S)     .div(Cv.times(V)));
}

function main() {
    function generateTable(tz_list) {
        const div = document.createElement("div");
        const tbl = document.createElement("table");
        const tblHead = document.createElement("thead");
        const tblhT = document.createElement("th");
        const headT =  document.createTextNode("t");
        const tblhZ = document.createElement("th");
        const headZ = document.createTextNode("z");
        tblhT.appendChild(headT);
        tblhZ.appendChild(headZ);

        tblHead.appendChild(tblhT);
        tblHead.appendChild(tblhZ);
        const tblBody = document.createElement("tbody");
        

    
        for (let i = 0; i < tz_list[0].length; i ++) {
            const row = document.createElement("tr");
            
            for (let j = 0; j < 2; j ++) {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(Math.round(tz_list[j][i]*Decimal(1000000000))/Decimal(1000000000))
    
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
    
            tblBody.appendChild(row);
        
        }
        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);
        div.appendChild(tbl);
        const content = document.querySelector(".content");
        content.appendChild(div);
        tbl.classList.add("additional-class");
        div.classList.add("tbl_div");
        div.classList.add("item");
        div.classList.add("additional-div");


    }
    
    // function appendStyle() {
    //     const style = document.createElement("style");
    //     const css = `
    //     table .additional-class tbody{
    //         border-collapse: collapse;
    //         width: -moz-max-content;
    //         width: max-content;
    //         margin: auto;
    //         border-width: 2;
    //         border-color: gray;
    //         padding: 0;
    //         outline-width: 1;
    //         table-layout: fixed;
    //       }
    //     table .additional-class tbody tr {
    //         border-top: 0.5px solid gray;
    //         border-bottom: 0.5px solid gray;
    //       }
    //     table .additional-class thead th {
    //         background-color: #ccc;
    //         font-size: 0.85em;
    //       }
    //     table .additional-class thead th, table .additional-class tbody td {
    //         border-left: 0.5px solid gray;
    //         padding: 0.25em 10px 0.25em 0.5em;
    //         border-right: 2px solid gray;
    //         width: auto;
    //       }
    //     `;
    
    //     style.appendChild(document.createTextNode(css));
    //     document.head.appendChild(style);
        
    // }
    
    function showPlot(n_t_list, n_z_list) {
        const plotarea = document.createElement("div");
        plotarea.classList.add("item");
        plotarea.classList.add("additional-div");
        plotarea.classList.add("plot")
        document.querySelector(".content").appendChild(plotarea);
        let data = [{
            x: n_t_list,
            y: n_z_list,
            hoverinfo: "x+y",
            type: "scatter",
            mode: "markers",
    
        }];
        let layout = {
            font: {
                family: "Open Sans"
            },
            xaxis: {
                title: "時間(s)"
            },
            yaxis: {
                title: "高度(m)"
            },
            title: "高度",
            hovermode: "closest",
            width:600, height:600, 
            // margin: {t : 0},
        };
        Plotly.newPlot(plotarea, data, layout);

    }
    
    
    // 微小時間(s)
    let dt = new Decimal(document.getElementById("dt").value !== "" ? document.getElementById("dt").value : 0);

    // 計算範囲指定
    let tmax = dt.times(new Decimal(document.getElementById("tmax").value !== "" ? document.getElementById("tmax").value : 0));

    // 初期値(変数)
    let t = new Decimal(document.getElementById("t").value !== "" ? document.getElementById("t").value : 0); // 時刻(s)
    let T = new Decimal(document.getElementById("T").value !== "" ? document.getElementById("T").value : 0); // 気球内温度(K)
    let v = new Decimal(document.getElementById("v").value !== "" ? document.getElementById("v").value : 0); // 気球初速度(m/s)
    let z = new Decimal(document.getElementById("z").value !== "" ? document.getElementById("z").value : 0); // 気球の座標(m)

    // 初期値(定数)
    let rho_out = new Decimal(document.getElementById("rho_out").value !== "" ? document.getElementById("rho_out").value : 0); // 外気密度(kg/m^3)
    let V = new Decimal(document.getElementById("V").value !== "" ? document.getElementById("V").value : 0);// 気球の体積(m^3)
    let g = new Decimal(document.getElementById("g").value !== "" ? document.getElementById("g").value : 0); // 重力加速度(m/s^2)
    let m = new Decimal(document.getElementById("m").value !== "" ? document.getElementById("m").value : 0); // 気球の質量(kg)
    let M = new Decimal(document.getElementById("M").value !== "" ? document.getElementById("M").value : 0); // 空気の平均分子量(kg/mol)
    let p = new Decimal(document.getElementById("p").value !== "" ? document.getElementById("p").value : 0); // 気球内部の圧力(Pa)
    let R = new Decimal(document.getElementById("R").value !== "" ? document.getElementById("R").value : 0); // 気体定数(Pa*m^3/(K*mol))
    let k = new Decimal(document.getElementById("k").value !== "" ? document.getElementById("k").value : 0); // 空気抵抗係数(kg/s) -> 1次のvに比例
    let epsilon = new Decimal(document.getElementById("epsilon").value !== "" ? document.getElementById("epsilon").value : 0); // 輻射率(放射率) (無次元)
    let sigma = new Decimal(document.getElementById("sigma").value !== "" ? document.getElementById("sigma").value : 0); // シュテファン・ボルツマン定数 σ=5.67*10^-8 (W/(m^2*K^4)) 
    let T_out = new Decimal(document.getElementById("T_out").value !== "" ? document.getElementById("T_out").value : 0); // 外気温(K)
    let C = new Decimal(document.getElementById("C").value !== "" ? document.getElementById("C").value : 0); // 熱伝達係数(W/(m^2*K)) -> 材質や機体の形状に依存
    let S = new Decimal(document.getElementById("S").value !== "" ? document.getElementById("S").value : 0); // 気球の表面積(m^2)
    let Cv = new Decimal(document.getElementById("Cv").value !== "" ? document.getElementById("Cv").value : 0); // 空気の定積比熱(J/(kg*K)) -> 乾燥空気で717(J/(kg*K))
    



    //  k0 ~ k3の値(添え字0 -> dvdtの増分k、　添え字1 -> dTdtの増分k)
    let k0 = [new Decimal(0), new Decimal(0)];
    let k1 = [new Decimal(0), new Decimal(0)];
    let k2 = [new Decimal(0), new Decimal(0)];
    let k3 = [new Decimal(0), new Decimal(0)];

    // dv, dTの変数宣言
    let dv = new Decimal(0);
    let dT = new Decimal(0);

    let t_list = [];
    let z_list = [];

    // Runge-Kutta法
    while (t.toNumber() <= tmax.toNumber()) {
        console.log(`t = ${t.toNumber()}`);
        console.log(`z = ${z.toNumber()}`);
        t_list.push(t);
        z_list.push(z);


        // HTML に出力せむ
        // str = str + "<tr>" + ""

        k0[0] = dt.times(dvdt(T, v, rho_out, V, g, m, M, p, R, k));
        k0[1] = dt.times(dTdt(T, epsilon, sigma, T_out, C, S, Cv, V));
        // console.log(`k0[0] = ${k0[0].toNumber()}`)
        // console.log(`k0[1] = ${k0[1].toNumber()}`)
        
        k1[0] = dt.times(dvdt(T.plus(k0[1].div(new Decimal(2))), v.plus(k0[0].div(new Decimal(2))), rho_out, V, g, m, M, p, R, k));
        k1[1] = dt.times(dTdt(T.plus(k0[1].div(new Decimal(2))), epsilon, sigma, T_out, C, S, Cv, V));
        // console.log(`k1[0] = ${k1[0].toNumber()}`)
        // console.log(`k1[1] = ${k1[1].toNumber()}`)

        k2[0] = dt.times(dvdt(T.plus(k1[1].div(new Decimal(2))), v.plus(k1[0].div(new Decimal(2))), rho_out, V, g, m, M, p, R, k));
        k2[1] = dt.times(dTdt(T.plus(k1[1].div(new Decimal(2))), epsilon, sigma, T_out, C, S, Cv, V));
        
        k3[0] = dt.times(dvdt(T.plus(k2[1]), v.plus(k2[0]), rho_out, V, g, m, M, p, R, k));
        k3[1] = dt.times(dTdt(T.plus(k2[1]), epsilon, sigma, T_out, C, S, Cv, V));

        //  加重平均
        dv = (k0[0].plus(new Decimal(2).times(k1[0]).plus(new Decimal(2).times(k2[0]).plus(k3[0])))).div(new Decimal(6));
        dT = (k0[1].plus(new Decimal(2).times(k1[1]).plus(new Decimal(2).times(k2[1]).plus(k3[1])))).div(new Decimal(6));

        v = v.plus(dv);
        // console.log(`v=${v}`)
        T = T.plus(dT);
        z = z.plus(v.times(dt)); // 区分求積

        t = t.plus(dt);

    }

    console.log(z_list);
    let tz_list = [t_list, z_list];

    
    // appendStyle();
    // let str = "<tr><th>t</th><th>z</th></tr>";

    // for (let i=0; i < t_list.length; i++) {
    //     str = str + "<tr><td>" + t_list[i] + "</td><td>" + z_list[i] + "</td></tr>";
    // }
    
    // str = str + "</table>";
    // document.getElementById("edit_area").innerHTML = str;
    // document.getElementById("edit_area").className = "class1";


    // document.getElementById("edit_area").setAttribute("style","border-collapse: collapse;width: -moz-max-content; width: max-content;margin: auto; border-width: 2;border-color: gray; padding: 0;outline-width: 1;table-layout: fixed;");
    // document.getElementById("edit_area").setAttribute("style","tr { border-top: 0.5px solid gray;border-bottom: 0.5px solid gray;  } th { background-color: #ccc;  font-size: 0.85em;  }th, td {border-left: 0.5px solid gray;padding: 0.25em 10px 0.25em 0.5em;border-right: 2px solid gray;  width: auto;    }");

    // document.getElementById("edit_area").style.cssText = "table#edit_area{border-collapse: collapse;width: -moz-max-content;width: max-content;        margin: auto;border-width: 2;        border-color: gray; padding: 0;        outline-width: 1;table-layout: fixed;}table#edit_area tr {border-top: 0.5px solid gray;border-bottom: 0.5px solid gray;}table#edit_area th {background-color: #ccc;font-size: 0.85em;}table#edit_area th, table#edit_area td {border-left: 0.5px solid gray; padding: 0.25em 10px 0.25em 0.5em; border-right: 2px solid gray; width: auto; }"

    // console.log(t_list);
    // console.log(z_list);
    // console.log(z_list[1] + "hello");
    let n_t_list = [];
    let n_z_list = [];

    for (let i=0; i < t_list.length; i++) {
        n_t_list[i] = t_list[i].toNumber();
        n_z_list[i] = z_list[i].toNumber();

    }
    if (document.querySelector(".additional-div") === null) {
        ;
    } else {
        document.querySelector(".additional-div").remove();
        document.querySelector(".additional-div").remove();
        
    }

    generateTable(tz_list);
    showPlot(n_t_list, n_z_list);

    // let t_z_Graph = document.getElementById("graph");
    // let data = [{
    //     x: n_t_list,
    //     y: n_z_list,

    //     hoverinfo: "x+y",
    //     type: "scatter",
    //     mode: "markers",

    // }];
    // let layout = {
    //     hovermode: "closest",
    //     autosize: false, width:600, height:600, margin: {t : 0},
    // };
    // Plotly.newPlot(t_z_Graph, data, layout);
}


// main()

const button = document.querySelector("#btn");
button.addEventListener("click", main);
button.addEventListener("touchstart", main);
