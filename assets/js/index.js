//Deramaux vincent - CDA3 - 2021
// variable utilisé pour l'affichage des images//
var tab_Small= new Array(11);
var tab_Large= new Array(11);
var tab_Search = new Array();

var requeteSearch = new Object();
requeteSearch.indexSearch= "";
requeteSearch.requete="";



var visibleSearch = false;
//Connexion Object pour affichage Image par AJAX//
var search = document.querySelector('#cp');
var entrer = document.querySelector('#Entrer');
var addLine = document.querySelector('#npt__add');
var Scroll = document.querySelector('#stn__Scroll');
var Recherche = document.getElementsByClassName('Recherche')[0];
var image = document.getElementsByClassName('Image')[0];
/////////////////////////////////////////
// Connexion Object pour affichage ToDoList ///
var ToDoList = document.querySelector('.ToDoList');
var SectionToDoList = document.querySelector('#ToDoList');
var inp__Titre = document.querySelector('#Titre');
var inp__ToDo = document.querySelector('#ToDo');
var add__ToDo = document.querySelector('#ToDo__add');
var nptToDoList = document.querySelector('#nptToDoList');
var trashAll = document.getElementById('trash__all');

///////////////////////////
//Au lancement de la page//
///////////////////////////

    FonctionAJAX(lecturelocal());
    lectureToDolocal();
    affCompteTache();

//////////////////////////////////////////////////////////////////////////////////
// switch affichage liste des taches ou celle de la liste des thémes des images.//
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener("keydown",(event)=>{
    //alert(event.code);
    if(event.code=="PageUp"){
        if (!visibleSearch) {
            ToDoList.style.visibility = "hidden";
            SectionToDoList.style.visibility = "hidden";
            image.style.visibility = "visible";
            Recherche.style.visibility = "visible";
            visibleSearch=true;
            image.style.width="300px";
        }
        else{
            ToDoList.style.visibility = "visible";
            SectionToDoList.style.visibility = "visible";
            image.style.visibility = "hidden";
            Recherche.style.visibility = "hidden";
            visibleSearch=false;
            image.style.width="0px";
        }
    };
});


/*************************************************** */
/* Stockage Local des parametres des thémes d'images */
/*************************************************** */

/* Ajourt dans la liste et appel du stockage de la recherche du set d'image en local storage */
addLine.addEventListener('click', function(){
    if (search.value != ""){
        createLigne(search.value.toUpperCase());
        ecritureSearchLocal();
    }
});

/* Lancement de recherche d'un set d'image */
entrer.addEventListener('click', function(){
  
    FonctionAJAX(search.value);

});

/* Appel de l'API PEXELS de recherche d'image par therme */
function FonctionAJAX(requete){
    var xhr = new XMLHttpRequest;
    xhr.withCredentials = true;
    xhr.open("GET", `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${requete}&locale=en-US&per_page=100&page=1`);
    xhr.setRequestHeader("authorization", `${authorization}`);
    xhr.setRequestHeader("x-rapidapi-key", `${xRapidapiKey}`);
    xhr.setRequestHeader("x-rapidapi-host", `${xRapidapiHost}`);
    xhr.send();
     
    xhr.onreadystatechange = function() {
        if ((xhr.readyState==4) && ((xhr.status==200)||(xhr.status==0))){
            callback(xhr.response);
        }
    }
}

/* fonction de traitement des données de retour de l'appel de l'API PEXELS*/ 
function callback(donnees){
    //console.log(data = JSON.parse(donnees));
    var data = JSON.parse(donnees);
    console.log(data);

    createVignette();
    
    for (var i=1;i<10;i++){

        let checked=true;      
        var index = 0;
        do{
            checked=true
            index = Math.floor((Math.random()*80)+1)
            console.log(index);
            for(let k=0;k<10;k++)
            {
                if (tab_Small[k]==data.photos[index].src.tiny){checked=false}
            }
            
        }while (!checked)
        tab_Small[i]= data.photos[index].src.tiny;
        tab_Large[i]= data.photos[index].src.large2x;//landscape;

        let photo = document.getElementById("pht_Sml_" + i);
        photo.src = tab_Small[i];
    }
    landscape(Math.floor(Math.random()*10)+1);
 }
 function landscape(index){
    document.body.style.backgroundImage = `url(${tab_Large[index]})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
 }

/*création DOM des balise img pour stockage des url de retour par la fonction callback ci-dessus */
 function createVignette(){

    var stn__Scroll = document.getElementsByClassName("stn__Scroll")[0];
    
    let  divRemov = document.getElementById("divGlob");
    divRemov.remove()
   
    var divGlob = document.createElement("div");
    divGlob.id = "divGlob";
    stn__Scroll.appendChild(divGlob);

    for (var i = 1; i<10;i++){
        var div = document.createElement("div");
        divGlob.appendChild(div);
	    var option = document.createElement("img");
	    option.classList.add("btn-npt__img");
	    option.id = "pht_Sml_" + i;
        option.setAttribute("onclick", `landscape(${i});`);
	    div.appendChild(option);
    }

}

/* Ajout de dans la liste des thémes du terme de recherche d'image pour l'API PEXELS */
function createLigne(requete){

    if (search.length == 0){return};

    let npt = document.getElementsByClassName("npt")[0];
    let div = document.createElement("div");
    div.classList.add("Search");
    npt.appendChild(div);

    let ButtonDell = document.createElement("a");
    ButtonDell.innerHTML='<i class="fas fa-trash-alt"></i>';
    ButtonDell.addEventListener('click', function() {
		this.parentElement.remove();
        ecritureSearchLocal();
	});
    ButtonDell.classList.add("Search__Input");
    div.appendChild(ButtonDell);

    let ButtonSelect = document.createElement("a");
    ButtonSelect.innerHTML='<i class="fas fa-eye"></i>';

    ButtonSelect.addEventListener('click',function(){

		let index = this.parentNode.children.length;

		for (var i = 0; i < index; i++) {
            
			if (this.parentNode.children[i].tagName == "SPAN"){
                requeteSearch.indexSearch=this.parentNode.children[i].innerHTML;
				FonctionAJAX(encodeURI(this.parentNode.children[i].innerHTML));
                ecritureSearchLocal();
			}
		 }
	});
    ButtonSelect.classList.add("Search__Input");
    div.appendChild(ButtonSelect);

    let span = document.createElement("span");
    span.innerHTML = requete;
    tab_Search.puch = requete;
    span.classList.add("Search__Span");
    div.appendChild(span);

}

/* Fonction de stockage local des termes de recherche d'images */
function ecritureSearchLocal() {
    
    let requete = new Array();
	let index = document.getElementsByClassName("Search__Span").length;
	for (let i=0;i<index;i++){
		requete.push(document.getElementsByClassName("Search__Span")[i].textContent)
	}
    //let indexSearch = indexSelect;

    requeteSearch.requete=requete;
    //requeteSearch.indexSearch="BIKE";

    if(typeof localStorage != "undefined" && JSON){
        
        console.log(JSON.stringify(requeteSearch));
        localStorage.setItem("Search",JSON.stringify(requeteSearch));
    }
    else {
        alert("local Storage non suporte sur ce navigateur !");
    }
}

/* Fonction de lecture dans le stockage local des termes de recherche d'images' */
function lecturelocal() {
	
    if(typeof localStorage != "undefined"){  
        
        let coordonne = JSON.parse(localStorage.getItem("Search"));
        let retour = "CAR";
        if (coordonne == null){
 
            createLigne(retour);
            return retour;
            
        }

		console.log(coordonne.requete);

		for(let i = 0; i<coordonne.requete.length;i++){

			createLigne(coordonne.requete[i]);
		}
        if (coordonne.requete.length == 0){
            createLigne(retour);
            return retour;
        }
        else{
            return coordonne.indexSearch;
        }
        
    }
    else {
        alert(encodeURI("local Storage non suporte sur ce navigateur !"));
    }    
}
/********************************************** */
/* Stockage Local des taches de la ToDo List    */
/********************************************** */
//Déclenchement de l'événement de l'ajout d'une nouvelle tache 

add__ToDo.addEventListener('click', function(){

    switch (verifToDoExistant(inp__Titre.value)) 
    {
        case -1:
            alert("Nom de tache deja existant !");
            break;
        case 0:
            alert("Nom de tache vide");
            break;
        case 1:
            if (inp__ToDo.value != "")
            {
                let  ladate = new Date();
                date = ladate.getDate()+"/"+(ladate.getMonth()+1)+"/"+ladate.getFullYear();
                createTache(inp__Titre.value,inp__ToDo.value,date,false,"gray");
                ecritureToDoListLocal();
            }
            else
            {
                alert("Description de la tache vide  !");
            }
            break;
    }
});

/* Création dans le DOM des lignes de déclaration d'une tache et appel de son stockage en local */
function createTache(tache,description,date,Checked=false,color){

    let npt = document.getElementsByClassName("npt")[1];
    let div = document.createElement("div");
    div.classList.add("ToDo");
    div.style.backgroundColor=color;
    npt.appendChild(div);

    let ButtonDell = document.createElement("a");
    ButtonDell.innerHTML='<i class="fas fa-trash-alt"></i>';
    ButtonDell.addEventListener('click', function() {
		this.parentElement.remove();
        ecritureToDoListLocal();
        affCompteTache();
	});
    ButtonDell.classList.add("ToDo__Trash");
    div.appendChild(ButtonDell);

    let ButtonSelect = document.createElement("a");
    if (Checked==0)
    {
    ButtonSelect.innerHTML='<i class="far fa-user"></i>';
    }
    else
    {
    ButtonSelect.innerHTML='<i class="fas fa-user-check"></i>';
    }
    ButtonSelect.value=0;
    ButtonSelect.addEventListener('click',function(){
        this.innerHTML='<i class="fas fa-user-check"></i>';
        this.value=1;
        ecritureToDoListLocal();
	});
    ButtonSelect.classList.add("ToDo__Check");
    div.appendChild(ButtonSelect);

    let ButtonPalette = document.createElement("a");
    ButtonPalette.innerHTML='<i class="fas fa-palette"></i>';
    ButtonPalette.addEventListener('click', function() { 
        let divColor = this.parentElement;
        if (divColor.style.backgroundColor == "green"){
            divColor.style.backgroundColor = "orange";
        }else if(divColor.style.backgroundColor == "orange"){
            divColor.style.backgroundColor = "red";
        }else{
            divColor.style.backgroundColor = "green";
        }
        ecritureToDoListLocal();
        affCompteTache();
	});
    ButtonPalette.classList.add("ToDo__Palette");
    div.appendChild(ButtonPalette);


    let span_Date = document.createElement("span");
    span_Date.innerHTML = date;
    span_Date.classList.add("ToDo__Date");
    div.appendChild(span_Date);

    let span_Tache = document.createElement("span");
    span_Tache.innerHTML = tache;
    span_Tache.classList.add("ToDo__Tache");
    div.appendChild(span_Tache);

    let span_Desc = document.createElement("span");
    span_Desc.innerHTML = description;
    span_Desc.classList.add("ToDo__Desc");
    div.appendChild(span_Desc);
//affichage de la ligne du nombre de tache
    affCompteTache()

}
//Fonction d'affichage de la ligne du nombre de tache
function affCompteTache(){

    let index = document.getElementsByClassName("ToDo__Tache").length;
    let nbr__Tache = document.getElementsByClassName("nbr")[0];

    nbr__Tache.textContent = 'Nombre de Tache : ' + index ;
    nbr__Tache.innerHTML= '<a id="trash__all" onclick="eraseList()"><i class="fas fa-trash-alt"></i></a><span style="margin-left:15px;">Nombre de Tache : ' + index +' </span>';
}

/* Fonction de stockage en local d'une tache, sa description et de l'état de sa prise en compte */
function ecritureToDoListLocal() {

    var LocalTache = new Object(); 
    LocalTache.Tache=[];
    LocalTache.Description=[];
    LocalTache.date=[];
    LocalTache.Checked=[];
    LocalTache.color=[];

	var index = document.getElementsByClassName("ToDo__Tache").length;
 
	for (let i=0;i<index;i++){

		LocalTache.Tache.push(document.getElementsByClassName("ToDo__Tache")[i].textContent);
        LocalTache.Description.push(document.getElementsByClassName("ToDo__Desc")[i].textContent);
        LocalTache.date.push(document.getElementsByClassName("ToDo__Date")[i].textContent)
        LocalTache.Checked.push(document.getElementsByClassName("ToDo__Check")[i].innerHTML=='<i class="fas fa-user-check"></i>');
        LocalTache.color.push(document.getElementsByClassName("ToDo__Palette")[i].parentElement.style.backgroundColor)
	}
    
    if(typeof localStorage != "undefined" && JSON){
        
        console.log(JSON.stringify(LocalTache));
        localStorage.setItem("Tache",JSON.stringify(LocalTache));
    }
    else {
        alert("local Storage non suporte sur ce navigateur !");
    }
    
}

/* Fonction de lecture dans le stockage local des taches, leur description et de l'état de leur prise en compte */
function lectureToDolocal() {
	
    if(typeof localStorage != "undefined"){  
        
        let tache = JSON.parse(localStorage.getItem("Tache"));
		console.log(tache);

        if (tache == null){return};

		for(let i = 0; i<tache.Tache.length;i++){

			createTache(tache.Tache[i],tache.Description[i],tache.date[i],tache.Checked[i],tache.color[i]);
        }
        
    }
    else {
        alert(encodeURI("local Storage non suporte sur ce navigateur !"));
    }  
}
/* fonction de vérification du nom d'une tache envoyé en argument */ 
function verifToDoExistant(verif){
    if(typeof localStorage != "undefined"){  
        
        let tache = JSON.parse(localStorage.getItem("Tache"));
		console.log(tache);
        
        if (verif == null){return 0};
        if (tache!=null){
		    for(let i = 0; i<tache.Tache.length;i++){

			    if (tache.Tache[i]== verif) {return -1}
            }
        }
        return 1;
    }
    else {
        alert(encodeURI("local Storage non suporte sur ce navigateur !"));
    } 
}

function eraseList(){

    let index = document.getElementsByClassName("ToDo").length-1;
    
    for (let i=0;i<=index;i++)
    {
        document.getElementsByClassName("ToDo")[0].remove(); 
    }

    ecritureToDoListLocal();
    affCompteTache();
    

}