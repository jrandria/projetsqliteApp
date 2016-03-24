document.addEventListener("deviceready", onDeviceReady, false);

 function onDeviceReady() {

    //alert("Cordova est bien chargé").

    //Création et Ouverture de la base des données
 
 	var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db"});

 	//création d'une table avec une transaction
    var stmt_create_table='CREATE TABLE IF NOT EXISTS tbl_user(id INTEGER PRIMARY KEY,identifiant TEXT,password TEXT,nom TEXT, prenom text,age INTEGER)';
 	myDB.transaction(
        function(transaction) 
        {
            transaction.executeSql(stmt_create_table, [],
    		function(tx, result) {
    			alert("Table crée avec succès");
    		},
    		function(error) {
    			alert("Des erreurs rencontrés pendant la création de la table."+ error.message);
    		})
	    });
    //---------Fin transation creation de la table-----//

    //On ajoute un événement click sur notre button ajout//
    $("#btnAddUser").on("click",function(){//$("#btnAddUser").click(function(){});

    
        //On récupère les éléments input
            var nom_user=$("#Nom").val();
            var prenom_user=$("#Prenom").val();
            var age_user=$("#Age").val();
            var identifiant_user=$("#Identifiant").val();
            var password_user=$("#Password").val();

            alert("Nom"+nom_user);

            var insert_stmt="INSERT INTO tbl_user (identifiant, password, nom, prenom, age) VALUES (?,?,?,?,?)";
        //On ajoute dans la table avec une transaction
            myDB.transaction(
            function(transaction) 
            {
              transaction.executeSql(""+insert_stmt, 
                [identifiant_user,password_user, nom_user, prenom_user, age_user], 
              function(tx,result){
                        alert("Utilisateur ajouté...");    
              }, 
              function(err){
                        alert("Erreur de l'insertion des données");
               })
            });
        //---------------------//
    });

    //------------Fin onCLick-------------//


    afficheListeUtilisateur();

    $("#btnChargerTbl").on("click",
        function(){
            //Appel d'une fonction que je crée en dehors de onDeviceReady
            afficheListeUtilisateur();
    });



};
//-------------Fin OnDeviceReady----------//

//Fonction pour afficher la liste des utilisateurs
function afficheListeUtilisateur()
{
    alert("Appel de la fonction afficheListeUtilisateur");
        var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db"});
	    myDB.transaction(
        function(transaction) {

            var sqlStmtSelect="SELECT * FROM tbl_user";
            transaction.executeSql(""+sqlStmtSelect,[],
                function(tx,res)
                {
                    for(var i = 0; i < res.rows.length; i++)
                    {
                        $( "#tbodyID" ).empty();
                        $("#tbodyID").append("<tr><td>"+res.rows.item(i).nom+"</td><td>"+res.rows.item(i).prenom+"</td><td>"+res.rows.item(i).age+"</td></tr>");

                    }
                },
                function(err)
                {
                     alert("La base n'existe pas encore");
                }
            );
        });
    //------------Fin select-------------//
}



// //Fonction pour ajouter un utilisateur
// function addUser()
// {
//     //Récuperation des valeurs avec Javascript
//     var nom = document.getElementById("Nom").value;//Nom = $("#Nom").val();  en Jquery
//     var prenom = document.getElementById("Prenom").value;
//     var age = document.getElementById("Age").value;
//     var identifiant = document.getElementById("Identifiant").value;
//     var password= document.getElementById("Password").value;


//     if(name == "")||(prenom == "")||(age == "")||(identifiant == "")||(password == "")
//     {
//         alert("Veuillez remplir correctement");
//         return;
//     }else
//     {
//     	db.transaction(function(tx) {
//         tx.executeSql("INSERT INTO tbl_user (identifiant, password, nom, prenom, age) VALUES (?,?,?,?,?)", [identifiant, password, nom, prenom, age], 
//         	function(tx,res){
//             	alert("Utilisateur ajouté...");    
//         	});
//     	}, function(err){
//         		alert("An error occured while saving the note");
//     		});
//     }



// };