const API_BASE_URL = 'http://localhost:3000'; // Remplacez par l'URL de votre API

window.addEventListener("load", function() {
    getSelect();
    getSelectAnimals();
});

// Exemple de fonction pour effectuer une requête GET pour obtenir la liste des employés
function getEmployes() {
    var message = '';
    fetch(`${API_BASE_URL}/employes`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Liste des employés :', data);

            // Assurez-vous que "employes" existe dans l'objet data
            if (data.employes && Array.isArray(data.employes)) {
                const employePromises = data.employes.map((employe) => {
                    var employeId = employe._id;
                    return fetch(`${API_BASE_URL}/employes/${employeId}/age`)
                        .then((response) => response.json())
                        .then((age) => {
                            console.log(age);
                            message += `<li>Nom : ${employe.nom}, Prénom : ${employe.prenom}, Âge : ${age.age}</li><br>`;
                        });
                });

                // Attendre que toutes les promesses se terminent
                Promise.all(employePromises)
                    .then(() => {
                        // Insérez les noms, prénoms et âges dans l'élément HTML
                        document.getElementById("tousEmployes").innerHTML = `<ul>${message}</ul>`;
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la récupération des âges :', error);
                    });
            } else {
                console.error('Le champ "employes" est absent ou n\'est pas un tableau.');
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des employés :', error);
        });
}


// Exemple de fonction pour effectuer une requête POST pour créer un employé
function createEmploye() {
    var nom = document.getElementById("nom").value;
    var prenom = document.getElementById("prenom").value;
    var dateNaissanceForm = document.getElementById("naissance").value;
    var animal = document.getElementById("animalSelect").value;
    console.log(nom, prenom, dateNaissanceForm);
    const newEmploye = {
        nom: nom,
        prenom: prenom,
        dateNaissance: dateNaissanceForm, // Remplacez par la date de naissance souhaitée
    };

    fetch(`${API_BASE_URL}/employes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmploye)
    })
        .then((response) => response.json())
        .then((data) => {
            var employeCreatedId = data.employe._id;
            document.getElementById("employeCree").innerHTML = `Employé créé : ${nom} ${prenom} né le : ${dateNaissanceForm}= `
            console.log('Employé créé :', data);
            fetch(`${API_BASE_URL}/${employeCreatedId}/addAnimal/${animal}`)
        })
        .catch((error) => {
            console.error("Erreur lors de la création de l'employé :", error);
        });
    
}

function getSelect() {
    fetch(`${API_BASE_URL}/employes`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Liste des employés :', data);

            const selectEmployes = document.getElementById("nomDelete");

            if (data.employes && Array.isArray(data.employes)) {
                data.employes.forEach((employe) => {
                    const option = document.createElement("option");
                    option.value = employe._id; // Utilisez une valeur appropriée pour l'option
                    option.text = `${employe.nom} ${employe.prenom}`;
                    selectEmployes.appendChild(option);
                });
            } else {
                console.error('La propriété "employes" n\'est pas un tableau valide dans la réponse JSON.');
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des employés :', error);
        });

}

function deleteEmploye() {
    var selectEmployes = document.getElementById("nomDelete");
    const employeId = selectEmployes.value; // Récupérez l'ID de l'employé sélectionné

    if (!employeId) {
        console.error("Aucun employé sélectionné.");
        return;
    }

    fetch(`${API_BASE_URL}/employes/${employeId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.status === 200) {
            console.log('Employé supprimé avec succès.');
            // Mettez à jour la liste des employés ou effectuez d'autres actions si nécessaire.
        } else {
            console.error('Erreur lors de la suppression de l\'employé.');
        }
    })
    .catch((error) => {
        console.error('Erreur lors de la suppression de l\'employé :', error);
    });
}

function getSelectAnimals () {
    fetch(`${API_BASE_URL}/animals`)
    .then((response) => response.json())
    .then((animals) => {
        console.log('Liste des animaux :', animals)

        const animalSelect = document.getElementById("animalSelect");

        if (animals.animals && Array.isArray(animals.animals)) {
            animals.animals.forEach((animal) => {
                const option = document.createElement("option");
                option.value = animal._id; // Utilisez une valeur appropriée pour l'option
                option.text = `${animal.nom}`;
                animalSelect.appendChild(option);
            });
        } else {
            console.error('La propriété "employes" n\'est pas un tableau valide dans la réponse JSON.');
        }

})}
