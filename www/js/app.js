document.addEventListener("deviceready", onDeviceReady, false);

 function onDeviceReady() {

    //alert("Cordova est bien chargé").

    //Création et Ouverture de la base des données
 	var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db"});

    //Appel à une fonction qui center tous les élements de la page
    // centrerLeselementsDelaPageConnexion();
    //Appel de la fonction pour ajouter des Events click sur les boutons
    ajouterEventClick(myDB);

    //Appel de la fonction transation creation de la table-----//
    chargerLaTable(myDB);

    //Appel de la fonction de affchage des élements dans Table
   afficheListeUtilisateur(myDB);

};
//-------------Fin OnDeviceReady----------//
//
function centrerLeselementsDelaPageConnexion()
{
    $('#pageAjout').live('pageshow',function(e,data){    
      $('#index-content').css('margin-top',($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() - $('#index-content').outerHeight())/2);
    });
}

function ajouterEventClick(myDB){
    $("#btnAddUser").on("click",function(){//$("#btnAddUser").click(function(){});
        insertUtilisateur(myDB);//Appel de la fonction insertUtilisateur
    });

    $("#btnChargerTbl").on("click",function(){
            //Appel d'une fonction que je crée en dehors de onDeviceReady
        afficheListeUtilisateur(myDB);
            //Désactiver le bouton une fois cliqué pour que la table n'est appelé plusieurs fois
            //$("#btnChargerTbl").attr('disabled', 'disabled');
            // $('#btnChargerTbl').prop('disabled', true);
    });

    $("#btnConnectUser").on("click",function(){
        testConnectionUtilisateur(myDB);
    });


}



function chargerLaTable(myDB)
{

    //création d'une table avec une transaction
    var stmt_create_table='CREATE TABLE IF NOT EXISTS tbl_user(id INTEGER PRIMARY KEY,identifiant TEXT,password TEXT,nom TEXT, prenom text,age INTEGER)';
    myDB.transaction(
        function(transaction) 
        {
            transaction.executeSql(stmt_create_table, [],
            function(tx, result) {
                // alert("Table crée avec succès");
            },
            function(error) {
                alert("Des erreurs rencontrés pendant la création de la table."+ error.message);
            })
    });
}

//Fonction insertion des utilisateurs
function insertUtilisateur(myDB)
{
    
    //On récupère les éléments input
        var nom_user=$("#Nom").val();
        var prenom_user=$("#Prenom").val();
        var age_user=$("#Age").val();
        var identifiant_user=$("#Identifiant").val();
        var password_user=$("#Password").val();


        var insert_stmt="INSERT INTO tbl_user (identifiant, password, nom, prenom, age) VALUES (?,?,?,?,?)";
        //On ajoute dans la table avec une transaction
        myDB.transaction(
            function(transaction) 
            {
              transaction.executeSql(""+insert_stmt, 
                [identifiant_user,password_user, nom_user, prenom_user, age_user], 
              function(tx,result){
                        alert("Utilisateur ajouté avec succès...");
                        //alert("insertId: " + result.insertId );//id du dernier élement ajouté
                        //alert("rowsAffected: " + result.rowsAffected ); //le nombre de colonne affecté par la requete (1 içi)
                        //On appel uen fonction qui ne sélection que le dernier élement ajouté dans la table
                        var lastInsertId=result.insertId;
                        afficheListeUtilisateurById(myDB,lastInsertId);//deux paramètres 
              }, 
              function(err){
                        alert("Erreur de l'insertion des données");
               })
        });
}

//Fonction pour afficher seulement le dernier élément ajouté
function afficheListeUtilisateurById(myDB,lastInsertId){

        myDB.transaction(
            function(transaction)
            {
            var sqlStmtSelectByID="SELECT * FROM tbl_user WHERE id="+lastInsertId;
            transaction.executeSql(""+sqlStmtSelectByID,[],
                function(tx,res)
                {
                   $("#tbodyID").append("<tr><td>"+res.rows.item(0).nom+"</td><td>"+res.rows.item(0).prenom+"</td><td>"+res.rows.item(0).age+"</td><td>"+res.rows.item(0).identifiant+"</td></tr>");

                },
                function(err)
                {
                    alert("erreurs dans la selection by ID");
                });

            });

}

//Fonction pour afficher la liste des utilisateurs
function afficheListeUtilisateur(myDB)
{
       // alert("Appel de la fonction afficheListeUtilisateur");
	    myDB.transaction(
        function(transaction) {

            var sqlStmtSelect="SELECT * FROM tbl_user";
            transaction.executeSql(""+sqlStmtSelect,[],
                function(tx,res)
                {
                    for(var i = 0; i < res.rows.length; i++)
                    {
                        // $( "#tbodyID" ).empty();
                        $("#tbodyID").append("<tr><td>"+res.rows.item(i).nom+"</td><td>"+res.rows.item(i).prenom+"</td><td>"+res.rows.item(i).age+"</td><td>"+res.rows.item(i).identifiant+"</td></tr>");

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


function testConnectionUtilisateur(myDB){
    //On récupère les éléments input
        var identifiant_passe=$("#IdentifiantUser").val();
        var password_passe=$("#PasswordUser").val();

        alert("Identifiant: "+identifiant_passe+" /n Password: "+password_passe);

        var selectbyidentifiant_stmt="SELECT identifiant,password FROM tbl_user WHERE identifiant=? AND password=?" 
        myDB.transaction(
            function(transaction) 
            {
              transaction.executeSql(""+selectbyidentifiant_stmt, [identifiant_passe,password_passe], 
              function(tx,result){
                alert("Length"+result.rows.length);
                if (result.rows.length>0) {
                    alert("Cet utilisateur est bien enregistré");
                }else{
                    alert("Il s'agit d'un utilisateur non enregistré");
                }
              }, 
              function(err){
                        alert("Erreur de l'insertion des données");
               })
        });

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