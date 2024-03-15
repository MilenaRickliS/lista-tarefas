import '../Login/estilo.css';
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
        <br/> <br/>
      </div>
    )}
    
    <div className="container">
      <h2>Usuarios</h2>
      <label>Email</label>
      <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Digite um email"
      /> <br/>
      <label>Senha</label>
      <input
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      placeholder="Informe sua senha"
      /> <br/>
      <div className='dolado'>
        <Link to='/tarefas'><button onClick={novoUsuario}>Cadastrar</button></Link>

        <Link to='/tarefas'><button onClick={logarUsuario}>Fazer login</button></Link>
      </div>
      </div>
      <br/><br/>
      
      <hr/>
  </div>
);
}
export default App;