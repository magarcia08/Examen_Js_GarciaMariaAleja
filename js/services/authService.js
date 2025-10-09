
import { db } from '../storage/storage.js';
export function currentUser(){
  const st=db.read();
  return st.session.currentUserId ? st.users.find(u=>u.id===st.session.currentUserId) : null;
}
export function login({email,password}){
  const st=db.read();
  const u=st.users.find(x=>x.email===email && x.password===password);
  if(!u) throw new Error('Credenciales inválidas');
  st.session.currentUserId = u.id; db.write(st); return u;
}
export function logout(){ const st=db.read(); st.session.currentUserId=null; db.write(st); }
export function register({dni,name,email,phone,password}){
  const st=db.read();
  if(st.users.some(u=>u.email===email)) throw new Error('Email registrado');
  if(st.users.some(u=>u.dni===dni)) throw new Error('DNI registrado');
  if((password||'').length<6) throw new Error('Contraseña mínima 6');
  const u={id:crypto.randomUUID(),dni,name,email,phone,password,role:'user'};
  st.users.push(u); st.session.currentUserId=u.id; db.write(st); return u;
}
