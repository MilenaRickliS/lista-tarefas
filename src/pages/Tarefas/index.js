import '../Tarefas/estilo.css';
import { Link } from "react-router-dom";

// Importa os hooks useState e useEffect do React, que são essenciais para o funcionamento do componente.
import { useState, useEffect } from 'react';
// Importa as funções de conexão com o Firebase e as operações de banco de dados do Firestore.
import { db, auth } from '../../firebaseConnection';
// Importa funções específicas do Firestore para manipulação de documentos e coleções.
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
// Importa funções de autenticação do Firebase para criar usuários, fazer login e logout.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
// Função principal do componente React, que será renderizada na página.
function App() {
  // Estado para armazenar o título do post.
  const [tarefa, setTarefa] = useState('');
  // Estado para armazenar o dia.
  const [dia, setDia] = useState('');
  // Estado para armazenar o ID do post a ser editado ou excluído.
  const [idTarefa, setIdTarefa] = useState('');
  // Estado para armazenar o email e a senha do usuário.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Estado para verificar se o usuário está logado.
  const [user, setUser] = useState(false);
  // Estado para armazenar os detalhes do usuário logado.
  const [userDetail, setUserDetail] = useState({});
  // Estado para armazenar a lista de tarefas.

  const [tarefas, setTarefas] = useState([]);
  // Efeito que carrega os posts do Firestore sempre que o componente é montado.
  useEffect(() => {
    async function loadPosts(){
    const unsub = onSnapshot(collection(db, "lista-tarefas"), (snapshot) => {
    let listaTarefa = [];
    snapshot.forEach((doc) => {
      listaTarefa.push({
        id: doc.id,
        tarefa: doc.data().tarefa,
        dia: doc.data().dia,        
    })
    })
    setTarefas(listaTarefa);
    })
    }
    loadPosts();
  }, [])
  // Efeito que verifica se o usuário está logado quando o componente é montado.
  useEffect(() => {
    async function checkLogin(){
    onAuthStateChanged(auth, (user) => {
    if(user){
      console.log(user);
      setUser(true);
      setUserDetail({
      uid: user.uid,
      email: user.email
    })
    }else{
      setUser(false);
      setUserDetail({})
    }
    })
    }
    checkLogin();
  }, [])
  // Função para adicionar um novo post ao Firestore.

  async function handleAdd(){
    await addDoc(collection(db, "lista-tarefas"), {
      tarefa: tarefa,
      dia: dia,
    })
    .then(() => {
      console.log("CADASTRADO COM SUCESSO")
      setTarefa('');
      setDia('');
    })
    .catch((error) => {
      console.log("ERRO " + error);
    })
  }
  // Função para buscar todos os posts do Firestore.
  async function buscarTarefa(){
    const postsRef = collection(db, "lista-tarefas");
    await getDocs(postsRef)
    .then((snapshot) => {
    let lista = [];
    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        tarefa: doc.data().tarefa,
        dia: doc.data().dia,
    })
    })
    setTarefas(lista);
    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR");
    })
  }
  // Função para editar um post existente no Firestore.
  async function editarTarefa(){
    const docRef = doc(db, "lista-tarefas", idTarefa);
    await updateDoc(docRef, {
      tarefa: tarefa,
      dia: dia
    })
    .then(() => {
      console.log("POST ATUALIZADO!");

      setIdTarefa('');
      setTarefa('');
      setDia('');
    })
    .catch((error) => {
      console.log(error);
    })
  }
  // Função para excluir um post do Firestore.
  async function excluirTarefa(id){
    const docRef = doc(db, "lista-tarefas", id);
    await deleteDoc(docRef)
  .then(() =>{
    alert("POST DELETADO COM SUCESSO!");
  })
  }
  // Função para criar um novo usuário no Firebase Auth.
  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      console.log("CADASTRADO COM SUCESSO!");
      setEmail('');
      setSenha('');
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
      alert("Senha muito fraca.");
    }else if(error.code === 'auth/email-already-in-use'){
      alert("Email já existe!");
    }
  })
  }
  // Função para fazer login de um usuário no Firebase Auth.
  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("USER LOGADO COM SUCESSO");
      console.log(value.user);
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
    })
      setUser(true);

      setEmail('');
      setSenha('');
    })
    .catch(() => {
      console.log("ERRO AO FAZER O LOGIN");
    })
  }
  // Função para fazer logout de um usuário no Firebase Auth.
  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }
// Renderização do componente React.
return (
  <div className='container'>
    <h1>Lista de Tarefas :)</h1>
    { user && (
      <div className='login'>
        <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br/>
        <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
        <button onClick={fazerLogout}>Sair da conta</button>
        <Link to='/'><button>Voltar</button></Link>
        <br/> <br/>
      </div>
    )}
        
      <br/><br/>
      
      <hr/>
      
      <div className="container">
      <h2>TAREFAS</h2>
      <label>ID da Tarefa</label>
      <input
      placeholder='Digite o ID da Tarefa'
      value={idTarefa}
      onChange={ (e) => setIdTarefa(e.target.value) }
      /> <br/>
      <label>Tarefa:</label>
      <textarea
      type="text"
      placeholder='Digite a Tarefa'
      value={tarefa}
      onChange={ (e) => setTarefa(e.target.value) }
      />
      <label>Dia:</label>
      <input
      type="date"
      placeholder="Digite o dia da Tarefa"
      value={dia}
      onChange={(e) => setDia(e.target.value) }
      />
      <div>
        <button onClick={handleAdd}>Adicionar</button>
        <button onClick={buscarTarefa}>Buscar tarefa</button>
        <button onClick={editarTarefa}>Editar tarefa</button>
      </div>

      <ul>
        {tarefas.map( (tarefa) => {
          return(
          <li key={tarefa.id} className='login'>
            <strong>ID: {tarefa.id}</strong> <br/>
            <span>Tarefa: {tarefa.tarefa} </span> <br/>
            <span>Dia: {tarefa.dia}</span> <br/>
            <button onClick={ () => excluirTarefa(tarefa.id) }>Excluir</button> <br/> <br/>
          </li>

          )
        })}
      </ul>
    </div>
  </div>
);
}
export default App;