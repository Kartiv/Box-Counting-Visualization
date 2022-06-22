//Linear Fit
function line_fit(x,y){
    let n = x.length;
    let x0 = jsn.ones(n);

    let At = new Matrix([x0,x]);
    A = At.T();
    let B = At.dot(A);
    let C = At.dot(new Vector(y));

    let detB = B.data[0][0]*B.data[1][1]-B.data[0][1]*B.data[1][0];
    
    let invB = new Matrix([ [B.data[1][1], -B.data[1][0]], [-B.data[0][1], B.data[0][0]] ]).scale(1/detB);

    return invB.dot(C)
}

//Dimension Calculations

function boxCount(im, eps){
    let n = im.length;
    let q = parseInt(n/eps);
    let r = n-q*eps;

    let N = 0;
    
    for(let br=0; br<q; br++){
        for(let bc=0; bc<q; bc++){
            c = im[br*eps][bc*eps]
            flag = true;
            for(let i=0; i<eps; i++){
                if(!flag){
                    break;
                }
                for(let j=0; j<eps; j++){
                    if(im[br*eps+i][bc*eps+j] != c){
                        N+=1;
                        flag = false;
                        break;
                    }
                }
            }
        }
    }
    return N
}


function dimension(im){
    let bList = jsn.factors(im.length);
    let NList = [];
    for(let eps of bList){
        NList.push(boxCount(im,eps));
    }

    return line_fit(bList.map(x=>Math.log(1/x)), NList.map(x=>Math.log(x))).coords[1];
}





//Drawing

function convert(data, colorList = ["crimson", "black", "orange", "indigo"]){
    let a = [];
    for(let i=0; i<data.length; i++){
        a.push([]);
        for(let j=0; j<data[i].length; j++){
            a[i].push(colorList[data[i][j]]);
        }
    }
    return a;
}

function draw(data){
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            ctx.fillStyle = data[i][j];
            ctx.fillRect(i,j,1,1);
            ctx.fill();
        }
    }
}

//script

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 1600;
canvas.style.border = "solid";

const plotCanvas = document.getElementById('plotCanvas');
const plotctx = plotCanvas.getContext('2d');
plotCanvas.width = 400;
plotCanvas.height = 400;
plotCanvas.style.border = "solid";

// let img = new Image()
// img.src = "Fractal.png";

// img.onload = ()=>{
//     ctx.drawImage(img, 0, 0, 1600, 1600);
//     var dat = ctx.getImageData(0,0,1600,1600);
// }

data = convert(data);
draw(data);

let X = jsn.factors(data.length).map(x=>Math.log(1/x));
let Y = jsn.factors(data.length).map(x=>Math.log(boxCount(data,x)));

let graph = new Graph(plotCanvas);
graph.scatter(X,Y);