var snake = {
    vreme: {
        div: document.querySelector("#time"),
        sek: 0,
        min: 0,
        v: "",
        vremeSek: 0,
        tick: function () {
            this.sek++;
            this.vremeSek++;
            if (this.sek == 60) {
                this.min++;
                this.sek = 0;
            }
        },
        start: function () {
            var that = this;
            if (!that.v)
                that.v = setInterval(function () {
                    that.tick();
                    that.prikazi();
                }, 1000);
        },
        reset: function () {
            this.min = 0;
            this.sek = 0;
            this.vremeSek = 0;
        },
        prikazi: function () {
            var m = (this.min < 10) ? '0' + this.min : this.min;
            var s = (this.sek < 10) ? '0' + this.sek : this.sek;

            this.div.innerHTML = m + ':' + s;
        },
        pauza: function () {
            var that = this;
            if (that.v) {
                clearInterval(that.v);
                that.v = false;
            }
        }
    },
    tablaDivovi: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    tablaDogadjaji: [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    zmijaK: [
        [ 5, 7]
    ],
    glavni: document.querySelector("#glavni"),
    iPom: -1,
    jPom: 0,
    zmijaI: 1, 
    zmijaJ: 1,
    pocetak: true,
    poeni: 0,
    pp: [0,0],  //poslednji pravac
    score: document.querySelector('#score'),
    tezina: 500,
    ogTezina: 500,
    rezultat: [],
    lis: [],
    pauza: false,
    easy: document.getElementById("easy"),
    normal: document.getElementById("normal"),
    hard: document.getElementById("hard"),
    epic: document.getElementById("epic"),
    getRndmInt: function(x){
        return Math.floor(Math.random() * Math.floor(x));
    },
    htmlDivs: function(){
        for (var i=0; i<10; i++){
            for (var j=0; j<14; j++){
                this.tablaDivovi[i][j] = document.createElement("div");
                this.tablaDivovi[i][j].classList.add("tabla");
                this.glavni.appendChild(this.tablaDivovi[i][j]);
            }
        }
    },
    resetTabli: function (){
        for (var i=0; i<10; i++)
            for (var j=0; j<14; j++){
                this.tablaDivovi[i][j].classList.remove('telo');
                this.tablaDogadjaji[i][j] = 0;
            }
    },
    prikazi: function (x){
        // var that = this;
        for (let i=0; i<x.length; i++){
            var zi = x[i][0];
            var zj = x[i][1];
            var prviI = x[0][0];
            var prviJ = x[0][1];
            this.tablaDivovi[prviI][prviJ].classList.add('glava');
            this.tablaDogadjaji[zi][zj] = 1;
            this.tablaDivovi[zi][zj].classList.add('telo');
            this.tablaDivovi[zi][zj].classList.remove('glava');
        }
    },
    zmijaStart: function(){
        var that = this;
        if (this.pocetak) {
            this.vreme.start();
            this.zmijaI = this.zmijaK[0][0];
            this.zmijaJ = this.zmijaK[0][1];
            var zbirKooVocke = this.dodajVocku();
            var pomeraj = setInterval(function(){
                that.zmijaI += that.iPom;
                that.zmijaJ += that.jPom;
                var kraj = that.ispitajKraj( that.zmijaI, that.zmijaJ, pomeraj);
                that.zmijaK.pop();
                that.zmijaK.unshift([that.zmijaI,that.zmijaJ]);
                        if ( kraj ){
                            var zbirKooZmija = that.zmijaI.toString() + that.zmijaJ.toString();
                            that.pp = [that.iPom,that.jPom];
                            that.resetTabli();
                            that.prikazi(that.zmijaK);
                            if ( zbirKooVocke==zbirKooZmija ){
                                if ( that.ogTezina==800 )
                                    that.tezina -= 3;
                                that.zmijaK.unshift([that.zmijaI,that.zmijaJ]);
                                that.tablaDivovi[that.zmijaI][that.zmijaJ].classList.remove('vocka');
                                that.poeni += 10;
                                that.score.innerHTML = that.poeni;
                                zbirKooVocke = that.dodajVocku();
                            }
                        }
                        else {
                            that.krajIgre();
                        }
            }, this.tezina);
        }
        this.pocetak = false;
    },
    ispitajKraj: function ( x, y, z){
    
        if( x < 0 || x > 9 || y < 0 || y > 13 ){
            clearInterval(z);
            return false;
        }
        else if ( this.tablaDogadjaji[x][y]==1 ){
            clearInterval(z);
            return false;
        }
        else {
            return true;
        }
    },
    krajIgre: function(){
        var jedanRez = {};
        var vremeIgre = document.querySelector('#time').textContent;
        alert("Igra je gotova! Score: "+ this.poeni+", Vreme: " + vremeIgre);
        jedanRez.ime = prompt("Upisite ime (do cetiri slova): ");
        while (jedanRez.ime.length > 4 || jedanRez.ime.length == 0){
            jedanRez.ime = prompt("Upisite ime (do cetiri slova): ");
        }
        jedanRez.bodovi = this.poeni;
        jedanRez.vremeRez = this.vreme.vremeSek;
        this.rezultat.push(jedanRez);
        this.upisiRezultat( this.rezultat);

        this.zmijaK = [
            [ 5, 7],
        ];
        this.pp = [0,0];
        this.poeni = 0;
        this.score.innerHTML = this.poeni;
        this.iPom = -1; 
        this.jPom = 0;
        this.resetTabli();
        this.prikazi(this.zmijaK);
        this.pocetak = true;
        for (var i=0; i<10; i++)
            for (var j=0; j<14; j++)
                this.tablaDivovi[i][j].classList.remove('vocka');
        this.vreme.pauza();
        this.vreme.reset();
        this.vreme.prikazi();
    },
    upisiRezultat: function(x){
        x.sort((a,b) => {
            if (b.bodovi > a.bodovi) return 1;
            if (a.bodovi > b.bodovi) return -1;
            if (a.vremeRez < a.vremeRez) return -1;
            else return 1;
        });
        var lista = document.querySelector('#lista');
        lista.innerHTML = '';
        var p = [];
        for ( let i=0; i<x.length; i++){
            this.lis[i] = document.createElement('li');
            for ( let j=0; j<3; j++){
                p[j] = document.createElement('p');
                p[j].classList.add('pScore');
                this.lis[i].appendChild(p[j]);
            }
            p[0].innerHTML = x[i].ime;
            p[1].innerHTML = x[i].bodovi;
            p[2].innerHTML = x[i].vremeRez;
            lista.appendChild(this.lis[i]);
        }
        if ( x.length > 10 )
            x.pop();
        localStorage.setItem('rezultati', JSON.stringify(x));
    },
    dodajVocku: function(){
        var vockaI = this.getRndmInt(9);
        var vockaJ = this.getRndmInt(14);
        while ( this.tablaDogadjaji[vockaI][vockaJ]==1 ){
            vockaI = this.getRndmInt(9);
            vockaJ = this.getRndmInt(14);
        }
        this.tablaDivovi[vockaI][vockaJ].classList.add('vocka');
        this.tablaDogadjaji[vockaI][vockaJ] = 3;
        return vockaI.toString()+vockaJ.toString();
    },
    dugme: function(event){
        var that = this;
        var x = event.which || event.keyCode;
        var stiPom = this.iPom, stjPom = this.jPom;
        switch (x) {
            case 87:                   // w
            case 38:
            if ( this.iPom!=1 || this.jPom!=0 ){
                this.iPom = -1;
                this.jPom = 0;
            }
            break;
            case 83:                   // s
            case 40:
            if ( this.iPom!=-1 || this.jPom!=0 ){
                this.iPom = +1;
                this.jPom = 0;
            }
            break;
            case 65:                   // a
            case 37:
            if ( this.iPom!=0 || this.jPom!=+1 ){
                this.iPom = 0;
                this.jPom = -1;
            }
            break;
            case 68:                   // d
            case 39:
            if ( this.iPom!=0 || this.jPom!=-1 ){
                this.iPom = 0;
                this.jPom = +1;
            }
            break;
        }
        if( (this.pp[0] == -this.iPom && this.iPom!=0) || 
(this.pp[1] == -this.jPom && this.jPom!=0) ){ 
            this.iPom = stiPom;
            this.jPom = stjPom;
        }
    }
}
var rezLS = JSON.parse(window.localStorage.getItem('rezultati'));
if (rezLS){
    snake.upisiRezultat(rezLS);
    snake.rezultat = rezLS;
}
snake.score.innerHTML = snake.poeni;
snake.easy.onclick = function(){
    snake.tezina = 500;
    ogTezina = 500;
}
snake.normal.onclick = function(){
    snake.tezina = 300;
    ogTezina = 300;
}
snake.hard.onclick = function(){
    snake.tezina = 200;
    ogTezina = 200;
}
snake.epic.onclick = function(){
    snake.tezina = 100;
    ogTezina = 800;
}
snake.htmlDivs();
snake.prikazi(snake.zmijaK);
document.querySelector("#start").onclick = snake.zmijaStart.bind(snake);
window.addEventListener('keyup', snake.dugme.bind(snake));