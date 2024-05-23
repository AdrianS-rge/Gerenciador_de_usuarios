document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('user-form');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const nome = formData.get('nome');
        const sobrenome = formData.get('sobrenome');
        const idade = formData.get('idade');
        const email = formData.get('email');

        try {
            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, sobrenome, idade, email })
            });

            if (response.ok) {
                console.log('Usuário adicionado com sucesso!');
                //form.reset(); // Limpa o formulário
                fetchUsers(); // Atualiza a lista de usuários
            } else {
                console.error('Erro ao adicionar usuário:', response.statusText);
            }
        } catch (err) {
            console.error('Erro ao adicionar usuário:', err);
        }
    });
    
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuarios');
            const data = await response.json();
            
            /*if(!Array.isArray(data)) {
                throw new Error('Os dados retornados nao sao um array')
            }*/
            
            const userList = document.getElementById('user-list');
            userList.innerHTML = ''; // Limpa a lista existente

            data.forEach(user => {
                const listItem = document.createElement('li');
                
                const nomeElement = document.createElement('span');
                nomeElement.textContent = `Nome: ${user.nome} ${user.sobrenome} `;
                listItem.appendChild(nomeElement);

                const idadeElement = document.createElement('span');
                idadeElement.textContent = `Idade: ${user.idade} `;
                listItem.appendChild(idadeElement);

                const emailElement = document.createElement('span');
                emailElement.textContent = `Email: ${user.email}`;
                listItem.appendChild(emailElement);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'button';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', async () => {
                    
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/usuarios/${user.id}`, {
                            method: 'DELETE'
                        });

                        if (deleteResponse.ok) {
                            console.log('Usuario removido com sucesso!')
                            fetchUsers(); //Atualiza a lista de usuarios apos remocao
                        } else {
                            console.error('Erro ao remover usuario', deleteResponse.statusText);
                        }
                    } catch (err) {
                        console.log('Erro interno no servidor', err)
                    }
                })

                listItem.appendChild(removeButton);

                listItem.addEventListener('mouseover', () => {
                    removeButton.style.display = "inline"; //mostrar botao ao passar mouse sobre item escolhido
                })

                listItem.addEventListener('mouseout', () => {
                    removeButton.style.display = 'none'; //remover botao ao remover mouse de cima do item desejado
                })
                
                userList.appendChild(listItem);
            });
        } catch (err) {
            console.log('Erro ao obter dados do usuário:', err);
        }
    }

    // Carrega a lista de usuários ao carregar a página
    fetchUsers();
});