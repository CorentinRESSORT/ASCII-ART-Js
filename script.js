"use strict";

const canv = document.getElementById("canvas1");
const ctx = canv.getContext("2d");

const image1 = new Image();
image1.src =  './assets/alan.png';

class Cell
{
    constructor(x, y , symbol, color)
    {
        this.x  = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class AsciiEffect
{
    #imageCellArray = [];
    #symbols = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height)
    {
        this.#ctx = ctx;
        this.#height = height;
        this.#width = width;

        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0,0, this.#width, this.#height);
    }
    
    #convertToSymbol(g)
    {
        let symbol;
         if (g > 250) symbol = '';
         else if (g > 240) symbol = '*';
         else if (g > 220) symbol = '+';
         else if (g > 210) symbol = '#';
         else if (g > 200) symbol = '&';
         else if (g > 190) symbol = '%';
         else if (g > 180) symbol = '_';
         else if (g > 170) symbol = ':';
         else if (g > 160) symbol = '$';
         else if (g > 150) symbol = 'V';
         else if (g > 140) symbol = '2';
         else if (g > 130) symbol = ')';
         else if (g > 120) symbol = ']';
         else if (g > 110) symbol = '°';
         else if (g > 100) symbol = '£';
         else if (g > 90) symbol = 'é';
         else if (g > 80) symbol = 'c';
         else if (g > 70) symbol = 'm';
         else if (g > 60) symbol = '-';
         else if (g > 50) symbol = ':';
         else if (g > 40) symbol = 'µ';
         else if (g > 30) symbol = '=';
         else if (g > 20) symbol = 'à';
         else if (g > 10) symbol = 'ç';
         return (symbol);
    }

    #scanImage(cellSize)
    {
        this.#imageCellArray = [];

        // this.#pixels.height because it contains the heigth of the Image (object ImageData) given in the constructor
        for (let y = 0; y < this.#pixels.height; y += cellSize) 
            {
                for (let x = 0; x < this.#pixels.width; x += cellSize)
                    {
                        const posX = x * 4;
                        const posY = y * 4;
                        const pos = (posY * this.#pixels.width) + posX;

                        if (this.#pixels.data[pos + 3] > 128)
                            {
                                const red =this.#pixels.data[pos];
                                const green =this.#pixels.data[pos + 1];
                                const blue = this.#pixels.data[pos + 2];

                                const total = red+green+blue;
                                const averageColorValue = total / 3;
                                const color = `rgb(${red}, ${green}, ${blue})`;

                                const symbol = this.#convertToSymbol(averageColorValue);

                                this.#imageCellArray.push(new Cell(x, y, symbol, color));
                            }
                    }
            }
            console.log(this.#imageCellArray);
    }

    #drawAscii()
    {
        this.#ctx.clearRect(0,0,this.#width, this.#height);
        this.#imageCellArray.forEach((elem)=>{
            elem.draw(this.#ctx);
        });
    }
    draw(cellSize)
    {
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}

let effect;
image1.onload = function initialize(){
    canv.width = image1.width;
    canv.height = image1.height;
    // ctx.drawImage(image1, 0,0);

    effect = new AsciiEffect(ctx, image1.width, image1.height);
    }

    let i = 25;
    let int = setInterval(()=>{
        ctx.font = i * 1.2 + "px Verdana";
        effect.draw(i--);
        if (i < 15) clearInterval(int);
    }, 30);
