import { useEffect, useState } from 'react'
import axios, { Axios } from 'axios';
import './App.css'


function App() {
  const [alunos, setAlunos] = useState("");
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [bimestre, setBimestre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");

 const [validateNome, setValidateNome] = useState("");
 const [validateMatricula, setValidateMatricula] = useState("");


 
function clearFields(){
  setId("");
  setNome("");
  setBimestre("");
  setMatricula("");
  setCurso("");
  setValidateNome('');
  setValidateMatricula('');
}

async function getAll(){
  try {
    const response = await axios.get("https://api-aluno.vercel.app/aluno");
    setAlunos(response.data);
  } catch (error) {
    console.log("Erro ao buscar alunos");
  }
}


async function addAluno(event){
  event.preventDefault();

  if(validate()){
    return
  }
  
  function validate(){
    let validado = false;
    if(nome === ""){
      setValidateNome("Campo Obrigatório!")
      validado = true;
    }else {
      setValidateNome("");
    }

    if(matricula === "" ){
      setValidateMatricula("Campo Obrigatório!")
      validado = true
    }else { 
      setValidateMatricula('');
    }

    return validado;
  }

  try {
    await axios.post("https://api-aluno.vercel.app/aluno", {
      nome: nome,
      matricula: matricula,
      curso: curso,
      bimestre: bimestre,
    });
    clearFields();
    getAll();
  } catch (error) {
    console.log("Erro ao cadastrar aluno");
  }
}

function preencherForm(aluno){
  setId(aluno._id);
  setNome(aluno.nome);
  setBimestre(aluno.bimestre);
  setMatricula(aluno.matricula);
  setCurso(aluno.curso);
}

async function editAluno(event){
  event.preventDefault();

  try {
    await axios.put(`https://api-aluno.vercel.app/aluno/${id}`, {
      nome: nome,
      matricula: matricula,
      curso: curso,
      bimestre: bimestre,
    });
    clearFields();
    getAll();
  } catch (error) {
    console.log("Erro ao editar aluno");
  }
}

async function deleteAluno(id){
  try {
    await axios.delete(`https://api-aluno.vercel.app/aluno/${id}`);
    getAll();
  } catch (error) {
    console.log("Erro ao deletar aluno");
  }
}

useEffect(() => {
  getAll();
}, []);

  
  return (
    
    <div className="container">
      <div className="boxCadastro">
        <form onSubmit={id ? editAluno : addAluno}>
         <h2 id="formTitle">{id ? "Editar" : "Cadastrar"} Aluno</h2>

         <input type="text" value={nome} placeholder='Nome' maxLength={30}  onChange={(event) => setNome(event.target.value)}/>
         <small>{validateNome}</small>

         <input type="text" value={matricula} placeholder='Matricula' maxLength={30}  onChange={(event) => setMatricula(event.target.value)}/>
         <small>{validateMatricula}</small>
        
        <input type="text" value={curso} placeholder="Curso" onChange={(event) => setCurso(event.target.value)} />

        <input type="text" value={bimestre} placeholder="Bimestre" onChange={(event) => setBimestre(event.target.value)} />  
        
        <input type="submit" value={id ? "Salvar" : "Cadastrar"}  />
        </form>
      </div>
      
      <div className='boxTarefas'>
        <header>
          <h1>Alunos</h1>
          <p>total: {alunos.length} alunos</p>
        </header>
        
        {alunos.length > 0 ?(
          <ul>
          {alunos.map((item) => (
            <li key={item._id}>
              <div className='card'>
                <div className='cardLeft'>
                  <h2 className='cardTitle'>{item.nome}</h2>
                  <p className='cardDescription'>Curso: {item.curso}</p>
                  <p className='cardDescription'>Bimestre: {item.bimestre}</p>
                </div>
             
            
              <div className='cardRight'>
                <h3 className='cardCategory'>Matrícula: {item.matricula}</h3>
                <div className="btns">
                  <button className='editBtn'onClick={() => preencherForm(item)}></button>
                  <button className='deleteBtn' onClick={() => deleteAluno(item._id)}></button>
                </div>
              </div>
              </div>
            </li>
          ))}
          </ul>
        ) : (
          <p>Nenhum aluno cadastrado</p>
        )}

        
      </div>
    </div>
  )
}

export default App
